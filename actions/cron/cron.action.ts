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
    const activeUsers = await prisma.user.findMany({
      where: { isAiMonitoringActive: true },
      include: { accounts: { where: { providerId: 'google' } } },
    });

    console.log(`Active users found: ${activeUsers.length}`);

    for (const user of activeUsers) {
      console.log(`Processing user: ${user.email}`);

      const account = user.accounts[0];
      console.log(
        `Has account: ${!!account}, Has accessToken: ${!!account?.accessToken}, Has refreshToken: ${!!account?.refreshToken}`
      );

      if (!account?.accessToken || !account?.refreshToken) {
        console.log(`Skipping user ${user.email} — missing tokens`);
        continue;
      }

      // Setup Gmail API
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      oauth2Client.setCredentials({
        access_token: account.accessToken,
        refresh_token: account.refreshToken,
      });

      // Token refresh — expire হলে নতুন token নেওয়া হবে
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);

        await prisma.account.update({
          where: { id: account.id },
          data: {
            accessToken: credentials.access_token ?? account.accessToken,
            ...(credentials.refresh_token && {
              refreshToken: credentials.refresh_token,
            }),
          },
        });
      } catch (refreshError) {
        console.error(
          `Token refresh failed for user ${user.email}:`,
          refreshError
        );
        continue;
      }

      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      // Last 30 minutes এর unread emails
      const timeLimit = new Date(Date.now() - 30 * 60000).getTime() / 1000;

      let messages: { id?: string | null }[] = [];
      try {
        const res = await gmail.users.messages.list({
          userId: 'me',
          q: `is:unread after:${Math.floor(timeLimit)}`,
        });
        messages = res.data.messages || [];
      } catch (gmailError) {
        console.error(`Gmail list failed for user ${user.email}:`, gmailError);
        continue;
      }

      if (messages.length === 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastCheckedAt: new Date() },
        });
        continue;
      }

      const userJobs = await prisma.job.findMany({
        where: { userId: user.id },
        select: { id: true, title: true, company: { select: { name: true } } },
      });

      const jobContext = userJobs.map((j) => ({
        id: j.id,
        company: j.company?.name || 'Unknown',
        title: j.title,
      }));

      for (const msg of messages) {
        if (!msg.id) continue;
        try {
          const emailDetails = await gmail.users.messages.get({
            userId: 'me',
            id: msg.id,
          });

          const emailSubject =
            emailDetails.data.payload?.headers?.find(
              (h) => h.name === 'Subject'
            )?.value || 'No Subject';
          const emailSnippet = emailDetails.data.snippet || '';
          const emailContent = `Subject: ${emailSubject}\nSnippet: ${emailSnippet}`;

          const analysis = await analyzeEmailWithGemini(
            emailContent,
            jobContext
          );

          if (analysis.isRelevant && analysis.jobId && analysis.type) {
            // jobId টা সত্যিই এই user এর কিনা verify করা হচ্ছে
            const jobBelongsToUser = userJobs.some(
              (j) => j.id === analysis.jobId
            );
            if (!jobBelongsToUser) continue;

            await prisma.$transaction([
              prisma.job.update({
                where: { id: analysis.jobId },
                data: { status: analysis.type },
              }),
              prisma.notification.create({
                data: {
                  userId: user.id,
                  jobId: analysis.jobId,
                  title: `New ${analysis.type === 'INTERVIEW' ? 'Interview' : 'Assessment'} Update!`,
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
        }
      }

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

async function analyzeEmailWithGemini(
  emailContent: string,
  jobContext: { id: string; company: string; title: string }[]
): Promise<EmailAnalysisResult> {
  const systemInstruction = `You are an AI recruitment assistant. Analyze incoming emails and determine if they are interview invitations or assessment requests.

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
  "summary": "string (A short 1-2 sentence summary)"
}
- Do not include any text outside the JSON block.`;

  const userPrompt = `Job Context List: ${JSON.stringify(jobContext)}\n\nEmail Content to Analyze: "${emailContent}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        responseMimeType: 'application/json',
        systemInstruction,
        temperature: 0.1,
      },
    });

    if (!response.text) throw new Error('No content received from Gemini');

    let jsonText = response.text;
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0];
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0];
    }
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);

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
    console.error('Gemini analysis error:', error);
    return { isRelevant: false, jobId: null, type: null, summary: '' };
  }
}
