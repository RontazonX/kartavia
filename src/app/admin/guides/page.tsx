import React from 'react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteTourGuide } from '@/app/actions/guides';
import Image from 'next/image';

export default async function AdminGuidesPage() {
  const supabase = await createClient();
  
  const { data: guides } = await supabase
    .from('tour_guides')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Manage Tour Guides
        </h2>
        <Link
          href="/admin/guides/new"
          className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add Guide
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-800/50 text-left border-b border-gray-200 dark:border-slate-800">
                <th className="py-4 px-4 font-medium text-black dark:text-white">Guide</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Rates</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">Rating</th>
                <th className="py-4 px-4 font-medium text-black dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guides && guides.length > 0 ? (
                guides.map((guide) => (
                  <tr key={guide.id} className="border-b border-gray-100 dark:border-slate-800 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative shrink-0">
                          {guide.image_url ? (
                            <Image src={guide.image_url} alt={guide.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{guide.name.charAt(0)}</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-black dark:text-white">{guide.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">{guide.languages?.join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-black dark:text-white">Rp {guide.daily_rate?.toLocaleString()}/day</p>
                      <p className="text-xs text-gray-500">Rp {guide.spot_rate?.toLocaleString()}/spot</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{guide.rating}</span>
                        <span className="text-xs text-gray-400">({guide.reviews_count})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/guides/${guide.id}`}
                          className="hover:text-primary transition-colors text-slate-500"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <DeleteButton 
                          id={guide.id} 
                          action={deleteTourGuide} 
                          className="hover:text-error-500 transition-colors text-slate-500" 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No guides found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
