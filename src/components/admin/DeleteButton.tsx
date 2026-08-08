'use client'
import { Trash2 } from 'lucide-react'
import { deleteDestination } from '@/app/admin/destinations/actions'
import { useTransition } from 'react'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  
  return (
    <button 
      disabled={isPending}
      onClick={() => {
        if (confirm('Are you sure you want to delete this destination? This action cannot be undone and will delete all associated bookings and reviews.')) {
          startTransition(() => {
            deleteDestination(id)
          })
        }
      }}
      className="text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"
      title="Delete"
    >
      <Trash2 className="h-4 w-4 inline" />
    </button>
  )
}
