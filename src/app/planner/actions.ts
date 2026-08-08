'use server'

import { createClient } from '@/utils/supabase/server'

export async function generateItinerary(formData: FormData) {
  const supabase = await createClient()
  
  const prompt = formData.get('prompt') as string
  const days = parseInt(formData.get('days') as string) || 3
  
  if (!prompt) {
    return { error: 'Please describe your dream trip' }
  }

  // Fetch all destinations to use as context for the AI
  const { data: destinations } = await supabase.from('destinations').select('*')
  
  // Here is where we would call the Gemini API:
  // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  // const result = await model.generateContent(`Create a ${days}-day itinerary based on these destinations: ${JSON.stringify(destinations)}. User prompt: ${prompt}`)
  
  // Simulated AI delay (Mocking response since no API key provided)
  await new Promise(resolve => setTimeout(resolve, 2000))

  const matchedDestinations = destinations && destinations.length > 0 ? destinations : []
  
  const itinerary = Array.from({ length: days }).map((_, i) => {
    // Pick a destination safely
    const dest = matchedDestinations.length > 0 ? matchedDestinations[i % matchedDestinations.length] : null
    
    return {
      day: i + 1,
      title: dest ? `Discovering ${dest.location}` : `Day ${i + 1} Adventure`,
      description: dest 
        ? `Start your day by visiting the incredible ${dest.title}. ${dest.description.substring(0, 100)}... Take plenty of photos and enjoy the local atmosphere!`
        : `Explore the hidden gems of the city and enjoy local culinary delights.`,
      destination: dest
    }
  })

  return { success: true, itinerary }
}
