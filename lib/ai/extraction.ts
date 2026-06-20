'use server';

import {
  ExtractionResult,
  JobExtraction,
  JobExtractionRaw,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ExtractionOptions,
  ParsedGeminiResponse,
  WorkMode,
  JobType,
  ExperienceLevel,
} from '@/types/job-extraction';
import { createExtractionPrompt } from './extraction-prompt';
import {
  normalize,
  normalizeArray,
  normalizeBoolean,
  normalizeDate,
  normalizeEnum,
  normalizeNumber,
} from './normalization';
import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI client (reads GEMINI_API_KEY from process.env automatically)
const ai = new GoogleGenAI({});

// Extract job information from raw description using Gemini API
export async function extractJobData(
  options: ExtractionOptions
): Promise<ExtractionResult> {
  const startTime = Date.now();

  try {
    // Validate input
    if (!options.rawDescription || options.rawDescription.trim().length === 0) {
      return {
        success: false,
        error: {
          code: 'EMPTY_INPUT',
          message: 'Job description is empty',
        },
        processingTime: Date.now() - startTime,
      };
    }

    // STEP 1: Fast & Deterministic Job Extraction (No Search Tool)
    // Call Gemini API
    const apiResponse = await callGeminiAPI(
      options.rawDescription,
      options.modelName || 'gemini-2.5-flash',
      options.timeout || 30000
    );

    // Parse response
    const parsed = await parseGeminiResponse(apiResponse);

    // Validate extracted data
    const validation = await validateExtraction(parsed.extraction);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Extracted data failed validation',
        },
        processingTime: Date.now() - startTime,
      };
    }

    // Create extraction result
    const extraction: JobExtraction = {
      ...(validation.data as JobExtractionRaw),
      confidence: parsed.confidence,
      extractedAt: new Date().toISOString(),
      model: options.modelName || 'gemini-2.5-flash',
      rawText: options.rawDescription,
    };

    // Check if validation failed and enforceValidation is true
    if (options.enforceValidation && !validation.isValid) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Extracted data failed validation',
          details: {
            errors: validation.errors,
            warnings: validation.warnings,
          },
        },
        validation,
        processingTime: Date.now() - startTime,
      };
    }

    // STEP 2: Grounded Company Deep Research (Only if companyName is found)
    // if (extraction.companyName) {
    //   try {
    //     // We give this a separate timeout as web searching can take longer
    //     const companyInfo = await gatherCompanyInformation(
    //       extraction.companyName,
    //       options.modelName || 'gemini-2.5-flash',
    //       45000
    //     );

    //     // Attach the gathered profile directly to your extraction object
    //     extraction.companyProfile = companyInfo;
    //   } catch (searchError) {
    //     console.error(
    //       'Failed to gather company info, skipping enrichment:',
    //       searchError
    //     );
    //     extraction.companyProfile = null; // Don't crash the whole pipeline if Google search fails
    //   }
    // }

    return {
      success: true,
      data: extraction,
      validation,
      processingTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'EXTRACTION_ERROR',
        message:
          error instanceof Error ? error.message : 'Unknown extraction error',
        details: error instanceof Error ? { stack: error.stack } : {},
      },
      processingTime: Date.now() - startTime,
    };
  }
}

async function callGeminiAPI(
  description: string,
  model: string = 'gemini-2.5-flash',
  timeout: number = 30000
): Promise<string> {
  const prompt = createExtractionPrompt(description);

  // Setup abort controller handling for custom timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt.userPrompt,
      config: {
        // Enforces strict JSON structural constraints directly via API engine
        responseMimeType: 'application/json',
        systemInstruction: prompt.systemPrompt,
        temperature: 0.1, // Keeps structural matching deterministic
        topP: 0.95,
        topK: 40,
      },
    });

    clearTimeout(timeoutId);

    if (!response.text) {
      throw new Error('No content received in Gemini response context');
    }

    return response.text;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Gemini API request timeout reached (${timeout}ms)`);
    }
    throw error;
  }
}

// async function gatherCompanyInformation(
//   companyName: string,
//   model: string = 'gemini-2.5-flash',
//   timeout: number = 45000
// ): Promise<any> {
//   const systemInstruction = `You are a real-time corporate intelligence web crawler. Your primary source of truth is the live internet via Google Search.

// CRITICAL OPERATION RULES:
// 1. First, execute a Google Search to locate information, the official website, and corporate details for the company.
// 2. Read the search results and look for facts regarding their industry, size, foundation year, headquarters, mission, and tech stack.
// 3. Map those discovered search results into the requested JSON schema.
// 4. If a specific field cannot be verified in the search results, set it to null. Do not invent data.`;

//   // FIX: Make the user prompt a direct, clear search directive.
//   // Do not mention schemas or structures in the prompt text itself.
//   const userPrompt = `Search the live internet for corporate data, tech stack, and background information regarding the company: "${companyName}"`;

