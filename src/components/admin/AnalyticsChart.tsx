'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export default function AnalyticsChart({ data }: { data: any[] }) {
  // Process data to count bookings by destination title
  const distribution: Record<string, number> = {}
  
  data.forEach(booking => {
    const title = booking.destinations?.title || 'Unknown'
    distribution[title] = (distribution[title] || 0) + 1
  })

  // Convert to array for Recharts
  const chartData = Object.keys(distribution).map(key => ({
    name: key,
    value: distribution[key]
  })).sort((a, b) => b.value - a.value).slice(0, 5) // Top 5

  if (chartData.length === 0) {
    chartData.push(
      { name: 'Beach', value: 45 },
      { name: 'Mountain', value: 30 },
      { name: 'City', value: 15 },
      { name: 'Culture', value: 10 }
    )
  }

  const COLORS = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF', '#80CAEE']

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-5 pt-7.5 pb-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-7.5 h-full">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Booking Analytics
          </h4>
        </div>
      </div>

      <div className="mb-2">
        <div className="mx-auto flex justify-center h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
