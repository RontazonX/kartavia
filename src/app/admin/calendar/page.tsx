import Calendar from '@/components/admin/Calendar'
import Link from 'next/link'

export default function CalendarPage() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white text-2xl">
          Calendar
        </h2>

        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link prefetch={false} className="font-medium text-gray-500 hover:text-primary dark:text-gray-400" href="/admin">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">Calendar</li>
          </ol>
        </nav>
      </div>

      <Calendar />
    </>
  )
}
