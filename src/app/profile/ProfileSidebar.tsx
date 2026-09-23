'use client'

import { User, LayoutDashboard, Settings, Compass, Shield, Camera, Loader2 } from 'lucide-react'

export type TabId = 'overview' | 'personal' | 'preferences' | 'security'

interface ProfileSidebarProps {
  user: any;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  avatarUrl: string;
  isUploading: boolean;
  handleFileUpload: (file: File) => void;
  t: any;
}

export default function ProfileSidebar({ 
  user, 
  activeTab, 
  setActiveTab, 
  avatarUrl, 
  isUploading, 
  handleFileUpload,
  t 
}: ProfileSidebarProps) {

  const navItems = [
    { id: 'overview' as TabId, label: t.profile.overview || 'Overview', icon: LayoutDashboard },
    { id: 'personal' as TabId, label: t.profile.personalInfo, icon: User },
    { id: 'preferences' as TabId, label: t.profile.preferences || 'Preferences', icon: Compass },
    { id: 'security' as TabId, label: t.profile.security, icon: Shield },
  ]

  return (
    <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col items-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
        <div className="relative rounded-full overflow-hidden w-28 h-28 border-4 border-white shadow-md z-10 mb-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
              <User className="w-12 h-12" />
            </div>
          )}
          <div className={`absolute inset-0 bg-black/40 ${avatarUrl ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'} transition-all duration-300 flex items-center justify-center backdrop-blur-[2px]`}>
            <label className={`cursor-pointer text-white flex flex-col items-center justify-center h-full w-full hover:scale-105 transition-transform ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              {isUploading ? <Loader2 className="w-6 h-6 animate-spin mb-1" /> : <Camera className="w-6 h-6 mb-1" />}
              <span className="text-[10px] font-semibold uppercase tracking-wider">{isUploading ? t.profile.uploading || '...' : (t.profile.changePhoto || 'Change')}</span>
              <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} />
            </label>
          </div>
        </div>
        
        <h2 className="text-lg font-bold text-gray-900 truncate w-full text-center relative z-10">
          {user.user_metadata?.first_name || 'Explorer'} {user.user_metadata?.last_name || ''}
        </h2>
        <p className="text-xs text-gray-500 mt-1 truncate w-full text-center relative z-10">{user.email}</p>
      </div>

      <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 hide-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all whitespace-nowrap shrink-0 md:shrink ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
