'use client'

import { useState, useEffect } from 'react'
import en from './dictionaries/en.json'
import id from './dictionaries/id.json'

export function useTranslation() {
  const [lang, setLang] = useState('en')
  
  useEffect(() => {
    // Read from document.cookie
    const match = document.cookie.match(new RegExp('(^| )NEXT_LOCALE=([^;]+)'))
    if (match && (match[2] === 'id' || match[2] === 'en')) {
      setLang(match[2])
    }
  }, [])

  const t = lang === 'id' ? id : en
  return { t, lang }
}
