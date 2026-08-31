'use client'

import { Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/i18n/client'

export default function LanguageSwitcher() {
  const { lang, setLang } = useTranslation()
  const router = useRouter()

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'id' : 'en'
    setLang(newLang)
    router.refresh()
  }

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-full border border-gray-200 hover:border-primary/50 hover:bg-primary/5 bg-white cursor-pointer shadow-sm"
    >
      <Globe className="h-4 w-4 text-primary" />
      <span className="font-bold">{lang === 'en' ? 'EN' : 'ID'}</span>
    </button>
  )
}
