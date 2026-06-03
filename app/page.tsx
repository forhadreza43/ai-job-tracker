'use client';

import { extractJobData } from '@/lib/ai/extraction';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!description.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const extractionResult = await extractJobData({
        rawDescription: description,
      });

      if (extractionResult.success) {
        setResult(extractionResult.data);
        // console.log(extractionResult.data);
      } else {
        setError(extractionResult.error?.message || 'Extraction failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-stretch justify-start py-8 px-4 sm:px-8 bg-white dark:bg-black">
        <div className="space-y-8">
          {/* Title */}
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

          {/* Results */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Extracted Information</CardTitle>
                <CardDescription>
                  Confidence: {result.confidence}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.title && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Job Title
                      </p>
                      <p className="text-lg font-semibold">{result.title}</p>
                    </div>
                  )}
                  {result.companyName && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Company
                      </p>
                      <p className="text-lg font-semibold">
                        {result.companyName}
                      </p>
                    </div>
                  )}
                  {result.location && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Location
                      </p>
                      <p className="text-lg font-semibold">{result.location}</p>
                    </div>
                  )}
                  {result.workMode && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Work Mode
                      </p>
                      <p className="text-lg font-semibold">{result.workMode}</p>
                    </div>
                  )}
                  {result.jobType && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Job Type
                      </p>
                      <p className="text-lg font-semibold">{result.jobType}</p>
                    </div>
                  )}
                  {result.experienceLevel && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Experience Level
                      </p>
                      <p className="text-lg font-semibold">
                        {result.experienceLevel}
                      </p>
                    </div>
                  )}
                  {result.applicationDeadline && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Application Deadline
                      </p>
                      <p className="text-lg font-semibold">
                        {new Date(
                          result.applicationDeadline
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {result.vacancy && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Vacancies
                      </p>
                      <p className="text-lg font-semibold">{result.vacancy}</p>
                    </div>
                  )}
                </div>

                {/* Salary Section */}
                {(result.salaryMin || result.salaryMax) && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Salary Range
                    </p>
                    <div className="space-y-1">
                      {result.salaryMin && (
                        <p className="text-lg">
                          <span className="font-semibold">
                            ${result.salaryMin}
                          </span>
                          {result.salaryCurrency && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              {result.salaryCurrency}
                            </span>
                          )}
                        </p>
                      )}
                      {result.salaryMax && (
                        <p className="text-lg">
                          to{' '}
                          <span className="font-semibold">
                            ${result.salaryMax}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {result.skills && result.skills.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Required Skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.skills.map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities Section */}
                {result.responsibilities &&
                  result.responsibilities.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                        Responsibilities
                      </p>
                      <ul className="space-y-2">
                        {result.responsibilities.map(
                          (responsibility: string, idx: number) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-700 dark:text-gray-300"
                            >
                              • {responsibility}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                {/* Qualifications Section */}
                {result.qualifications && result.qualifications.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Qualifications
                    </p>
                    <ul className="space-y-2">
                      {result.qualifications.map(
                        (qualification: string, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            • {qualification}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* Benefits Section */}
                {result.benefits && result.benefits.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Benefits
                    </p>
                    <ul className="space-y-2">
                      {result.benefits.map((benefit: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-sm text-gray-700 dark:text-gray-300"
                        >
                          • {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
