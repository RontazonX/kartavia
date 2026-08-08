'use client'

import { Download, Printer } from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ExportButtons({ data }: { data: any[] }) {
  const handleExportCSV = () => {
    // Generate CSV string
    const headers = ['Customer ID', 'Destination', 'Date', 'Guests', 'Total Price', 'Status']
    const csvContent = [
      headers.join(','),
      ...data.map(b => [
        b.user_id,
        `"${b.destinations?.title || ''}"`,
        new Date(b.booking_date).toISOString().split('T')[0],
        b.guests,
        b.total_price,
        b.status
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'kartavia_bookings.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrintPDF = () => {
    window.print()
  }

  return (
    <div className="flex gap-3">
      <button 
        onClick={handleExportCSV}
        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
      >
        <Download className="h-4 w-4" /> Export CSV
      </button>
      <button 
        onClick={handlePrintPDF}
        className="flex items-center gap-2 bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors shadow-sm text-sm font-medium"
      >
        <Printer className="h-4 w-4" /> Print PDF
      </button>
    </div>
  )
}
