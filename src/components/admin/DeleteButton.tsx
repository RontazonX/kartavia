'use client'
import { Trash2 } from 'lucide-react'
import { deleteDestination } from '@/app/admin/destinations/actions'
import { useTransition } from 'react'

interface DeleteButtonProps {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action?: (id: string) => Promise<any>;
  className?: string;
  entityName?: string;
}

export default function DeleteButton({ 
  id, 
  action, 
  className,
  entityName = 'destination'
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()
  
  return (
    <button 
      disabled={isPending}
      onClick={() => {
        if (confirm(`Are you sure you want to delete this ${entityName}? This action cannot be undone.`)) {
          startTransition(() => {
            if (action) {
              action(id)
            } else {
              deleteDestination(id)
            }
          })
        }
      }}
      className={className || "text-red-500 hover:text-red-700 cursor-pointer disabled:opacity-50"}
      title="Delete"
    >
      <Trash2 className="h-4 w-4 inline" />
    </button>
  )
}

