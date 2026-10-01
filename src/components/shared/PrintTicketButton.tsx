'use client'

import React from 'react'
import { Printer } from 'lucide-react'

export default function PrintTicketButton() {
  const handlePrint = () => {
    window.print()
  }

  return (
    <button 
      onClick={handlePrint}
      className="inline-flex items-center justify-center bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm print:hidden"
    >
      <Printer className="w-4 h-4 mr-2" />
      Cetak / Simpan PDF
    </button>
  )
}
