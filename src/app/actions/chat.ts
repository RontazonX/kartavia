'use server'

import { GoogleGenAI } from '@google/genai';

export async function chatWithAI(message: string, history: {role: 'user' | 'ai', content: string}[] = []) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return { success: false, error: 'GEMINI_API_KEY is missing' };
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let prompt = "You are Kartavia AI Assistant, a helpful tourism guide for the Jogja region (Yogyakarta, Indonesia). Keep your answers concise, friendly, and in Indonesian.\n\n";
    
    if (history.length > 0) {
      prompt += "Conversation history:\n";
      history.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Kartavia AI'}: ${msg.content}\n`;
      });
      prompt += "\n";
    }
    
    prompt += `User: ${message}\nKartavia AI:`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
    });

    if (response.text) {
        return { success: true, reply: response.text };
    }
    return { success: false, error: 'Empty response from AI' };
  } catch (e: any) {
    console.error("AI Chat Error:", e);
    return { success: false, error: e.message || 'Failed to generate response' };
  }
}
