import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-20 px-4">
      <div className="bg-white p-10 md:p-16 rounded-3xl shadow-xl border border-gray-100 text-center max-w-lg w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Your booking has been confirmed. We've sent the e-ticket to your email address.
        </p>
        
        <div className="space-y-4">
          <Link href="/dashboard" className="block w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-md">
            View My Bookings
          </Link>
          <Link href="/explore" className="block w-full bg-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
            Explore More
          </Link>
        </div>
      </div>
    </div>
  )
}
