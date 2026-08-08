'use server'

import { createClient } from '@/utils/supabase/server'
import OpenAI from 'openai'

export async function generateItinerary(formData: FormData) {
  const supabase = await createClient()
  
  const prompt = formData.get('prompt') as string
  const days = parseInt(formData.get('days') as string) || 3
  const tripType = formData.get('tripType') as string || 'solo'
  
  if (!prompt) {
    return { error: 'Please describe your dream trip' }
  }

  // Cek API Key 9Router
  const apiKey = process.env.NINEROUTER_API_KEY
  const baseURL = process.env.NINEROUTER_BASE_URL
  if (!apiKey || !baseURL) {
    return { error: 'API Key atau Base URL 9Router belum disetel di .env.local' }
  }

  // Fetch all destinations to use as context for the AI (optimized for token usage)
  const { data: destinations } = await supabase.from('destinations').select('id, title, category, location, price, rating')
  
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });
    
    const modelName = process.env.NINEROUTER_PLANNER_MODEL || 'gemini/gemini-3-flash-preview';
    
    const systemInstruction = `
      You are a local travel expert in Yogyakarta, Indonesia. 
      The user wants a ${days}-day ${tripType} trip itinerary.
      Their specific request is: "${prompt}".
      
      Here is the list of available destinations in our database:
      ${JSON.stringify(destinations)}
      
      Create a realistic and enjoyable ${days}-day itinerary. 
      You MUST return the response strictly as a JSON array of objects without any markdown formatting like \`\`\`json.
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
          "destination": { "id": "...", "title": "Candi Prambanan" }
        }
      ]
    `

    const response = await openai.chat.completions.create({
      model: modelName,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: 'Generate my itinerary now based on the system instructions. Only return raw JSON array.' }
      ],
      temperature: 0.7
    });
    
    // Some models wrap JSON in markdown block even if told not to
    let responseText = response.choices[0]?.message?.content || "[]"
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim()

    const itinerary = JSON.parse(responseText)
    
    return { success: true, itinerary }
  } catch (error: any) {
    console.error("9Router API Error:", error)
    return { error: 'Gagal membuat itinerary dengan AI 9Router: ' + error.message }
  }
}
