'use client'

import { useTranslationContext } from './TranslationContext'

export function useTranslation() {
  return useTranslationContext()
}
