'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { useIsMobile } from '@/hooks/use-mobile';

const chartConfig = {
  jobs: {
    label: 'Jobs',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export type ChartData = {
  company: string;
  jobs: number;
};

export function CompanyBarChart({ chartData }: { chartData: ChartData[] }) {
  const isMobile = useIsMobile();
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Jobs</CardTitle>
        <CardDescription>Total jobs of each company</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="company"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="jobs" fill="var(--color-jobs)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
