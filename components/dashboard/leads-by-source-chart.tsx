"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface LeadSource {
  source: string
  count: number
}

interface LeadsBySourceChartProps {
  data: LeadSource[]
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

export function LeadsBySourceChart({ data }: LeadsBySourceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No lead source data available
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ source, percent }) => `${source}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="count"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #262626",
            borderRadius: "8px",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
