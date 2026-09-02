import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminDestinations() {
  const supabase = await createClient()
  const { data: destinations } = await supabase
    .from('destinations')
    .select('*')
    .neq('category', 'Tour')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Destinations</h1>
        <Link prefetch={false} href="/admin/destinations/create" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {destinations?.map((dest) => (
              <tr key={dest.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-900">{dest.title}</td>
                <td className="p-4 text-gray-600">{dest.category}</td>
                <td className="p-4 text-gray-600">{dest.location}</td>
                <td className="p-4 text-gray-600">Rp {Number(dest.price).toLocaleString('id-ID')}</td>
                <td className="p-4 text-right flex justify-end items-center gap-3">
                  <Link prefetch={false} href={`/admin/destinations/${dest.id}/edit`} className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Edit">
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  <DeleteButton id={dest.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
