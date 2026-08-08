'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

type ContactFormInputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>();

  const onSubmit: SubmitHandler<ContactFormInputs> = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Simulate API call for sending email/saving to DB
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Form data submitted:', data);
      
      setSubmitStatus('success');
      reset(); // clear form
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-800 p-8 md:p-10 w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Hubungi Kami</h2>
        <p className="text-gray-600 dark:text-gray-400">Punya pertanyaan tentang paket wisata? Silakan kirim pesan kepada tim Kartavia.</p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-8 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-2xl flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-success-600 dark:text-success-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-success-800 dark:text-success-400">Pesan Terkirim!</h4>
            <p className="text-sm text-success-700 dark:text-success-500/80 mt-1">Terima kasih telah menghubungi kami. Tim kami akan segera merespons email Anda.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-8 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-error-600 dark:text-error-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-error-800 dark:text-error-400">Gagal Mengirim Pesan</h4>
            <p className="text-sm text-error-700 dark:text-error-500/80 mt-1">Maaf, terjadi kesalahan pada server kami. Silakan coba lagi nanti.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              className={`w-full bg-gray-50 dark:bg-slate-800 border ${
                errors.name ? 'border-error-500 focus:ring-error-500' : 'border-gray-200 dark:border-slate-700 focus:ring-primary focus:border-primary'
              } text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors`}
              {...register('name', { required: 'Nama lengkap wajib diisi' })}
            />
            {errors.name && <p className="mt-2 text-sm text-error-500">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className={`w-full bg-gray-50 dark:bg-slate-800 border ${
                errors.email ? 'border-error-500 focus:ring-error-500' : 'border-gray-200 dark:border-slate-700 focus:ring-primary focus:border-primary'
              } text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors`}
              {...register('email', { 
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format email tidak valid'
                }
              })}
            />
            {errors.email && <p className="mt-2 text-sm text-error-500">{errors.email.message}</p>}
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subjek
          </label>
          <input
            id="subject"
            type="text"
            placeholder="Pertanyaan tentang paket wisata..."
            className={`w-full bg-gray-50 dark:bg-slate-800 border ${
              errors.subject ? 'border-error-500 focus:ring-error-500' : 'border-gray-200 dark:border-slate-700 focus:ring-primary focus:border-primary'
            } text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors`}
            {...register('subject', { required: 'Subjek wajib diisi' })}
          />
          {errors.subject && <p className="mt-2 text-sm text-error-500">{errors.subject.message}</p>}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pesan
          </label>
          <textarea
            id="message"
            rows={5}
            placeholder="Tuliskan pesan Anda di sini..."
            className={`w-full bg-gray-50 dark:bg-slate-800 border ${
              errors.message ? 'border-error-500 focus:ring-error-500' : 'border-gray-200 dark:border-slate-700 focus:ring-primary focus:border-primary'
            } text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-colors resize-none`}
            {...register('message', { 
              required: 'Pesan wajib diisi',
              minLength: { value: 10, message: 'Pesan minimal 10 karakter' }
            })}
          />
          {errors.message && <p className="mt-2 text-sm text-error-500">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-medium py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Mengirim...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Kirim Pesan</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
