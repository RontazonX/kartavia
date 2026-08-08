'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { submitReview } from '@/app/detail/[id]/reviewActions'

export default function ReviewForm({ destinationId }: { destinationId: string }) {
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)
    const result = await submitReview(formData)
    
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setRating(5)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8">
      <h3 className="font-bold text-lg mb-4 text-foreground">Write a Review</h3>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-200">
          Your review has been submitted successfully!
        </div>
      )}

      <form action={handleSubmit}>
        <input type="hidden" name="destination_id" value={destinationId} />
        <input type="hidden" name="rating" value={rating.toString()} />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none cursor-pointer"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  } transition-colors`} 
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
          <textarea
            name="comment"
            required
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Tell us about your experience..."
          ></textarea>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
