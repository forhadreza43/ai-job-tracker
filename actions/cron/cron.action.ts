'use server';

import { prisma } from '@/lib/prisma';
import { google } from 'googleapis';
import { GoogleGenAI } from '@google/genai';

// Initialize Gen AI client
const ai = new GoogleGenAI({});

// Response Type Interface
interface EmailAnalysisResult {
  isRelevant: boolean;
  jobId: string | null;
  type: 'INTERVIEW' | 'ASSESSMENT' | null;
  summary: string;
}

export async function checkEmailsForInterviews() {
  const startTime = Date.now();

  try {
    // 1. Fetch users with active monitoring and Google accounts
    const activeUsers = await prisma.user.findMany({
      where: { isAiMonitoringActive: true },
      include: { accounts: { where: { providerId: 'google' } } },
    });

    for (const user of activeUsers) {
      const account = user.accounts[0];
      if (!account?.accessToken) continue;

      // 2. Setup Gmail API
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      // 3. Fetch unread emails from the last 30 minutes
      const timeLimit = new Date(Date.now() - 30 * 60000).getTime() / 1000;
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: `is:unread after:${Math.floor(timeLimit)}`,
      });

      const messages = res.data.messages || [];
      if (messages.length === 0) continue;

      // 4. Fetch User's Applied/Saved Jobs for Context
      const userJobs = await prisma.job.findMany({
        where: { userId: user.id },
        select: { id: true, title: true, company: { select: { name: true } } },
      });

      const jobContext = userJobs.map((j) => ({
        id: j.id,
        company: j.company?.name || 'Unknown',
        title: j.title,
      }));

      // 5. Process each email
      for (const msg of messages) {
        try {
          const emailDetails = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id!,
          });

          const emailSubject =
            emailDetails.data.payload?.headers?.find(
              (h) => h.name === 'Subject'
            )?.value || 'No Subject';
          const emailSnippet = emailDetails.data.snippet || '';
          const emailContent = `Subject: ${emailSubject}\nSnippet: ${emailSnippet}`;

          // Call Gemini using your established pattern
          const analysis = await analyzeEmailWithGemini(
            emailContent,
            jobContext
          );

          // 6. Update DB if it's a match
          if (analysis.isRelevant && analysis.jobId && analysis.type) {
            await prisma.$transaction([
              prisma.job.update({
                where: { id: analysis.jobId },
                data: { status: analysis.type }, // Ensure this matches ApplicationStatus enum
              }),
              prisma.notification.create({
                data: {
                  userId: user.id,
                  jobId: analysis.jobId,
                  title: `New ${analysis.type.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} Update!`,
                  message: analysis.summary,
                  type: analysis.type,
                },
              }),
            ]);
          }
        } catch (emailError) {
          console.error(
            `Failed to process email ${msg.id} for user ${user.email}:`,
            emailError
          );
          // Continue to next email even if one fails
        }
      }

      // Update last checked time
      await prisma.user.update({
        where: { id: user.id },
        data: { lastCheckedAt: new Date() },
      });
    }

    return { success: true, processingTime: Date.now() - startTime };
  } catch (error) {
    console.error('Email monitoring cron failed:', error);
    return { success: false, error };
  }
}

// ----------------------------------------------------------------------
// HELPER: Gemini API Call & JSON Parsing (Matching your JobExtraction logic)
// ----------------------------------------------------------------------

async function analyzeEmailWithGemini(
  emailContent: string,
  jobContext: any[]
): Promise<EmailAnalysisResult> {
  const systemInstruction = `You are an AI recruitment assistant. Your job is to analyze incoming emails and determine if they are interview invitations, assessment links, or generic job updates.
  
  You will be provided with:
  1. An email snippet.
  2. A list of jobs the user has applied for (with ID, Company, and Title).

  CRITICAL INSTRUCTIONS:
  - Match the email context against the provided job list.
  - Return ONLY a valid JSON object matching this exact schema:
  {
    "isRelevant": boolean,
    "jobId": "string (the exact ID from the job list, or null if no match)",
    "type": "INTERVIEW" | "ASSESSMENT" | null,
    "summary": "string (A short 1-2 sentence summary of the email context)"
  }
  - Do not include any text outside the JSON block.`;

  const userPrompt = `Job Context List: ${JSON.stringify(jobContext)}\n\nEmail Content to Analyze: "${emailContent}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: systemInstruction,
        temperature: 0.1, // Low temperature for deterministic matching
      },
    });

    if (!response.text) {
      throw new Error('No content received in Gemini response context');
    }

    // Applying your exact JSON Markdown stripping pattern
    let jsonText = response.text;
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0];
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0];
    }
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);

    // Validate structure before returning
    return {
      isRelevant: Boolean(parsed.isRelevant),
      jobId: typeof parsed.jobId === 'string' ? parsed.jobId : null,
      type:
        parsed.type === 'INTERVIEW' || parsed.type === 'ASSESSMENT'
          ? parsed.type
          : null,
      summary: parsed.summary || 'Job status updated based on recent email.',
    };
  } catch (error) {
    console.error('Gemini API Email Analysis Error:', error);
    // Return safe fallback if parsing fails
    return { isRelevant: false, jobId: null, type: null, summary: '' };
  }
}
