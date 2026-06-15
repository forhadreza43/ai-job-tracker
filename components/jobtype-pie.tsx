'use client';

import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { JobTypeStatItem } from '@/actions/dashboard/chart.action';

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

const chartConfig = {
  count: {
    label: 'Total Jobs',
  },
  'full-time': {
    label: 'Full-Time',
    color: 'var(--chart-1)',
  },
  'part-time': {
    label: 'Part-Time',
    color: 'var(--chart-2)',
  },
  contract: {
    label: 'Contract',
    color: 'var(--chart-3)',
  },
  freelance: {
    label: 'Freelance',
    color: 'var(--chart-4)',
  },
  internship: {
    label: 'Internship',
    color: 'var(--chart-5)',
  },
  temporary: {
    label: 'Temporary',
    color: 'var(--chart-6)',
  },
  other: {
    label: 'Other',
    color: 'var(--chart-7)',
  },
} satisfies ChartConfig;

interface JobTypePieChartProps {
  initialData: JobTypeStatItem[];
}

export function JobTypePieChart({ initialData }: JobTypePieChartProps) {

  const totalJobs = React.useMemo(() => {
    return initialData.reduce((acc, curr) => acc + curr.count, 0);
  }, [initialData]);

  return (
    <Card className="flex flex-col w-full h-95 justify-between">
      <CardHeader className="items-center pb-0">
        <CardTitle>Job Metrics by Type</CardTitle>
        <CardDescription>Breakdown of tracking telemetry</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-57.5 px-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={initialData}
              dataKey="count"
              nameKey="jobType"
              innerRadius={55}
              strokeWidth={0}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold tracking-tight"
                        >
                          {totalJobs.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-xs font-medium tracking-wide"
                        >
                          Total Jobs
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* <CardFooter className="flex-col gap-1 text-sm border-t pt-3">
        <div className="flex items-center gap-2 leading-none font-medium">
          Analytics Pipeline Active{' '}
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="leading-none text-muted-foreground text-xs text-center">
          Live statistics from user repository metrics
        </div>
      </CardFooter> */}
    </Card>
  );
}
