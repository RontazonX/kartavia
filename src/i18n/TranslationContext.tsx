'use client'

import React, { createContext, useContext, useState } from 'react'
import en from './dictionaries/en.json'
import id from './dictionaries/id.json'

type Locale = 'en' | 'id'
type Dictionary = typeof en

interface TranslationContextType {
  lang: Locale
  t: Dictionary
  setLang: (lang: Locale) => void
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [lang, setLangState] = useState<Locale>(initialLocale)

  const setLang = (newLang: Locale) => {
    setLangState(newLang)
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000` // 1 year expiry
  }

  const t = lang === 'id' ? id : en

  return (
    <TranslationContext.Provider value={{ lang, t, setLang }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslationContext() {
  const context = useContext(TranslationContext)
  if (context === undefined) {
    throw new Error('useTranslationContext must be used within a TranslationProvider')
  }
  return context
}
