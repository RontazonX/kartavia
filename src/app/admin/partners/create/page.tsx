import { createPartner } from '@/app/admin/partners/actions'
import PartnerForm from '@/components/admin/PartnerForm'

export default function CreatePartner() {
  return (
    <div className="max-w-3xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Add New Tour Operator</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <PartnerForm action={createPartner} />
      </div>
    </div>
  )
}
