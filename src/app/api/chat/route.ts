import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // Simulate network delay for AI thinking (1.5 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Basic heuristic mock AI responses based on keywords in the user's message
    const msgLower = message.toLowerCase();
    let reply = "Maaf, saya tidak mengerti. Apakah Anda ingin rekomendasi wisata alam, budaya, atau kuliner di Yogyakarta?";

    if (msgLower.includes('candi') || msgLower.includes('prambanan') || msgLower.includes('borobudur')) {
      reply = "Untuk wisata candi, Candi Prambanan dan Borobudur adalah pilihan terbaik! Candi Prambanan menawarkan keindahan arsitektur Hindu, sedangkan Borobudur sangat memukau saat sunrise. Mau saya pesankan tiketnya?";
    } else if (msgLower.includes('pantai') || msgLower.includes('gunung kidul')) {
      reply = "Gunung Kidul surganya pantai! Anda wajib mengunjungi Pantai Indrayanti, Pantai Kukup, atau mencoba Cave Tubing di Gua Pindul. Mau lihat daftar paket wisatanya?";
    } else if (msgLower.includes('makan') || msgLower.includes('kuliner') || msgLower.includes('gudeg')) {
      reply = "Jangan lewatkan Gudeg Yu Djum atau Sate Klathak Pak Pong jika Anda mencari kuliner legendaris di Jogja. Sangat direkomendasikan!";
    } else if (msgLower.includes('belanja') || msgLower.includes('malioboro')) {
      reply = "Jalan Malioboro adalah pusat belanja ikonik di Jogja. Anda bisa beli batik, suvenir, dan makan di angkringan. Jangan lupa mampir ke Pasar Beringharjo!";
    } else if (msgLower.includes('halo') || msgLower.includes('hai')) {
      reply = "Halo juga! Saya siap membantu merencanakan perjalanan impian Anda di Yogyakarta. Destinasi seperti apa yang sedang Anda cari?";
    } else if (msgLower.includes('harga') || msgLower.includes('murah')) {
      reply = "Kami memiliki berbagai paket wisata mulai dari yang budget-friendly hingga premium. Silakan cek menu 'Explore' dan gunakan filter harga kami!";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
