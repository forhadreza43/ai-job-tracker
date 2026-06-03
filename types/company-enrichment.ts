/**
 * Company Enrichment Types
 * Data structures for company research and enrichment
 */

/**
 * Raw company data from enrichment service
 */
export interface CompanyEnrichmentRaw {
  website: string | null;
  industry: string | null;
  companySize: string | null; // "1-10", "11-50", "51-200", "201-500", "500+"
  headquarters: string | null;
  foundedYear: number | null;
  linkedinUrl: string | null;
  about: string | null;
}

/**
 * Enriched company data with metadata
 */
export interface CompanyEnriched extends CompanyEnrichmentRaw {
  enrichedAt: string; // ISO 8601
  source: 'gemini' | 'cache' | 'fallback';
  confidence: number; // 0-100
  dataQuality: 'high' | 'medium' | 'low';
}

/**
 * Company enrichment request
 */
export interface CompanyEnrichmentRequest {
  companyName: string;
  currentData?: Partial<CompanyEnrichmentRaw>; // Existing data to augment
}

/**
 * Company enrichment result
 */
export interface CompanyEnrichmentResult {
  success: boolean;
  data?: CompanyEnriched;
  error?: EnrichmentError;
  cached: boolean;
  processingTime: number; // milliseconds
}

/**
 * Enrichment error
 */
export interface EnrichmentError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Cache entry for enriched company
 */
export interface CompanyCacheEntry {
  companyName: string;
  normalizedName: string;
  data: CompanyEnriched;
  timestamp: number; // Unix timestamp
  ttl: number; // Time-to-live in seconds
}

/**
 * Rate limit tracker
 */
export interface RateLimitTracker {
  requestCount: number;
  windowStart: number; // Unix timestamp
  resetAt: number; // Unix timestamp
}

/**
 * Enrichment service options
 */
export interface EnrichmentOptions {
  companyName: string;
  currentData?: Partial<CompanyEnrichmentRaw>;
  useCache?: boolean;
  cacheTTL?: number; // seconds
  retries?: number;
  timeout?: number; // milliseconds
  skipIfComplete?: boolean; // Skip if all fields filled
}

/**
 * Enrichment service configuration
 */
export interface EnrichmentConfig {
  maxRequestsPerMinute: number;
  cacheMaxSize: number;
  defaultCacheTTL: number; // seconds
  retryAttempts: number;
  retryBackoff: number; // milliseconds
  requestTimeout: number; // milliseconds
  geminiFreeModel: string; // Model with search capability
}

/**
 * Batch enrichment result
 */
export interface BatchEnrichmentResult {
  successful: Array<{ companyName: string; data: CompanyEnriched }>;
  failed: Array<{ companyName: string; error: EnrichmentError }>;
  cached: number;
  processingTime: number;
}

/**
 * Gemini search response
 */
export interface GeminiSearchResponse {
  content: {
    parts: Array<{
      text: string;
    }>;
  };
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

/**
 * Parsed enrichment response
 */
export interface ParsedEnrichmentResponse {
  data: CompanyEnrichmentRaw;
  confidence: number;
  dataQuality: 'high' | 'medium' | 'low';
  raw: string;
}

/**
 * Database update result
 */
export interface DatabaseUpdateResult {
  updated: boolean;
  companyId: string;
  fieldsUpdated: (keyof CompanyEnrichmentRaw)[];
  previousValues: Partial<CompanyEnrichmentRaw>;
  newValues: CompanyEnrichmentRaw;
}
