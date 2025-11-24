"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"

interface LeadsData {
  month: string
  new: number
  converted: number
  lost: number
}

interface LeadsReportChartProps {
  data: LeadsData[]
}

export function LeadsReportChart({ data }: LeadsReportChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
        <XAxis dataKey="month" stroke="#a1a1a1" fontSize={12} tickLine={false} />
        <YAxis stroke="#a1a1a1" fontSize={12} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0a0a0a",
            border: "1px solid #262626",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#ededed" }}
        />
        <Legend />
        <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Leads" />
        <Bar dataKey="converted" fill="#10b981" radius={[4, 4, 0, 0]} name="Converted" />
        <Bar dataKey="lost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Lost" />
      </BarChart>
    </ResponsiveContainer>
  )
}
