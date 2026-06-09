'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { LabelList, Pie, PieChart, Cell } from 'recharts';
import { WorkModeStatItem } from '@/actions/dashboard/chart.action';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  onsite: {
    label: 'On-site',
    color: 'var(--chart-3)',
  },
  remote: {
    label: 'Remote',
    color: 'var(--chart-4)',
  },
  hybrid: {
    label: 'Hybrid',
    color: 'var(--chart-5)',
  },
  other: {
    label: 'other',
    color: 'var(--chart-6)',
  },
} satisfies ChartConfig;

interface WorkModePieChartProps {
  initialData: WorkModeStatItem[];
}

export function WorkModePieChart({ initialData }: WorkModePieChartProps) {
  return (
    <Card className="flex flex-col w-full h-[380px] justify-between">
      <CardHeader className="items-center pb-0">
        <CardTitle>Job Metrics by Work Mode</CardTitle>
        <CardDescription>Breakdown of working environments</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0 flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[230px] px-0 [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie
              data={initialData}
              dataKey="count"
              nameKey="workMode"
              outerRadius={90}
            >
              {initialData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.fill}
                  stroke="var(--background)"
                  strokeWidth={0}
                />
              ))}

              <LabelList
                dataKey="workMode"
                className="fill-background font-medium"
                stroke="none"
                fontSize={11}
                formatter={(value) =>
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
