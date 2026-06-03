/**
 * Company Enrichment Service
 * Research and enrich company information using Gemini search API
 */

import {
  CompanyEnrichmentRaw,
  CompanyEnriched,
  CompanyEnrichmentRequest,
  CompanyEnrichmentResult,
  EnrichmentOptions,
  EnrichmentConfig,
  ParsedEnrichmentResponse,
  RateLimitTracker,
  CompanyCacheEntry,
  DatabaseUpdateResult,
  BatchEnrichmentResult,
} from '@/types/company-enrichment';
import { createEnrichmentPrompt } from './company-enrichment-prompt';
import { prisma } from '@/lib/prisma';

/**
 * Company Enrichment Service
 * Manages company research, caching, and rate limiting
 */
export class CompanyEnrichmentService {
  private static instance: CompanyEnrichmentService;
  private cache: Map<string, CompanyCacheEntry> = new Map();
  private rateLimitTracker: RateLimitTracker = {
    requestCount: 0,
    windowStart: Date.now(),
    resetAt: Date.now() + 60000,
  };

  private config: EnrichmentConfig = {
    maxRequestsPerMinute: 30, // Gemini free tier
    cacheMaxSize: 1000,
    defaultCacheTTL: 86400 * 7, // 7 days
    retryAttempts: 2,
    retryBackoff: 1000, // 1 second
    requestTimeout: 30000, // 30 seconds
    geminiFreeModel: 'gemini-2.5-flash',
  };

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): CompanyEnrichmentService {
    if (!CompanyEnrichmentService.instance) {
      CompanyEnrichmentService.instance = new CompanyEnrichmentService();
    }
    return CompanyEnrichmentService.instance;
  }

  /**
   * Enrich company data
   */
  async enrich(options: EnrichmentOptions): Promise<CompanyEnrichmentResult> {
    const startTime = Date.now();

    try {
      // Normalize company name
      const normalizedName = this.normalizeName(options.companyName);

      // Check cache
      if (options.useCache !== false) {
        const cached = this.getFromCache(normalizedName);
        if (cached) {
          return {
            success: true,
            data: cached,
            cached: true,
            processingTime: Date.now() - startTime,
          };
        }
      }

      // Check if enrichment needed
      if (options.skipIfComplete && this.isDataComplete(options.currentData)) {
        return {
          success: true,
          data: this.buildEnrichedData(
            options.currentData as CompanyEnrichmentRaw,
            100,
            'high'
          ),
          cached: false,
          processingTime: Date.now() - startTime,
        };
      }

      // Check rate limit
      if (!this.checkRateLimit()) {
        return {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: `Rate limit exceeded. Max ${this.config.maxRequestsPerMinute} requests per minute`,
            details: {
              resetAt: this.rateLimitTracker.resetAt,
              waitSeconds: Math.ceil(
                (this.rateLimitTracker.resetAt - Date.now()) / 1000
              ),
            },
          },
          cached: false,
          processingTime: Date.now() - startTime,
        };
      }

      // Perform enrichment with retry
      const result = await this.enrichWithRetry(
        options.companyName,
        options.retries || this.config.retryAttempts,
        options.timeout || this.config.requestTimeout
      );

      if (!result.success) {
        return result;
      }

      // Merge with existing data
      const enrichedData = this.mergeData(options.currentData, result.data!);

      // Cache result
      if (options.useCache !== false) {
        this.setInCache(
          normalizedName,
          enrichedData,
          options.cacheTTL || this.config.defaultCacheTTL
        );
      }

      return {
        success: true,
        data: enrichedData,
        cached: false,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ENRICHMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error instanceof Error ? { stack: error.stack } : {},
        },
        cached: false,
        processingTime: Date.now() - startTime,
      };
    }
  }

  /**
   * Enrich company with retry logic
   */
  private async enrichWithRetry(
    companyName: string,
    maxRetries: number,
    timeout: number
  ): Promise<CompanyEnrichmentResult> {
    let lastError: CompanyEnrichmentResult | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await this.callGeminiSearch(companyName, timeout);

      if (result.success) {
        return result;
      }

      lastError = result;

      // Exponential backoff
      if (attempt < maxRetries) {
        const delayMs = this.config.retryBackoff * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    return (
      lastError || {
        success: false,
        error: {
          code: 'MAX_RETRIES_EXCEEDED',
          message: `Enrichment failed after ${maxRetries} attempts`,
        },
        cached: false,
        processingTime: 0,
      }
    );
  }

  /**
   * Call Gemini search API
   */
  private async callGeminiSearch(
    companyName: string,
    timeout: number
  ): Promise<CompanyEnrichmentResult> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const prompt = createEnrichmentPrompt(companyName);

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': process.env.GEMINI_API_KEY || '',
          },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: prompt.systemPrompt }],
            },
            contents: {
              parts: [{ text: prompt.userPrompt }],
            },
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.1, // Low for consistency
              topP: 0.95,
              topK: 40,
            },
            tools: [
              {
                googleSearch: {},
              },
            ],
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        );
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!content) {
        throw new Error('No content in Gemini response');
      }

      const parsed = this.parseEnrichmentResponse(content);
      const enrichedData = this.buildEnrichedData(
        parsed.data,
        parsed.confidence,
        parsed.dataQuality
      );

      return {
        success: true,
        data: enrichedData,
        cached: false,
        processingTime: 0,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout (${timeout}ms)`);
      }
      throw error;
    }
  }

  /**
   * Parse enrichment response
   */
  private parseEnrichmentResponse(
    responseText: string
  ): ParsedEnrichmentResponse {
    try {
      let jsonText = responseText;

      // Remove markdown code blocks
      if (jsonText.includes('```json')) {
        jsonText = jsonText.split('```json')[1].split('```')[0];
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.split('```')[1].split('```')[0];
      }

      jsonText = jsonText.trim();
      const parsed = JSON.parse(jsonText);

      return {
        data: this.normalizeEnrichmentData(parsed),
        confidence: Math.max(0, Math.min(100, parsed.confidence || 0)),
        dataQuality: parsed.dataQuality || 'medium',
        raw: responseText,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse enrichment response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Normalize enrichment data
   */
  private normalizeEnrichmentData(data: any): CompanyEnrichmentRaw {
    return {
      website: this.normalizeUrl(data.website),
      industry: this.normalizeString(data.industry),
      companySize: this.normalizeCompanySize(data.companySize),
      headquarters: this.normalizeString(data.headquarters),
      foundedYear: this.normalizeYear(data.foundedYear),
      linkedinUrl: this.normalizeUrl(data.linkedinUrl),
      about: this.normalizeString(data.about),
    };
  }

  /**
   * Normalize URL
   */
  private normalizeUrl(url: any): string | null {
    if (!url) return null;
    const str = String(url).trim().toLowerCase();
    if (!str.startsWith('http')) {
      return `https://${str}`;
    }
    return str;
  }

  /**
   * Normalize string
   */
  private normalizeString(value: any): string | null {
    if (!value) return null;
    const str = String(value).trim();
    return str.length > 0 ? str : null;
  }

  /**
   * Normalize company size
   */
  private normalizeCompanySize(value: any): string | null {
    if (!value) return null;
    const sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
    const normalized = String(value).trim();
    return sizes.includes(normalized) ? normalized : null;
  }

  /**
   * Normalize year
   */
  private normalizeYear(value: any): number | null {
    if (!value) return null;
    const num = Number(value);
    const currentYear = new Date().getFullYear();
    if (isNaN(num) || num < 1800 || num > currentYear) {
      return null;
    }
    return num;
  }

  /**
   * Check rate limit
   */
  private checkRateLimit(): boolean {
    const now = Date.now();

    // Reset if window expired
    if (now > this.rateLimitTracker.resetAt) {
      this.rateLimitTracker.requestCount = 0;
      this.rateLimitTracker.windowStart = now;
      this.rateLimitTracker.resetAt = now + 60000;
    }

    // Check limit
    if (
      this.rateLimitTracker.requestCount >= this.config.maxRequestsPerMinute
    ) {
      return false;
    }

    // Increment counter
    this.rateLimitTracker.requestCount++;
    return true;
  }

  /**
   * Get from cache
   */
  private getFromCache(normalizedName: string): CompanyEnriched | null {
    const entry = this.cache.get(normalizedName);
    if (!entry) return null;

    // Check TTL
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(normalizedName);
      return null;
    }

    return entry.data;
  }

  /**
   * Set in cache
   */
  private setInCache(
    normalizedName: string,
    data: CompanyEnriched,
    ttl: number
  ): void {
    // Implement LRU eviction if cache full
    if (this.cache.size >= this.config.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const entry: CompanyCacheEntry = {
      companyName: data.website || normalizedName,
      normalizedName,
      data,
      timestamp: Date.now(),
      ttl,
    };

    this.cache.set(normalizedName, entry);
  }

  /**
   * Check if data is complete
   */
  private isDataComplete(data?: Partial<CompanyEnrichmentRaw>): boolean {
    if (!data) return false;
    const required = [
      'website',
      'industry',
      'companySize',
      'headquarters',
      'linkedinUrl',
    ];
    return required.every((field) => data[field as keyof CompanyEnrichmentRaw]);
  }

  /**
   * Merge data
   */
  private mergeData(
    existing: Partial<CompanyEnrichmentRaw> | undefined,
    enriched: CompanyEnriched
  ): CompanyEnriched {
    return {
      website: enriched.website || existing?.website || null,
      industry: enriched.industry || existing?.industry || null,
      companySize: enriched.companySize || existing?.companySize || null,
      headquarters: enriched.headquarters || existing?.headquarters || null,
      foundedYear: enriched.foundedYear || existing?.foundedYear || null,
      linkedinUrl: enriched.linkedinUrl || existing?.linkedinUrl || null,
      about: enriched.about || existing?.about || null,
      enrichedAt: enriched.enrichedAt,
      source: enriched.source,
      confidence: enriched.confidence,
      dataQuality: enriched.dataQuality,
    };
  }

  /**
   * Build enriched data
   */
  private buildEnrichedData(
    data: CompanyEnrichmentRaw,
    confidence: number,
    dataQuality: 'high' | 'medium' | 'low'
  ): CompanyEnriched {
    return {
      ...data,
      enrichedAt: new Date().toISOString(),
      source: 'gemini',
      confidence,
      dataQuality,
    };
  }

  /**
   * Normalize company name
   */
  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s]/g, '');
  }

  /**
   * Update company in database
   */
  async updateCompanyInDatabase(
    companyId: string,
    enrichedData: CompanyEnriched
  ): Promise<DatabaseUpdateResult> {
    try {
      const existingCompany = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!existingCompany) {
        throw new Error(`Company ${companyId} not found`);
      }

      const updateData: Record<string, any> = {};
      const fieldsUpdated: (keyof CompanyEnrichmentRaw)[] = [];
      const previousValues: Record<string, any> = {};

      // Only update if enriched data has values
      if (enrichedData.website && !existingCompany.website) {
        updateData.website = enrichedData.website;
        fieldsUpdated.push('website');
        previousValues.website = existingCompany.website;
      }

      if (enrichedData.industry && !existingCompany.industry) {
        updateData.industry = enrichedData.industry;
        fieldsUpdated.push('industry');
        previousValues.industry = existingCompany.industry;
      }

      if (enrichedData.headquarters && !existingCompany.headquarters) {
        updateData.headquarters = enrichedData.headquarters;
        fieldsUpdated.push('headquarters');
        previousValues.headquarters = existingCompany.headquarters;
      }

      if (enrichedData.foundedYear && !existingCompany.founded) {
        updateData.founded = enrichedData.foundedYear;
        fieldsUpdated.push('foundedYear');
        previousValues.foundedYear = existingCompany.founded;
      }

      if (enrichedData.linkedinUrl && !existingCompany.linkedinUrl) {
        updateData.linkedinUrl = enrichedData.linkedinUrl;
        fieldsUpdated.push('linkedinUrl');
        previousValues.linkedinUrl = existingCompany.linkedinUrl;
      }

      // Update if there are changes
      if (fieldsUpdated.length > 0) {
        updateData.updatedAt = new Date();

        const updated = await prisma.company.update({
          where: { id: companyId },
          data: updateData,
        });

        return {
          updated: true,
          companyId,
          fieldsUpdated,
          previousValues,
          newValues: enrichedData,
        };
      }

      return {
        updated: false,
        companyId,
        fieldsUpdated: [],
        previousValues: {},
        newValues: enrichedData,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Batch enrich companies
   */
  async batchEnrich(companyNames: string[]): Promise<BatchEnrichmentResult> {
    const startTime = Date.now();
    const successful: Array<{ companyName: string; data: CompanyEnriched }> =
      [];
    const failed: Array<{ companyName: string; error: any }> = [];
    let cachedCount = 0;

    for (const name of companyNames) {
      const result = await this.enrich({ companyName: name });

      if (result.success && result.data) {
        successful.push({ companyName: name, data: result.data });
        if (result.cached) cachedCount++;
      } else if (result.error) {
        failed.push({ companyName: name, error: result.error });
      }
    }

    return {
      successful,
      failed,
      cached: cachedCount,
      processingTime: Date.now() - startTime,
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; maxSize: number; entries: number } {
    return {
      size: this.cache.size,
      maxSize: this.config.cacheMaxSize,
      entries: this.cache.size,
    };
  }

  /**
   * Get rate limit stats
   */
  getRateLimitStats(): {
    requestCount: number;
    maxRequests: number;
    resetAt: number;
    windowStart: number;
  } {
    return {
      requestCount: this.rateLimitTracker.requestCount,
      maxRequests: this.config.maxRequestsPerMinute,
      resetAt: this.rateLimitTracker.resetAt,
      windowStart: this.rateLimitTracker.windowStart,
    };
  }
}

/**
 * Get service instance
 */
export function getEnrichmentService(): CompanyEnrichmentService {
  return CompanyEnrichmentService.getInstance();
}
