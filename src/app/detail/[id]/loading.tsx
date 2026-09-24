import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="bg-surface dark:bg-slate-900 min-h-screen pb-20 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button Skeleton */}
        <div className="w-32 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (Left) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Banner Skeleton */}
            <div className="h-[400px] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>

            {/* Live Traffic Widget Skeleton */}
            <div className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>

            {/* Header Info Skeleton */}
            <div>
              <div className="w-3/4 h-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4"></div>
              <div className="w-1/2 h-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse"></div>
            </div>

            {/* Description Skeleton */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="w-1/4 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-5/6"></div>
              </div>
            </div>
          </div>

          {/* Booking Card Skeleton (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-slate-700 sticky top-24">
              <div className="flex justify-center mb-6">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <div className="space-y-4">
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
