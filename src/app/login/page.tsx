import SignInForm from './SignInForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center py-10 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex overflow-hidden w-full max-w-6xl min-h-[600px]">
        <SignInForm />
        
        {/* Right side banner */}
        <div className="hidden lg:flex flex-col justify-center items-center w-1/2 bg-primary p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 z-10"></div>
          <div className="relative z-20">
            <h2 className="text-4xl font-bold mb-6">Welcome back to Kartavia</h2>
            <p className="text-lg text-white/90">Access your dashboard, manage your bookings, and plan your next adventure in Yogyakarta.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
