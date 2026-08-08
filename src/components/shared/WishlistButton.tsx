'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { toggleWishlist, checkWishlistStatus } from '@/app/actions/wishlist'

export default function WishlistButton({ destinationId }: { destinationId: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      const res = await checkWishlistStatus(destinationId)
      setIsSaved(res.isSaved)
      setIsLoading(false)
    }
    checkStatus()
  }, [destinationId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Optimistic UI update
    const previousState = isSaved
    setIsSaved(!isSaved)
    
    const res = await toggleWishlist(destinationId)
    if (res.error) {
      // Revert if error
      setIsSaved(previousState)
      alert(res.error)
    } else if (res?.success) {
      setIsSaved(res.isSaved)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer ${
        isSaved 
          ? 'bg-red-50 text-red-500 hover:bg-red-100 border border-red-200' 
          : 'bg-white/90 text-gray-500 hover:bg-white hover:text-red-500 border border-transparent'
      }`}
      aria-label="Save to Wishlist"
    >
      <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
    </button>
  )
}
