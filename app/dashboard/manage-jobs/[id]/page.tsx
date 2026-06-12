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
    notFound();
  }

  return (
    <div >
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/dashboard/manage-jobs">&larr; Back to Jobs</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-gray-700 font-bold">
                {job.title}
              </CardTitle>
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
          <div className="grid grid-cols-2 llg:grid-cols-3 gap-4">
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

            {job.circularDate && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Vacancies
                </h3>
                <p>
                  {job.circularDate
                    ? new Date(job.circularDate).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            )}

            {job.interviewDate && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Interview Date
                </h3>
                <p>
                  {job.interviewDate
                    ? new Date(job.interviewDate).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            )}

            {job.appliedAt && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Applied Date
                </h3>
                <p>
                  {job.appliedAt
                    ? new Date(job.appliedAt).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            )}

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

            {job.experienceRequired && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Required Experience
                </h3>
                <p>{job.experienceRequired}</p>
              </div>
            )}

            {job.subjectLine && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Subject Line
                </h3>
                <p>{job.subjectLine}</p>
              </div>
            )}

            {job.source && (
              <div>
                <h3 className="font-semibold text-muted-foreground">Source</h3>
                <p>{job.source}</p>
              </div>
            )}

            {/* {job.sourceUrl && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Source Link
                </h3>
                <p>{job.sourceUrl}</p>
              </div>
            )} */}

            {job.officeTime && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Office Time
                </h3>
                <p>{job.officeTime}</p>
              </div>
            )}

            {job.applicationProcess && (
              <div>
                <h3 className="font-semibold text-muted-foreground">
                  Application Process
                </h3>
                <p>{job.applicationProcess}</p>
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

          {job.responsibilities && job.responsibilities.length > 0 && (
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

          {job.skills && job.skills.length > 0 && (
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

          {job.qualifications && job.qualifications.length > 0 && (
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
          {job.niceToHave && job.niceToHave.length > 0 && (
            <div>
              <h3 className="font-semibold text-muted-foreground mb-2">
                Nice To Have
              </h3>
              <ul className="space-y-2">
                {job.niceToHave.map((nice: string, idx: number) => (
                  <li
                    key={idx}
                    className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <CircleCheckBig size={14} className="text-green-500" />{' '}
                    {nice}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
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
