'use server'

import { createClient } from '@/utils/supabase/server'

export type TourGuide = {
  id: string
  name: string
  bio: string
  image_url: string | null
  daily_rate: number
  spot_rate: number
  languages: string[]
  rating: number
  reviews_count: number
}

export async function getTourGuides(): Promise<TourGuide[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tour_guides')
    .select('*')
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching tour guides:', error)
    return []
  }

  return data || []
}

export async function getTourGuideById(id: string): Promise<TourGuide | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tour_guides')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching tour guide:', error)
    return null
  }

  return data
}

export type GuideBookingInput = {
  guide_id: string
  booking_type: 'daily' | 'spot'
  destination_id?: string
  start_date: string
  duration: number
  total_price: number
  contact_number: string
  special_requests?: string
}

export async function createGuideBooking(input: GuideBookingInput) {
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError || !userData?.user) {
    return { error: 'User not authenticated' }
  }

  const { error } = await supabase
    .from('guide_bookings')
    .insert([
      {
        user_id: userData.user.id,
        guide_id: input.guide_id,
        booking_type: input.booking_type,
        destination_id: input.destination_id || null,
        start_date: input.start_date,
        duration: input.duration,
        total_price: input.total_price,
        contact_number: input.contact_number,
        special_requests: input.special_requests,
        status: 'pending'
      }
    ])

  if (error) {
    console.error('Error creating guide booking:', error)
    return { error: 'Failed to create booking' }
  }

  return { success: true }
}

export async function getGuidesByDestination(destinationId: string): Promise<TourGuide[]> {
  const supabase = await createClient()

  // Find guides mapped to this destination
  const { data: mappingData, error: mappingError } = await supabase
    .from('guide_destinations')
    .select('guide_id')
    .eq('destination_id', destinationId)

  if (mappingError || !mappingData || mappingData.length === 0) {
    return []
  }

  const guideIds = mappingData.map(m => m.guide_id)

  const { data, error } = await supabase
    .from('tour_guides')
    .select('*')
    .in('id', guideIds)
    .order('rating', { ascending: false })

  if (error) {
    console.error('Error fetching guides by destination:', error)
    return []
  }

  return data || []
}

export async function getGuideDestinations(guideId: string): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guide_destinations')
    .select('destination_id')
    .eq('guide_id', guideId)

  if (error) {
    console.error('Error fetching guide destinations:', error)
    return []
  }

  return data?.map(d => d.destination_id) || []
}

export type AdminTourGuideInput = Omit<TourGuide, 'id' | 'created_at'> & { id?: string }

export async function upsertTourGuide(guideInput: AdminTourGuideInput, destinationIds: string[]) {
  const supabase = await createClient()

  let guideId = guideInput.id

  // 1. Upsert Guide
  if (guideId) {
    const { error } = await supabase
      .from('tour_guides')
      .update({
        name: guideInput.name,
        bio: guideInput.bio,
        image_url: guideInput.image_url,
        daily_rate: guideInput.daily_rate,
        spot_rate: guideInput.spot_rate,
        languages: guideInput.languages,
        rating: guideInput.rating,
        reviews_count: guideInput.reviews_count
      })
      .eq('id', guideId)

    if (error) return { error: error.message }
  } else {
    const { data, error } = await supabase
      .from('tour_guides')
      .insert([{
        name: guideInput.name,
        bio: guideInput.bio,
        image_url: guideInput.image_url,
        daily_rate: guideInput.daily_rate,
        spot_rate: guideInput.spot_rate,
        languages: guideInput.languages,
        rating: guideInput.rating || 0,
        reviews_count: guideInput.reviews_count || 0
      }])
      .select()
      .single()

    if (error) return { error: error.message }
    if (data) guideId = data.id
  }

  if (!guideId) return { error: 'Failed to save guide' }

  // 2. Sync Destinations
  // Delete existing
  await supabase.from('guide_destinations').delete().eq('guide_id', guideId)

  // Insert new
  if (destinationIds && destinationIds.length > 0) {
    const mappings = destinationIds.map(destId => ({
      guide_id: guideId,
      destination_id: destId
    }))
    const { error: mapError } = await supabase.from('guide_destinations').insert(mappings)
    if (mapError) return { error: mapError.message }
  }

  return { success: true, guideId }
}

export async function deleteTourGuide(id: string) {
  const supabase = await createClient()

  // Note: guide_destinations mapping table relies on ON DELETE CASCADE, 
  // so deleting the guide will automatically delete mappings.
  const { error } = await supabase.from('tour_guides').delete().eq('id', id)

  if (error) {
    console.error('Error deleting tour guide:', error)
    return { error: error.message }
  }

  return { success: true }
}
