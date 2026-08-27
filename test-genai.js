const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');

const envFile = fs.readFileSync('.env.local', 'utf8');
envFile.split('\n').forEach(line => {
    if (line.includes('=')) {
        const [key, value] = line.split('=');
        process.env[key.trim()] = value.trim();
    }
});

async function test() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Say hello world in json {"msg": "..."}',
        config: {
            responseMimeType: "application/json",
        }
    });
    console.log(response.text);
}

test().catch(console.error);
