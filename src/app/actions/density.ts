'use server'

import { createClient } from '@/utils/supabase/server'
import { fetchLiveCrowdLevel } from '@/utils/traffic'

export async function syncAllDestinationsDensity() {
  const supabase = await createClient()

  // Fetch all destinations
  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('id, title, location')

  if (error || !destinations) {
    console.error('Error fetching destinations for density sync', error)
    return { error: 'Failed to fetch destinations' }
  }

  const updates = await Promise.all(
    destinations.map(async (dest) => {
      // Hit our simulated TomTom / Maps API
      const crowdLevel = await fetchLiveCrowdLevel(dest.title, dest.location)
      
      return supabase
        .from('destinations')
        .update({ 
          crowd_level: crowdLevel,
          crowd_updated_at: new Date().toISOString()
        })
        .eq('id', dest.id)
    })
  )

  const failures = updates.filter(u => u.error)
  if (failures.length > 0) {
    console.error(`Failed to sync ${failures.length} destinations`)
  }

  return { success: true, updated: destinations.length - failures.length }
}

export async function getAlternativeDestinations(currentCategory: string, limit: number = 3) {
  const supabase = await createClient()

  // We define alternatives as those in the same category that are NOT crowded 
  // (Hidden gems / Low traffic alternatives)
  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('category', currentCategory)
    .eq('crowd_level', 'Low')
    .limit(limit)

  if (error) {
    console.error('Error fetching alternative destinations', error)
    return []
  }

  return data || []
}
