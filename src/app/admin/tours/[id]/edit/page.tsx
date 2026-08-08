import { updateTour } from '@/app/admin/tours/actions'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import TourPackageForm from '@/components/admin/TourPackageForm'

export default async function EditTour({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()
  
  const { data: destination } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()
    
  const { data: partners } = await supabase.from('partners').select('id, name')
    
  if (!destination) {
    notFound()
  }

  const updateTourWithId = updateTour.bind(null, destination.id)
  
  let parsedHighlights = []
  let parsedIncluded = []
  let parsedExcluded = []
  let parsedItinerary = []
  
  try {
    parsedHighlights = JSON.parse(destination.highlights)
  } catch {
    parsedHighlights = destination.highlights || []
  }
  
  try { parsedIncluded = JSON.parse(destination.included_benefits) } catch { parsedIncluded = destination.included_benefits || [] }
  try { parsedExcluded = JSON.parse(destination.excluded_benefits) } catch { parsedExcluded = destination.excluded_benefits || [] }
  try { parsedItinerary = JSON.parse(destination.itinerary) } catch { parsedItinerary = destination.itinerary || [] }
  
  const highlightsString = Array.isArray(parsedHighlights) ? parsedHighlights.join(', ') : ''
  const includedString = Array.isArray(parsedIncluded) ? parsedIncluded.join('\n') : ''
  const excludedString = Array.isArray(parsedExcluded) ? parsedExcluded.join('\n') : ''
  const itineraryString = Array.isArray(parsedItinerary) ? parsedItinerary.join('\n') : ''

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-black mb-8">Edit Tour Package</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <TourPackageForm 
          initialData={{ 
            ...destination, 
            highlightsString,
            includedString,
            excludedString,
            itineraryString
          }} 
          action={updateTourWithId} 
          partners={partners || []}
        />
      </div>
    </div>
  )
}
