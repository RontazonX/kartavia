import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'

export default async function AdminTours() {
  const supabase = await createClient()
  const { data: tours } = await supabase
    .from('destinations')
    .select('*, partners(name)')
    .eq('category', 'Tour')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Tour Packages</h1>
        <Link href="/admin/tours/create" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Tour
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
              <th className="p-4">Package Name</th>
              <th className="p-4">Tour Operator</th>
              <th className="p-4">Price</th>
              <th className="p-4">Duration</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tours?.map((tour: any) => (
              <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{tour.title}</td>
                <td className="p-4 text-gray-600">{tour.partners?.name || 'No Partner'}</td>
                <td className="p-4 text-gray-600">Rp {Number(tour.price).toLocaleString('id-ID')}</td>
                <td className="p-4 text-gray-600">{tour.duration}</td>
                <td className="p-4 text-right flex justify-end items-center gap-3">
                  <Link href={`/admin/tours/${tour.id}/edit`} className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Edit">
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  <span className="text-xs text-gray-400">(API Delete)</span>
                </td>
              </tr>
            ))}
            {tours?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No tour packages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
