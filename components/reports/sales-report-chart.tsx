"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

interface SalesData {
  month: string
  revenue: number
  target: number
}

interface SalesReportChartProps {
  data: SalesData[]
}

export function SalesReportChart({ data }: SalesReportChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis dataKey="month" stroke="#a1a1a1" fontSize={12} tickLine={false} />
        <YAxis stroke="#a1a1a1" fontSize={12} tickLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #262626",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#ededed" }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          name="Revenue"
          dot={{ fill: "#3b82f6" }}
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="#10b981"
          strokeWidth={2}
          strokeDasharray="5 5"
          name="Target"
          dot={{ fill: "#10b981" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
