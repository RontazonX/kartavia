import { ShieldCheck, Map, Sparkles, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { getTranslation } from '@/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tentang Kartavia - Platform Wisata Yogyakarta',
  description: 'Kartavia adalah platform pariwisata yang menghubungkan wisatawan dengan destinasi terbaik di Yogyakarta. Pemandu lokal berpengalaman, AI Planner, dan pemesanan aman.',
  openGraph: {
    title: 'Tentang Kartavia - Platform Wisata Yogyakarta',
    description: 'Kartavia adalah platform pariwisata yang menghubungkan wisatawan dengan destinasi terbaik di Yogyakarta.',
  },
};

export default async function AboutPage() {
  const t = await getTranslation();

  const features = [
    {
      icon: <Map className="w-6 h-6 text-primary" />,
      title: 'Pemandu Lokal Berpengalaman',
      description: 'Jelajahi sudut tersembunyi Jogja bersama warga lokal yang tahu cerita di balik setiap batu candi dan jalanan rahasia.'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'AI Itinerary Planner',
      description: 'Buat rencana perjalanan otomatis yang disesuaikan dengan preferensi gaya liburan dan anggaran Anda dalam hitungan detik.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: 'Pemesanan Aman & Terpercaya',
      description: 'Transaksi aman dengan mitra resmi. Kepastian tiket dan penginapan tanpa perlu khawatir penipuan atau calo.'
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: 'Dukungan Pelanggan 24/7',
      description: 'Tim kami selalu siap membantu Anda kapan saja, memastikan liburan Anda di Jogja berjalan lancar tanpa hambatan.'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pt-24 pb-20 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Kenapa Memilih <span className="text-primary">Kartavia?</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Lebih dari sekadar platform pemesanan. Kami adalah teman perjalanan Anda untuk mengungkap pesona sejati dari Daerah Istimewa Yogyakarta, menghadirkan pengalaman premium yang tak terlupakan.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-surface dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm flex items-center justify-center mb-6 border border-gray-100 dark:border-slate-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-surface dark:bg-slate-800 rounded-3xl p-10 text-center border border-gray-100 dark:border-slate-700 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Siap Memulai Petualangan?</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Temukan destinasi impian Anda hari ini dan buat kenangan indah bersama Kartavia.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/explore" 
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-full transition-colors inline-flex items-center justify-center"
            >
              Mulai Eksplorasi
            </Link>
            <Link 
              href="/planner" 
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 font-medium py-3 px-8 rounded-full transition-colors inline-flex items-center justify-center"
            >
              Coba AI Planner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