//   try {
//     const response = await ai.models.generateContent({
//       model: model,
//       contents: userPrompt, // Direct language forces the model to trigger the search tool immediately
//       config: {
//         responseMimeType: 'application/json',
//         systemInstruction: systemInstruction,
//         temperature: 0.0,
//         tools: [
//           {
//             // Enforces the Google Search Grounding connection
//             googleSearch: {},
//           },
//         ],
//         httpOptions: {
//           timeout: timeout,
//         },
//         responseSchema: {
//           type: 'OBJECT',
//           properties: {
//             about: { type: 'STRING', nullable: true },
//             website: { type: 'STRING', nullable: true },
//             logo: { type: 'STRING', nullable: true },
//             industry: { type: 'STRING', nullable: true },
//             size: { type: 'STRING', nullable: true },
//             founded: { type: 'INTEGER', nullable: true },
//             headquarters: { type: 'STRING', nullable: true },
//             mission: { type: 'STRING', nullable: true },
//             vision: { type: 'STRING', nullable: true },
//             linkedinUrl: { type: 'STRING', nullable: true },
//             careersPage: { type: 'STRING', nullable: true },
//             techStack: {
//               type: 'ARRAY',
//               items: { type: 'STRING' },
//               nullable: true,
//             },
//           },
//           // FIX: Do not enforce everything as strictly required if the search might miss it.
//           // Enforcing 'about' and 'website' ensures you get core data, but lets the rest be flexible.
//           required: ['about', 'website'],
//         },
//       },
//     });

//     if (!response.text) {
//       throw new Error('No data received from company research engine');
//     }

//     console.log('COMPANY ENRICHMENT RAW PAYLOAD:', response.text);
//     return JSON.parse(response.text);
//   } catch (error) {
//     // Log the actual underlying error so you can see exactly why it failed
//     console.error(`Error during company lookup for ${companyName}:`, error);

//     // Return null fallback so the parent job parser pipeline continues working smoothly
//     return null;
//   }
// }

// async function gatherCompanyInformation(
//   companyName: string,
//   model: string = 'gemini-2.5-flash',
//   timeout: number = 45000
// ): Promise<any> {
//   const systemInstruction = `You are a corporate intelligence agent. Your job is to research and look up accurate, real-world data about the requested company using Google Search.

//   Fill out the requested JSON schema exactly. If a specific field cannot be confidently verified on the internet, set it to null. Do not invent or hallucinate data.
//   Return arrays for techStack based on technical blogs, job postings, or engineering stack shares found for this company.`;

//   const userPrompt = `Perform deep research on the company named: "${companyName}". Gather their background profile, matching their exact corporate structure.`;

//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), timeout);

//   try {
//     const response = await ai.models.generateContent({
//       model: model,
//       contents: userPrompt,
//       config: {
//         responseMimeType: 'application/json',
//         systemInstruction: systemInstruction,
//         temperature: 0.2, // Low temperature keeps it analytical and factual
//         tools: [
//           {
//             googleSearch: {}, // Explicitly enabled ONLY for company research
//           },
//         ],
//         // Passing the responseSchema guarantees your Prisma mappings won't break
//         responseSchema: {
//           type: 'OBJECT',
//           properties: {
//             about: { type: 'STRING', nullable: true },
//             website: { type: 'STRING', nullable: true },
//             logo: { type: 'STRING', nullable: true },
//             industry: { type: 'STRING', nullable: true },
//             size: { type: 'STRING', nullable: true },
//             founded: { type: 'INTEGER', nullable: true },
//             headquarters: { type: 'STRING', nullable: true },
//             mission: { type: 'STRING', nullable: true },
//             vision: { type: 'STRING', nullable: true },
//             linkedinUrl: { type: 'STRING', nullable: true },
//             careersPage: { type: 'STRING', nullable: true },
//             techStack: {
//               type: 'ARRAY',
//               items: { type: 'STRING' },
//               nullable: true,
//             },
//           },
//           required: [
//             'about',
//             'website',
//             'industry',
//             'size',
//             'founded',
//             'headquarters',
//             'techStack',
//           ],
//         },
//       },
//     });

//     clearTimeout(timeoutId);

//     if (!response.text) {
//       throw new Error('No data received from company research engine');
//     }

//     return JSON.parse(response.text);
//   } catch (error) {
//     clearTimeout(timeoutId);
//     if (error instanceof Error && error.name === 'AbortError') {
//       throw new Error(
//         `Company intelligence lookup timeout reached (${timeout}ms)`
//       );
//     }
//     throw error;
//   }
// }

