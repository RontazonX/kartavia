import ContactForm from '@/components/form/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hubungi Kami | Kartavia',
  description: 'Hubungi tim Kartavia untuk pertanyaan seputar paket wisata Yogyakarta, kolaborasi bisnis, atau bantuan lainnya.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
            Mari <span className="text-primary">Terhubung</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Tim kami siap membantu Anda merencanakan perjalanan tak terlupakan atau menjawab pertanyaan apa pun terkait layanan Kartavia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16 max-w-7xl mx-auto">
          
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Alamat Kantor</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Jl. Malioboro No. 123, Suryatmajan, Danurejan, Kota Yogyakarta 55213</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">hello@kartavia.com</p>
                    <p className="text-gray-600 dark:text-gray-400">support@kartavia.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Telepon / WhatsApp</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">+62 812-3456-7890</p>
                    <p className="text-sm text-gray-500 mt-1">Senin - Jumat (09:00 - 17:00)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 dark:bg-slate-800 h-64 rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-col gap-2">
                <MapPin className="w-8 h-8 opacity-50" />
                <span className="font-medium">Peta Interaktif Google Maps</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>

        </div>
      </div>
    </div>
  );
}
