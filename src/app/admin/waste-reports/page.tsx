import { createClient } from '@/utils/supabase/server'
import { CheckCircle, AlertTriangle, MapPin, Calendar } from 'lucide-react'
import ResolveButton from './ResolveButton'

export default async function WasteReportsPage() {
  const supabase = await createClient()

  // Fetch reports with user and destination details
  const { data: reports, error } = await supabase
    .from('waste_reports')
    .select(`
      *,
      destinations (title, location)
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Citizen Waste Reports</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage environmental cleanliness reports from tourists.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports?.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
            No waste reports yet. Great job keeping the destinations clean!
          </div>
        )}

        {reports?.map((report: any) => (
          <div key={report.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
            <div className="h-48 relative overflow-hidden bg-gray-100">
              <img src={report.image_url} alt="Waste condition" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3">
                {report.status === 'resolved' ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                    <CheckCircle className="w-3 h-3 mr-1" /> Resolved
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Action Needed
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-bold text-black dark:text-white mb-1 line-clamp-1">{report.destinations?.title || 'Unknown Destination'}</h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <MapPin className="w-3 h-3 mr-1" /> {report.destinations?.location || 'Unknown Location'}
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 mb-4 italic flex-1 border border-gray-100 dark:border-slate-700">
                "{report.description}"
              </div>
              
              <div className="flex items-center text-xs text-gray-400 mb-4 justify-between">
                <span>Reported by: User</span>
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" /> 
                  {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>
              
              {report.status !== 'resolved' && (
                <ResolveButton reportId={report.id} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
