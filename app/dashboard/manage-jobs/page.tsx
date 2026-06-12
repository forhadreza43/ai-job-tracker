import { DataTable } from '@/components/data-table';
import { session } from '@/actions/auth/auth.action';
import { getJobs } from '@/actions/job/job.action';
const page = async() => {
    const sessionData = await session();
  
    const data = await getJobs(sessionData?.user?.id as string);
  
  return <DataTable data={data} userId={sessionData?.user?.id as string} />;
};

export default page;
