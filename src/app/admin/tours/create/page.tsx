import { createTour } from '@/app/admin/tours/actions'
import TourPackageForm from '@/components/admin/TourPackageForm'
import { createClient } from '@/utils/supabase/server'

export default async function CreateTour() {
  const supabase = await createClient()
  const { data: partners } = await supabase.from('partners').select('id, name')

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Add New Tour Package</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <TourPackageForm action={createTour} partners={partners || []} />
      </div>
    </div>
  )
}
