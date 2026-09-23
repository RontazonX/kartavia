import { Leaf, MapPin, Compass, Award } from 'lucide-react'

interface ProfileOverviewProps {
  user: any;
  t: any;
}

export default function ProfileOverview({ user, t }: ProfileOverviewProps) {
  // Mock data or fallback logic
  const ecoScore = user.user_metadata?.admin_eco_score || 250
  const upcomingTrips = 0
  const style = user.user_metadata?.travelStyle || 'Nature Explorer'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      {/* Welcome Card - spans 2 cols on tablet/desktop */}
      <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-primary-dark rounded-[2rem] p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium mb-1">Welcome back,</p>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready for your next adventure in Jogja?
          </h2>
          <button type="button" onClick={() => window.location.href = '/explore'} className="bg-white text-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:scale-105 transition-transform w-max">
            Explore Destinations
          </button>
        </div>
      </div>

      {/* Eco Score Bento Cell */}
      <div className="bg-emerald-50 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center border border-emerald-100/50 shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
          <Leaf className="w-7 h-7" />
        </div>
        <h3 className="text-3xl font-black text-emerald-700 tracking-tight">{ecoScore}</h3>
        <p className="text-sm text-emerald-600/80 font-medium mt-1">{t.profile.ecoScoreDesc || 'Green Points'}</p>
      </div>

      {/* Stats row */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{upcomingTrips}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Upcoming Trips</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 truncate">{style}</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{t.profile.travelStyle || 'Travel Style'}</p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900 truncate">Beginner</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Explorer Rank</p>
          </div>
        </div>
      </div>
    </div>
  )
}
