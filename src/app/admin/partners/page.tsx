import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit } from 'lucide-react'
import DeleteButton from '@/components/admin/DeleteButton'

export default async function AdminPartners() {
  const supabase = await createClient()
  const { data: partners } = await supabase.from('partners').select('*, destinations(count)').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Tour Operators / Partners</h1>
        <Link href="/admin/partners/create" className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center">
          <Plus className="h-4 w-4 mr-2" /> Add Partner
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
              <th className="p-4">Logo</th>
              <th className="p-4">Partner Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Tour Packages</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {partners?.map((partner: any) => (
              <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden border border-gray-200 flex items-center justify-center">
                    {partner.logo_url ? (
                      <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-gray-400 font-bold">{partner.name.substring(0,2)}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-gray-900">{partner.name}</td>
                <td className="p-4 text-gray-600">{partner.location}</td>
                <td className="p-4 text-gray-600">{partner.destinations?.[0]?.count || 0}</td>
                <td className="p-4 text-right flex justify-end items-center gap-3">
                  <Link href={`/admin/partners/${partner.id}/edit`} className="text-blue-500 hover:text-blue-700 cursor-pointer" title="Edit">
                    <Edit className="h-4 w-4 inline" />
                  </Link>
                  {/* Delete Button would go here, maybe reuse or create a specific one for partners */}
                  <span className="text-xs text-gray-400">(API Delete)</span>
                </td>
              </tr>
            ))}
            {partners?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">No partners found. Add a tour operator to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
