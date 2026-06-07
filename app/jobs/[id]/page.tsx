import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCompany, getJobById } from '@/actions/job/job.action';
import { CircleCheckBig } from 'lucide-react';

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const job = await getJobById(resolvedParams.id);
  const company = await getCompany(job?.companyId as string);

  if (!job) {
    notFound(); // This will trigger the app/not-found.tsx page if the job doesn't exist
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/jobs">&larr; Back to Jobs</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-gray-700 font-bold">{job.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                Company Name:{' '}
                <span className="text-red-500">{company?.name || 'N/A'}</span>
              </CardDescription>
            </div>
            <Badge variant={job.status === 'APPLIED' ? 'default' : 'secondary'}>
              {job.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-muted-foreground">Location</h3>
              <p>{job.location || 'Not specified'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-muted-foreground">Work Mode</h3>
              <p>
                {job.workMode
                  ? (job.workMode === 'ONSITE' && 'Onsite') ||
                    (job.workMode === 'REMOTE' && 'Remote') ||
                    (job.workMode === 'HYBRID' && 'Hybrid')
                  : 'Not specified'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-muted-foreground">Salary</h3>
              <p>
                {job.salaryMin
                  ? `${job.salaryMin} - ${job.salaryMax} ${job.salaryCurrency}`
                  : 'Undisclosed'}
                {job.salaryNegotiable && ' (Negotiable)'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-muted-foreground">Deadline</h3>
              <p>
                {job.applicationDeadline
                  ? new Date(job.applicationDeadline).toLocaleDateString()
                  : 'No deadline'}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-muted-foreground">Job Type</h3>
              <p>
                {(job.jobType === 'FULL_TIME' && 'Full Time') ||
                  (job.jobType === 'PART_TIME' && 'Part Time') ||
                  (job.jobType === 'CONTRACT' && 'Contractual') ||
                  (job.jobType === 'FREELANCE' && 'Freelance') ||
                  (job.jobType === 'INTERNSHIP' && 'Internship') ||
                  (job.jobType === 'TEMPORARY' && 'Temporary')}
              </p>
            </div>

            {job.vacancy && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Vacancies
                </h3>
                <p>{job.vacancy || 'Undisclosed'}</p>
              </div>
            )}

            {job.experienceLevel && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Experience Level
                </h3>
                <p>{job.experienceLevel}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-muted-foreground mb-2">
              Description
            </h3>
            <div className="whitespace-pre-wrap text-sm border rounded-md p-4 bg-muted/50">
              {job.description || 'No description provided.'}
            </div>
          </div>

          {job.responsibilities && job.responsibilities !== null && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">
                Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map(
                  (responsibility: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <CircleCheckBig size={14} className="text-green-500" />{' '}
                      {responsibility}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {job.skills && job.skills !== null && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-block bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.qualifications && job.qualifications !== null && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">
                Qualifications
              </h3>
              <ul className="space-y-2">
                {job.qualifications.map(
                  (qualification: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <CircleCheckBig size={14} className="text-green-500" />{' '}
                      {qualification}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits !== null && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">
                Benefits
              </h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <CircleCheckBig size={14} className="text-green-500" />{' '}
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
