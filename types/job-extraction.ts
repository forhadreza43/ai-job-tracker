/**
 * AI Job Extraction Types
 * Structured types for extracted job data from raw descriptions
 */

/**
 * Enum for work modes
 */
export enum WorkMode {
  ONSITE = 'ONSITE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

/**
 * Enum for job types
 */
export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  FREELANCE = 'FREELANCE',
  INTERNSHIP = 'INTERNSHIP',
  TEMPORARY = 'TEMPORARY',
}

/**
 * Experience level enumeration
 */
export enum ExperienceLevel {
  ENTRY = 'ENTRY',
  JUNIOR = 'JUNIOR',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

/**
 * Company background profile gathered from web research/grounding
 * Matches Prisma schema structure
 */
export interface CompanyProfile {
  about: string | null;
  website: string | null;
  logo: string | null;
  industry: string | null;
  size: string | null;
  founded: number | null; // Int in Prisma
  headquarters: string | null;
  mission: string | null;
  vision: string | null;
  linkedinUrl: string | null;
  careersPage: string | null;
  techStack: string[] | null; // Saved as Json array in database
}

/**
 * Raw extracted data from AI model
 * All fields can be null if not found in description
 */
export interface JobExtractionRaw {
  companyName: string | null;
  title: string | null;
  role: string | null;
  location: string | null;
  workMode: WorkMode | null;
  jobType: JobType | null;
  experienceLevel: ExperienceLevel | null;
  experienceRequired: string | null;
  vacancy: number | null;
  officeTime: string | null;
  source: string | null;
  sourceUrl: string | null;
  circularDate: string | null; // ISO 8601 format
  applicationDeadline: string | null; // ISO 8601 format
  salaryMin: number | null; // In base currency
  salaryMax: number | null; // In base currency
  salaryCurrency: string | null; // ISO 4217 code (USD, BDT, etc.)
  salaryNegotiable: boolean | null;
  skills: string[] | null;
  responsibilities: string[] | null;
  qualifications: string[] | null;
  niceToHave: string[] | null;
  benefits: string[] | null;
  applicationProcess: string | null;
  description: string | null; // Cleaned/normalized description
  subjectLine?: string | null;
}

/**
 * Extracted job data with metadata
 */
export interface JobExtraction extends JobExtractionRaw {
  confidence: number; // 0-100 confidence score
  extractedAt: string; // ISO 8601 timestamp
  model: string; // Model name used for extraction
  rawText?: string; // Original raw job description
  companyProfile?: CompanyProfile | null; // Enriched background intelligence field
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  data?: JobExtraction;
}

/**
 * Validation error
 */
export interface ValidationError {
  field: keyof JobExtractionRaw;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field: keyof JobExtractionRaw;
  message: string;
}

/**
 * AI Extraction result
 */
export interface ExtractionResult {
  success: boolean;
  data?: JobExtraction;
  error?: ExtractionError;
  validation?: ValidationResult;
  processingTime: number; // milliseconds
}

/**
 * Extraction error details
 */
export interface ExtractionError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Extraction service options
 */
export interface ExtractionOptions {
  rawDescription: string;
  modelName?: string;
  retries?: number;
  timeout?: number;
  enforceValidation?: boolean;
}

/**
 * Gemini API response format
 */
export interface GeminiExtractionResponse {
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
 * Parsed Gemini response
 */
export interface ParsedGeminiResponse {
  extraction: JobExtractionRaw;
  confidence: number;
  raw: string;
}
