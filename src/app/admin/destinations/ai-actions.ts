'use server'

import { GoogleGenAI } from '@google/genai'

export async function findWikipediaImage(title: string) {
  try {
    const headers = { 'User-Agent': 'KartaviaApp/1.0 (contact@kartavia.com)' }
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&pithumbsize=1000&format=json`, { headers })
    const data = await res.json()
    const pages = data.query?.pages
    if (pages) {
      const pageId = Object.keys(pages)[0]
      if (pageId !== '-1' && pages[pageId].thumbnail) {
        return { success: true, url: pages[pageId].thumbnail.source }
      }
    }
    // Fallback to general search if title doesn't match a page exactly
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(title)}&utf8=&format=json`, { headers })
    const searchData = await searchRes.json()
    if (searchData.query?.search?.length > 0) {
        const firstResultTitle = searchData.query.search[0].title
        const res2 = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(firstResultTitle)}&pithumbsize=1000&format=json`, { headers })
        const data2 = await res2.json()
        const pages2 = data2.query?.pages
        if (pages2) {
            const pageId2 = Object.keys(pages2)[0]
            if (pageId2 !== '-1' && pages2[pageId2].thumbnail) {
                return { success: true, url: pages2[pageId2].thumbnail.source }
            }
        }
    }
    
    return { success: false, error: 'No image found' }
  } catch (e) {
    return { success: false, error: 'Failed to fetch image' }
  }
}

export async function generateDescriptionAI(title: string, location: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { success: false, error: 'GEMINI_API_KEY is not set in environment variables.' }
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `Anda adalah seorang ahli pemasaran pariwisata profesional. 
Tolong cari informasi terbaru dari internet tentang destinasi wisata: "${title}" yang berlokasi di "${location}".
Berdasarkan data fakta yang Anda temukan di web, tulislah sebuah deskripsi yang menarik untuk mempromosikan tempat ini (sekitar 2-3 paragraf singkat) dalam bahasa Indonesia. 
Fokus pada daya tarik utama, suasana, dan alasan mengapa wisatawan harus mengunjunginya.
Selain itu, berikan 2 hingga 4 highlight singkat (maksimal 3 kata per highlight, dipisahkan koma) tentang tempat ini.

Format respons Anda HARUS berupa JSON murni dengan format seperti ini:
{
  "description": "paragraf deskripsi yang panjang...",
  "highlights": "Pemandangan Indah, Sunset Menawan, Spot Foto"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json'
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return { success: true, description: data.description, highlights: data.highlights }
    }

    return { success: false, error: 'AI response was empty' }
  } catch (e: any) {
    return { success: false, error: e.message || 'Failed to generate description' }
  }
}
