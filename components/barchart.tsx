import { session } from '@/actions/auth/auth.action';
import { getCompanyJobCounts } from '@/actions/dashboard/chart.action';
import { CompanyBarChart } from './barchart-company';
export async function Barchart() {
  const sessionData = await session();
  const chartData = await getCompanyJobCounts(sessionData?.user?.id as string);
  return <CompanyBarChart chartData={chartData} />;
}
