'use client'

import { useState, useEffect } from 'react'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'))
    if (match && match[2] === 'id') {
      setLang('id')
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'id' : 'en'
    setLang(newLang)
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000` // 1 year expiry
    window.location.reload()
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
