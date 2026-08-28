import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { congestedDestination, candidates } = await request.json();

    if (!congestedDestination || !candidates || !Array.isArray(candidates)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    // Construct the prompt
    const prompt = `
      You are an AI tourism assistant for Kartavia. The main destination "${congestedDestination.title}" (Category: ${congestedDestination.category}, Location: ${congestedDestination.location}) is currently experiencing heavy traffic and overtourism.
      
      We need to recommend 2 alternative destinations from the following available candidates which currently have low/moderate traffic:
      ${JSON.stringify(candidates.map((c: any) => ({ id: c.id, title: c.title, category: c.category, location: c.location, description: c.description })), null, 2)}
      
      Please pick the 2 best alternatives that offer a similar experience (e.g., similar category or vibe).
      
      Return your response STRICTLY as a JSON array containing exactly 2 objects. Each object must have:
      - "id": The exact ID of the chosen destination.
      - "title": The title of the destination.
      - "reasoning": A short, persuasive sentence (max 150 characters) explaining why this is a good alternative to ${congestedDestination.title} for tourists.
      
      Output ONLY valid JSON without Markdown blocks or any other text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let text = response.text || '[]';
    // Clean up potential markdown formatting
    if (text.startsWith('\`\`\`json')) {
      text = text.replace(/\`\`\`json\n?/, '').replace(/\`\`\`\n?$/, '');
    }

    const alternatives = JSON.parse(text);

    return NextResponse.json({ alternatives });

  } catch (error: any) {
    console.error('Error in ML alternatives API:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate ML alternatives' }, { status: 500 });
  }
}
