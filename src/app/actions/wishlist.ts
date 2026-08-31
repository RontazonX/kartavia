'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkWishlistStatus(destinationId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { isSaved: false, isAuthenticated: false }

    const { data, error } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('destination_id', destinationId)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error(error)
    }

    return { isSaved: !!data, isAuthenticated: true }
  } catch (error) {
    console.error('Error checking wishlist status:', error)
    return { isSaved: false, isAuthenticated: false }
  }
}

export async function toggleWishlist(destinationId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'You must be logged in to save destinations.' }
    }

    // Check if it already exists
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('destination_id', destinationId)
      .single()

    if (existing) {
      // Remove it
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('id', existing.id)
        
      if (error) return { error: error.message }
      
      revalidatePath('/dashboard/wishlist')
      revalidatePath('/explore')
      revalidatePath(`/detail/${destinationId}`)
      return { success: true, isSaved: false }
    } else {
      // Add it
      const { error } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          destination_id: destinationId
        })
        
      if (error) return { error: error.message }
      
      revalidatePath('/dashboard/wishlist')
      revalidatePath('/explore')
      revalidatePath(`/detail/${destinationId}`)
      return { success: true, isSaved: true }
    }
  } catch (error: any) {
    console.error('Error in toggleWishlist:', error)
    return { error: error.message || 'An unexpected error occurred' }
  }
}
