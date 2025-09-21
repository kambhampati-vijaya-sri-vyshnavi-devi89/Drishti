"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartData = [
  { role: "Engineer", salary: 120 },
  { role: "Designer", salary: 95 },
  { role: "Manager", salary: 150 },
  { role: "Analyst", salary: 85 },
  { role: "Scientist", salary: 135 },
];

const chartConfig = {
  salary: {
    label: 'Avg. Salary (LPA)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function MarketChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="role"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => `₹${value}L`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="salary" fill="var(--color-salary)" radius={8} />
      </BarChart>
    </ChartContainer>
  );
}
