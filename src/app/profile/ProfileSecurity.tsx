import { Shield, Key } from 'lucide-react'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'

interface ProfileSecurityProps {
  t: any;
}

export default function ProfileSecurity({ t }: ProfileSecurityProps) {
  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-8">
      <div className="border-b border-gray-100 pb-5">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" /> {t.profile.security}
        </h3>
        <p className="text-sm text-gray-500 mt-2">Update your password to keep your account secure.</p>
      </div>

      <div className="max-w-md space-y-6">
        <div>
          <Label className="flex items-center gap-2 mb-2">
            <Key className="w-4 h-4" /> {t.profile.newPassword}
          </Label>
          <Input 
            type="password" 
            name="newPassword" 
            placeholder={t.profile.newPasswordPlaceholder} 
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