// Parse Gemini API response
export async function parseGeminiResponse(
  responseText: string
): Promise<ParsedGeminiResponse> {
  try {
    // Extract JSON from response (handle markdown code blocks)
    let jsonText = responseText;

    // Remove markdown code blocks if present
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0];
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0];
    }

    jsonText = jsonText.trim();

    // Parse JSON
    const parsed = JSON.parse(jsonText);

    // Extract confidence
    const confidence = Math.max(0, Math.min(100, parsed.confidence || 0));

    const extractionData =
      parsed.extraction || parsed.data || parsed.job || parsed;

    const extraction: JobExtractionRaw = normalizeExtractedData(extractionData);

    return {
      extraction,
      confidence,
      raw: responseText,
    };
  } catch (error) {
    throw new Error(
      `Failed to parse Gemini response: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Normalize extracted data to match types
function normalizeExtractedData(data: any): JobExtractionRaw {
  return {
    companyName: normalize(data.companyName),
    title: normalize(data.title),
    role: normalize(data.role),
    location: normalize(data.location),
    workMode: normalizeEnum(data.workMode, Object.values(WorkMode)) as WorkMode,
    jobType: normalizeEnum(data.jobType, Object.values(JobType)) as JobType,
    experienceLevel: normalizeEnum(
      data.experienceLevel,
      Object.values(ExperienceLevel)
    ) as ExperienceLevel,
    experienceRequired: normalize(data.experienceRequired),
    vacancy: normalizeNumber(data.vacancy),
    officeTime: normalize(data.officeTime),
    source: normalize(data.source),
    sourceUrl: normalize(data.sourceUrl),
    circularDate: normalizeDate(data.circularDate),
    applicationDeadline: normalizeDate(data.applicationDeadline),
    salaryMin: normalizeNumber(data.salaryMin),
    salaryMax: normalizeNumber(data.salaryMax),
    salaryCurrency: normalize(data.salaryCurrency?.toUpperCase()),
    salaryNegotiable: normalizeBoolean(data.salaryNegotiable),
    skills: normalizeArray(data.skills),
    responsibilities: normalizeArray(data.responsibilities),
    qualifications: normalizeArray(data.qualifications),
    niceToHave: normalizeArray(data.niceToHave),
    benefits: normalizeArray(data.benefits),
    applicationProcess: normalize(data.applicationProcess),
    description: normalize(data.description),
    subjectLine: normalize(data.subjectLine),
  };
}

// Validate extracted data
export async function validateExtraction(
  data: JobExtractionRaw
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Critical validations
  if (!data.title) {
    errors.push({
      field: 'title',
      message: 'Job title is required',
      severity: 'critical',
    });
  }

  if (!data.companyName) {
    errors.push({
      field: 'companyName',
      message: 'Company name is required',
      severity: 'critical',
    });
  }

  // High severity validations
  if (data.salaryMin !== null && data.salaryMax !== null) {
    if (data.salaryMin > data.salaryMax) {
      errors.push({
        field: 'salaryMin',
        message: 'Salary minimum cannot exceed maximum',
        severity: 'high',
      });
    }
  }

  if (data.circularDate && data.applicationDeadline) {
    const circularDate = new Date(data.circularDate);
    const deadlineDate = new Date(data.applicationDeadline);
    if (deadlineDate < circularDate) {
      errors.push({
        field: 'applicationDeadline',
        message: 'Application deadline cannot be before posting date',
        severity: 'high',
      });
    }
  }

  // Medium severity warnings
  if (!data.location) {
    warnings.push({
      field: 'location',
      message: 'Job location is not specified',
    });
  }

  if (!data.workMode) {
    warnings.push({
      field: 'workMode',
      message: 'Work mode is not specified',
    });
  }

  if (data.salaryMin === null && data.salaryMax === null) {
    warnings.push({
      field: 'salaryMin',
      message: 'Salary information is not available',
    });
  }

  if (!data.skills || data.skills.length === 0) {
    warnings.push({
      field: 'skills',
      message: 'No skills are listed in the job description',
    });
  }

  if (!data.responsibilities || data.responsibilities.length === 0) {
    warnings.push({
      field: 'responsibilities',
      message: 'No responsibilities are listed',
    });
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    data: isValid ? (data as any) : undefined,
  };
}

// Retry extraction on failure
export async function extractJobDataWithRetry(
  options: ExtractionOptions
): Promise<ExtractionResult> {
  const maxRetries = options.retries || 2;
  let lastError: ExtractionResult | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await extractJobData(options);

    if (result.success) {
      return result;
    }

    lastError = result;

    // Don't retry if error is input-related
    if (
      result.error?.code === 'EMPTY_INPUT' ||
      result.error?.code === 'VALIDATION_FAILED'
    ) {
      return result;
    }

    // Exponential backoff
    if (attempt < maxRetries) {
      const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return (
    lastError || {
      success: false,
      error: {
        code: 'MAX_RETRIES_EXCEEDED',
        message: `Extraction failed after ${maxRetries} attempts`,
      },
      processingTime: 0,
    }
  );
}
