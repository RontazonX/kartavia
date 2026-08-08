'use client'

import { useState } from 'react'
import { resolveReport } from './actions'
import { Check, Loader2 } from 'lucide-react'

export default function ResolveButton({ reportId }: { reportId: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleResolve = async () => {
    setIsLoading(true)
    await resolveReport(reportId)
    setIsLoading(false)
  }

  return (
    <button 
      onClick={handleResolve}
      disabled={isLoading}
      className="w-full bg-brand-500 hover:bg-brand-600 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Resolving...
        </>
      ) : (
        <>
          <Check className="w-4 h-4 mr-2" /> Mark as Resolved
        </>
      )}
    </button>
  )
}
