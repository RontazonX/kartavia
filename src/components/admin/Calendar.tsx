'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-slate-900 border-gray-200 dark:border-slate-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-black dark:text-white">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-black dark:text-white cursor-pointer">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-black dark:text-white cursor-pointer">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="w-full">
        <div className="grid grid-cols-7 border-b border-gray-200 dark:border-slate-800">
          {DAYS.map((day) => (
            <div key={day} className="flex items-center justify-center p-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50"></div>
          ))}
          
          {days.map((day) => {
            const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;
            // Fake events for demonstration
            const hasEvent = day === 14 || day === 21;
            
            return (
              <div 
                key={day} 
                className={`min-h-[100px] sm:min-h-[120px] p-2 border-r border-b border-gray-100 dark:border-slate-800 group hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors relative cursor-pointer`}
              >
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${isToday ? 'bg-primary text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                  {day}
                </span>
                
                {hasEvent && (
                  <div className="mt-1 sm:mt-2">
                    <div className="bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs px-2 py-1 rounded line-clamp-1 sm:line-clamp-2">
                      New Booking
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
