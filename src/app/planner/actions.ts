'use server'

import { createClient } from '@/utils/supabase/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function generateItinerary(formData: FormData) {
  const supabase = await createClient()
  
  const prompt = formData.get('prompt') as string
  const days = parseInt(formData.get('days') as string) || 3
  const tripType = formData.get('tripType') as string || 'solo'
  
  if (!prompt) {
    return { error: 'Please describe your dream trip' }
  }

  // Cek API Key
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { error: 'API Key Gemini belum disetel di .env.local' }
  }

  // Fetch all destinations to use as context for the AI
  const { data: destinations } = await supabase.from('destinations').select('*')
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    const systemInstruction = `
      You are a local travel expert in Yogyakarta, Indonesia. 
      The user wants a ${days}-day ${tripType} trip itinerary.
      Their specific request is: "${prompt}".
      
      Here is the list of available destinations in our database:
      ${JSON.stringify(destinations)}
      
      Create a realistic and enjoyable ${days}-day itinerary. 
      You MUST return the response strictly as a JSON array of objects. 
      Each object represents one day and MUST have the following keys:
      - "day": integer (the day number, starting from 1)
      - "title": string (catchy title for the day)
      - "description": string (detailed description of what they will do)
      - "destination": object (pick ONE destination from the available destinations list that fits the day. Return the ENTIRE exact destination object from the provided JSON. If no destination fits, return null).
      
      Example output:
      [
        {
          "day": 1,
          "title": "Historical Wonders",
          "description": "Start your solo trip by visiting Prambanan...",
          "destination": { "id": "...", "title": "Candi Prambanan", ... }
        }
      ]
    `

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: systemInstruction }] }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    })
    
    const responseText = result.response.text()
    const itinerary = JSON.parse(responseText)
    
    return { success: true, itinerary }
  } catch (error: any) {
    console.error("Gemini AI Error:", error)
    return { error: 'Gagal membuat itinerary dengan AI: ' + error.message }
  }
}
