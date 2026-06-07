import React from 'react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
const ShowExtractedResult = ({ result }: { result: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Information</CardTitle>
        <CardDescription>Confidence: {result.confidence}%</CardDescription>
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
              <p className="text-lg font-semibold">{result.companyName}</p>
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
              <p className="text-lg font-semibold">{result.experienceLevel}</p>
            </div>
          )}
          {result.applicationDeadline && (
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Application Deadline
              </p>
              <p className="text-lg font-semibold">
                {new Date(result.applicationDeadline).toLocaleDateString()}
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
                  <span className="font-semibold">${result.salaryMin}</span>
                  {result.salaryCurrency && (
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      {result.salaryCurrency}
                    </span>
                  )}
                </p>
              )}
              {result.salaryMax && (
                <p className="text-lg">
                  to <span className="font-semibold">${result.salaryMax}</span>
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
        {result.responsibilities && result.responsibilities.length > 0 && (
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
  );
};

export default ShowExtractedResult;
