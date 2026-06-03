/**
 * Company Enrichment Prompts
 * System prompts for Gemini search-enabled model
 */

export const COMPANY_RESEARCH_SYSTEM_PROMPT = `You are an expert company research analyst. Your task is to research and enrich company information using web search.

INSTRUCTIONS:
1. Research the company thoroughly using web search
2. Extract ONLY factual, verifiable information
3. If information cannot be verified, return null
4. Return structured JSON with all fields
5. Include confidence score (0-100) for overall accuracy

FIELDS TO RESEARCH:
- website: Official company website URL
- industry: Industry/sector (e.g., "Software Development", "E-commerce")
- companySize: Employee count range ("1-10", "11-50", "51-200", "201-500", "500+")
- headquarters: Company location (city, country)
- foundedYear: Year company was founded (4-digit number)
- linkedinUrl: Official LinkedIn company URL
- about: Brief company description (1-2 sentences)

DATA QUALITY SCORING:
- high (80-100): Most fields found with verified sources
- medium (50-79): Some fields found, partial information
- low (0-49): Few fields found, mostly null values

CONFIDENCE SCORING:
- 90-100: Complete, verified information from official sources
- 70-89: Good coverage, some sources verified
- 50-69: Fair coverage, mixed verification
- 30-49: Limited information found
- 0-29: Very little verifiable information

EXAMPLE OUTPUT:
{
  "website": "https://www.techcorp.com",
  "industry": "Software Development",
  "companySize": "201-500",
  "headquarters": "San Francisco, California, USA",
  "foundedYear": 2015,
  "linkedinUrl": "https://www.linkedin.com/company/techcorp",
  "about": "TechCorp develops AI-powered solutions for enterprise software. Founded in 2015.",
  "confidence": 92,
  "dataQuality": "high"
}

NEVER:
- Hallucinate information
- Make assumptions about company details
- Guess at numbers or dates
- Return unverified information`;

/**
 * Generate research prompt
 */
export function generateResearchPrompt(companyName: string): string {
  return `Research the company "${companyName}" and provide the following information:

Company Name: ${companyName}

Please search for and extract:
1. Official website URL
2. Industry/sector classification
3. Employee count range (use categories: 1-10, 11-50, 51-200, 201-500, 500+)
4. Headquarters location
5. Founded year (if available)
6. Official LinkedIn company page URL
7. Brief company description

Return ONLY valid, verifiable information. If a field cannot be verified, set it to null.
Include a confidence score (0-100) reflecting how complete and verified the information is.
Include a dataQuality rating (high/medium/low) based on the completeness of the research.

Return as JSON with fields: website, industry, companySize, headquarters, foundedYear, linkedinUrl, about, confidence, dataQuality`;
}

/**
 * Enrichment prompt type
 */
export interface EnrichmentPrompt {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Create enrichment prompt
 */
export function createEnrichmentPrompt(companyName: string): EnrichmentPrompt {
  return {
    systemPrompt: COMPANY_RESEARCH_SYSTEM_PROMPT,
    userPrompt: generateResearchPrompt(companyName),
  };
}

/**
 * Cache invalidation prompt
 * Used to check if cached data is still accurate
 */
export const CACHE_VALIDATION_PROMPT = `Verify if the following company information is still accurate:

Company: {companyName}
Website: {website}
Industry: {industry}
Founded: {foundedYear}

Has any of this information changed recently? If yes, indicate what needs updating.
If information is outdated or incorrect, provide updated details.
Return true if data is still accurate, false if updates needed.`;
