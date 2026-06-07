import { getJobs } from '@/actions/job/job.action';
import { DataTable } from './data-table';
import { columns } from './columns';
import { session } from '@/actions/auth/auth.action';

export default async function JobsPage() {
  // Replace this with your actual auth logic (e.g., NextAuth, Clerk, or Supabase)
  const sessionData = await session();

  const data = await getJobs(sessionData?.user?.id as string);

  return (
    <div className="mx-auto container px-4 py-10">
      <h1 className="text-xl font-bold mb-6">My Job Applications</h1>
      {/* Pass the data to the client component */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
