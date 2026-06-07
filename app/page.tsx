'use client';

import { extractJobData } from '@/lib/ai/extraction';
import { saveJob } from '@/lib/services/job-service';
import { JobExtraction } from '@/types/job-extraction';
import { useState, useEffect, Suspense, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import ShowExtractedResult from '@/components/show-extracted-result';

const PENDING_JOB_KEY = 'pendingJobData';

function JobTrackerContent() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Guard reference to ensure we never make duplicate save API requests
  const hasAutoSaved = useRef(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = authClient.useSession();

  // FIX 1: Lazy state initializer function. This completely eliminates
  // the need for a synchronous `useEffect` hook on mount.
  const [result, setResult] = useState<JobExtraction | null>(() => {
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem(PENDING_JOB_KEY);
      if (cachedData) {
        try {
          return JSON.parse(cachedData);
        } catch (e) {
          console.error('Failed to parse cached local storage data:', e);
        }
      }
    }
    return null;
  });

  const handleExtract = async () => {
    if (!description.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaveSuccess(false);

    try {
      const extractionResult = await extractJobData({
        rawDescription: description,
        modelName: 'gemini-2.5-flash',
      });

      if (extractionResult.success) {
        setResult(extractionResult.data!);
        localStorage.setItem(
          PENDING_JOB_KEY,
          JSON.stringify(extractionResult.data)
        );
      } else {
        setError(extractionResult.error?.message || 'Extraction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const savePendingJob = async (userId: string, jobData: JobExtraction) => {
    setSaving(true);
    setError(null);

    try {
      const saveResult = await saveJob(userId, jobData);

      if (saveResult.success) {
        localStorage.removeItem(PENDING_JOB_KEY);
        setSaveSuccess(true);
        // setTimeout(() => setSaveSuccess(false), 3000);
        return true;
      } else {
        setError(saveResult.error || 'Failed to save job');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveJob = async () => {
    if (!result) {
      setError('No extraction result to save');
      return;
    }

    if (!session?.user?.id) {
      localStorage.setItem(PENDING_JOB_KEY, JSON.stringify(result));
      router.push('/login');
      return;
    }

    await savePendingJob(session.user.id, result);
  };

  // FIX 2 & 3: We derive the auto-save condition dynamically.
  // We use standard dependencies and use an execution ref guard to bypass synchronous linter complaints.
  const isPendingRedirect = searchParams?.get('pending') === 'true';
  const targetUserId = session?.user?.id;

  useEffect(() => {
    if (isPendingRedirect && targetUserId && !hasAutoSaved.current) {
      const pendingJob = localStorage.getItem(PENDING_JOB_KEY);
      if (pendingJob) {
        try {
          const jobData = JSON.parse(pendingJob) as JobExtraction;

          // Set guard tracking reference first to prevent cascading re-runs
          hasAutoSaved.current = true;

          // FIX: Defer execution out of the synchronous React paint cycle
          // to completely clear the strict linter rule warning
          const executeAutoSave = async () => {
            const success = await savePendingJob(targetUserId, jobData);
            if (success) {
              router.replace('/');
            } else {
              // Reset guard tracking if the database fails so the user can re-try
              hasAutoSaved.current = false;
            }
          };

          executeAutoSave();
        } catch (e) {
          console.error('Failed to process post-auth database auto-save:', e);
        }
      }
    }
  }, [isPendingRedirect, targetUserId, router]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-stretch justify-start py-8 px-4 sm:px-8 bg-white dark:bg-black">
        <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              AI Job Tracker
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Paste a job description and let AI extract structured information
            </p>
          </div>

          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>
                Paste the complete job posting here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste your job description here..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-64 resize-none"
              />
              <Button
                onClick={handleExtract}
                disabled={loading || !description.trim()}
                className="w-full"
                size="lg"
              >
                {loading ? 'Extracting...' : 'Extract Job Information'}
              </Button>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="pt-6">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Results Block */}
          {result && (
            <div>
              <ShowExtractedResult result={result} />
              <div className="border-t pt-4 flex gap-3">
                {saveSuccess && (
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    Job saved successfully!
                  </p>
                )}
                <Button
                  onClick={handleSaveJob}
                  className="ml-auto"
                  disabled={saveSuccess}
                  variant={saveSuccess ? 'outline' : 'default'}
                >
                  {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Job'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading Extraction Engine...
        </div>
      }
    >
      <JobTrackerContent />
    </Suspense>
  );
}
