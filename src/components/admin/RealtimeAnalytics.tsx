'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Eye, ShieldAlert, ArrowUp, ArrowDown } from 'lucide-react'
import TrafficChart from '@/components/admin/TrafficChart'

export default function RealtimeAnalytics({ initialStats }: { initialStats: any[] }) {
  const [stats, setStats] = useState(initialStats)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to realtime changes on the site_statistics table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'site_statistics'
        },
        (payload) => {
          setStats((currentStats) => {
            const newRecord = payload.new as any
            const existingIndex = currentStats.findIndex((s) => s.date === newRecord.date)

            if (existingIndex >= 0) {
              const newStats = [...currentStats]
              newStats[existingIndex] = newRecord
              return newStats
            } else {
              return [...currentStats, newRecord]
            }
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Aggregate Data
  const totalViews = stats.reduce((acc, curr) => acc + Number(curr.page_views || 0), 0)
  const totalBlocked = stats.reduce((acc, curr) => acc + Number(curr.blocked_requests || 0), 0)

  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  let currentMonthViews = 0
  let prevMonthViews = 0
  let currentMonthBlocks = 0
  let prevMonthBlocks = 0

  stats.forEach(s => {
    const d = new Date(s.date)
    if (d >= currentMonthStart) {
      currentMonthViews += Number(s.page_views || 0)
      currentMonthBlocks += Number(s.blocked_requests || 0)
    } else if (d >= prevMonthStart && d <= prevMonthEnd) {
      prevMonthViews += Number(s.page_views || 0)
      prevMonthBlocks += Number(s.blocked_requests || 0)
    }
  })

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  const viewsChange = calculateChange(currentMonthViews, prevMonthViews)
  const blocksChange = calculateChange(currentMonthBlocks, prevMonthBlocks)

  const renderIndicator = (change: number, isGood: boolean) => {
    if (change === 0) return <span className="text-sm font-medium text-gray-500">0%</span>

    const upColor = isGood ? 'text-success-500' : 'text-error-500'
    const downColor = isGood ? 'text-error-500' : 'text-success-500'

    if (change > 0) {
      return (
        <span className={`flex items-center gap-1 text-sm font-medium ${upColor}`}>
          {change.toFixed(1)}% <ArrowUp className="h-4 w-4" />
        </span>
      )
    }
    return (
      <span className={`flex items-center gap-1 text-sm font-medium ${downColor}`}>
        {Math.abs(change).toFixed(1)}% <ArrowDown className="h-4 w-4" />
      </span>
    )
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-title-md2 font-semibold text-black dark:text-white">
            Web & Bot Analytics
          </h2>
          <span className="flex h-6 items-center rounded-full bg-success-50 dark:bg-success-900/30 px-3 text-xs font-medium text-success-600 dark:text-success-400">
            <span className="mr-1.5 flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500"></span>
            </span>
            Realtime
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-2 2xl:gap-7.5 mb-8">
        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-brand-500 mb-4">
            <Eye className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                {totalViews >= 1000 ? (totalViews / 1000).toFixed(1) + 'K' : totalViews.toLocaleString('id-ID')}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Valid Views</span>
            </div>
            {renderIndicator(viewsChange, true)}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-7.5 shadow-sm transition-colors">
          <div className="flex items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800 h-12 w-12 text-error-500 mb-4">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="font-bold text-black dark:text-white text-2xl">
                {totalBlocked >= 1000 ? (totalBlocked / 1000).toFixed(1) + 'K' : totalBlocked.toLocaleString('id-ID')}
              </h4>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Threats Blocked</span>
            </div>
            {renderIndicator(blocksChange, false)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5 mb-8">
        <TrafficChart data={stats || []} />
      </div>
    </>
  )
}
