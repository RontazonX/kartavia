import { User, Phone, MapPin, Calendar, Users } from 'lucide-react'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'

interface ProfilePersonalInfoProps {
  user: any;
  t: any;
}

export default function ProfilePersonalInfo({ user, t }: ProfilePersonalInfoProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-100 pb-5">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <User className="h-6 w-6 text-primary" /> {t.profile.personalInfo}
        </h3>
        <p className="text-sm text-gray-500 mt-2">Manage your basic details and how we contact you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <Label>{t.profile.firstName}</Label>
          <Input type="text" name="fname" defaultValue={user.user_metadata?.first_name || ''} placeholder="John" />
        </div>
        <div>
          <Label>{t.profile.lastName}</Label>
          <Input type="text" name="lname" defaultValue={user.user_metadata?.last_name || ''} placeholder="Doe" />
        </div>
        
        <div className="md:col-span-2">
          <Label>{t.profile.email}</Label>
          <Input type="email" value={user.email} disabled className="bg-gray-50 text-gray-500 border-gray-200" />
          <p className="text-xs text-gray-400 mt-1.5 font-medium">{t.profile.emailDisabled}</p>
        </div>

        <div>
          <Label>{t.profile.phone || 'Phone Number'}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <Input type="tel" name="phone" defaultValue={user.user_metadata?.phone || ''} placeholder="+62" className="pl-10" />
          </div>
        </div>

        <div>
          <Label>{t.profile.dob || 'Date of Birth'}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <Input type="date" name="dob" defaultValue={user.user_metadata?.dob || ''} className="pl-10" />
          </div>
        </div>

        <div>
          <Label>{t.profile.gender || 'Gender'}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <select 
              name="gender" 
              defaultValue={user.user_metadata?.gender || ''} 
              className="w-full pl-10 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            >
              <option value="">Select gender</option>
              <option value="male">{t.profile.male || 'Male'}</option>
              <option value="female">{t.profile.female || 'Female'}</option>
              <option value="other">{t.profile.other || 'Other'}</option>
            </select>
          </div>
        </div>

        <div className="md:col-span-2">
          <Label>{t.profile.address || 'Address / City'}</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pt-3 pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <textarea 
              name="address" 
              defaultValue={user.user_metadata?.address || ''} 
              placeholder="Your address or city" 
              rows={3}
              className="w-full pl-10 rounded-lg border border-gray-300 bg-white pr-4 py-3 text-sm text-gray-800 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
