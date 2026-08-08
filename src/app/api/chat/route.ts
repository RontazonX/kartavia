import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const apiKey = process.env.NINEROUTER_API_KEY;
    const baseURL = process.env.NINEROUTER_BASE_URL;
    
    if (!apiKey || !baseURL) {
      return NextResponse.json(
        { reply: "Maaf, sistem AI sedang offline karena konfigurasi 9Router belum lengkap." },
        { status: 200 }
      );
    }

    // Fetch context from database
    const supabase = await createClient();
    const { data: destinations } = await supabase
      .from('destinations')
      .select('id, title, category, location, price, rating');

    // Build system instruction
    const systemInstruction = `
      Anda adalah "Kartavia AI", asisten travel lokal pintar dan ramah untuk platform pariwisata Kartavia di Yogyakarta.
      Tugas utama Anda adalah merekomendasikan destinasi wisata (Attraction) dan Paket Tur (Tour) yang ada di database Kartavia kepada pengguna.
      Gunakan bahasa Indonesia yang santai, sopan, antusias, dan profesional (menggunakan "Anda" atau "Kamu").

      Berikut adalah database destinasi dan paket tur Kartavia yang tersedia saat ini:
      ${JSON.stringify(destinations)}

      Aturan penting:
      1. JANGAN PERNAH merekomendasikan tempat atau paket tur yang TIDAK ADA di dalam database di atas. Jika pengguna menanyakan tempat di luar database, beritahu dengan sopan bahwa Kartavia belum memiliki paket/tiket untuk tempat tersebut, lalu tawarkan alternatif dari database.
      2. Selalu sebutkan Harga (price) dan Kategori (Tour/Attraction) jika relevan, format harga dalam Rupiah.
      3. Jika pengguna bertanya tentang fasilitas tur, lihat field 'included_benefits' dan 'excluded_benefits'.
      4. Jangan berikan jawaban terlalu panjang, buatlah ringkas, *scannable* (gunakan bullet points jika perlu), dan persuasif agar pengguna tertarik memesan di Kartavia.
      5. Selalu berikan respon sebagai asisten Kartavia, bukan AI umum.
    `;

    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseURL,
    });

    const modelName = process.env.NINEROUTER_CHAT_MODEL || 'kr/claude-sonnet-4.5';

    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'ai' ? 'assistant' : 'user',
      content: msg.content
    }));

    const response = await openai.chat.completions.create({
      model: modelName, 
      messages: [
        { role: 'system', content: systemInstruction },
        ...formattedMessages
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content || "Maaf, saya tidak dapat merespon saat ini.";

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { reply: 'Maaf, ada error koneksi ke 9Router: ' + error.message },
      { status: 500 }
    );
  }
}
