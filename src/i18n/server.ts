import { cookies } from 'next/headers'
import en from './dictionaries/en.json'
import id from './dictionaries/id.json'

export async function getTranslation() {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  return locale === 'id' ? id : en
}
