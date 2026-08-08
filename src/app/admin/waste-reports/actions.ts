'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function resolveReport(reportId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('waste_reports')
    .update({ status: 'resolved' })
    .eq('id', reportId)

  if (error) {
    console.error('Error resolving report:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/waste-reports')
  return { success: true }
}
