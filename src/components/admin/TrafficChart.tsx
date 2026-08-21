'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function TrafficChart({ data }: { data: any[] }) {
  // Aggregate data by date (last 14 days)
  const chartData: any[] = []
  
  // Create last 14 days map
  const now = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    chartData.push({
      fullDate: dateStr,
      name: shortDate,
      Views: 0,
      Blocked: 0
    })
  }

  // Fill data
  data.forEach(stat => {
    const statDate = new Date(stat.date).toISOString().split('T')[0]
    const dataPoint = chartData.find(d => d.fullDate === statDate)
    if (dataPoint) {
      dataPoint.Views += Number(stat.page_views || 0)
      dataPoint.Blocked += Number(stat.blocked_requests || 0)
    }
  })

  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-6 pb-2.5 shadow-sm sm:px-7.5 mb-8 transition-colors">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Web Traffic & Security Analytics
      </h4>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: '#fff' }}
              itemStyle={{ color: '#000' }}
            />
            <Legend verticalAlign="top" height={36}/>
            <Line 
              type="monotone" 
              dataKey="Views" 
              stroke="#3b82f6" 
              strokeWidth={3}
              activeDot={{ r: 8, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} 
              dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
            />
            <Line 
              type="monotone" 
              dataKey="Blocked" 
              stroke="#ef4444" 
              strokeWidth={3}
              activeDot={{ r: 8, fill: '#ef4444', stroke: '#fff', strokeWidth: 2 }} 
              dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
