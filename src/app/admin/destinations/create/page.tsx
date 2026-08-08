import { createDestination } from '@/app/admin/destinations/actions'
import DestinationForm from '@/components/admin/DestinationForm'

export default function CreateDestination() {
  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-black dark:text-white mb-8">Add New Destination</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <DestinationForm action={createDestination} />
      </div>
    </div>
  )
}
