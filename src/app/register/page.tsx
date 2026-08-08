import SignUpForm from './SignUpForm'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-row-reverse overflow-hidden w-full max-w-6xl min-h-[600px]">
        <SignUpForm />
        
        {/* Left side banner */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <div className="relative z-20">
            <h2 className="text-4xl font-bold mb-6">Join Kartavia Today</h2>
            <p className="text-lg text-white/90">Discover the best tours, attractions, and rentals in Yogyakarta. Start your journey with us.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
