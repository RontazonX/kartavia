import { useState } from 'react'
import { Compass, Coffee, Home } from 'lucide-react'
import Label from '@/components/form/Label'

interface ProfilePreferencesProps {
  user: any;
  t: any;
}

const ALL_INTERESTS = [
  'Culture & History',
  'Nature & Wildlife',
  'Culinary',
  'Adrenaline & Extreme',
  'Relaxation & Spa',
  'Photography',
  'Shopping',
  'Local Village Tours'
]

export default function ProfilePreferences({ user, t }: ProfilePreferencesProps) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user.user_metadata?.interests || []
  )

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    )
  }

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-10">
      <div className="border-b border-gray-100 pb-5">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Compass className="h-6 w-6 text-primary" /> {t.profile.preferences || 'Travel Preferences'}
        </h3>
        <p className="text-sm text-gray-500 mt-2">Personalize your Kartavia experience so we can recommend the best destinations for you.</p>
      </div>

      {/* Hidden input to submit the array as JSON */}
      <input type="hidden" name="interests" value={JSON.stringify(selectedInterests)} />

      <div>
        <Label className="text-lg font-semibold mb-4 block">{t.profile.interests || 'What are you interested in?'}</Label>
        <div className="flex flex-wrap gap-3">
          {ALL_INTERESTS.map(interest => {
            const isSelected = selectedInterests.includes(interest)
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isSelected 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' 
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {interest}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Coffee className="w-4 h-4" /> {t.profile.dietary || 'Dietary Requirements'}
          </Label>
          <select 
            name="dietary" 
            defaultValue={user.user_metadata?.dietary || ''} 
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="">None / No Restrictions</option>
            <option value="halal">Halal</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="gluten-free">Gluten Free</option>
          </select>
        </div>

        <div>
          <Label className="flex items-center gap-2 mb-3">
            <Home className="w-4 h-4" /> {t.profile.accommodation || 'Accommodation Style'}
          </Label>
          <select 
            name="accommodation" 
            defaultValue={user.user_metadata?.accommodation || ''} 
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
          >
            <option value="">Any</option>
            <option value="luxury">Luxury Hotels & Resorts</option>
            <option value="boutique">Boutique Hotels</option>
            <option value="homestay">Homestays / Local Living</option>
            <option value="budget">Budget / Hostels</option>
          </select>
        </div>
      </div>
    </div>
  )
}
