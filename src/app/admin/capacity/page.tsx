'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Activity, Settings } from 'lucide-react';

export default function CapacityDashboard() {
  const supabase = createClient();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for the chart since real IoT data isn't available
  const [chartData] = useState([
    { time: '08:00', visitors: 120, capacity: 500 },
    { time: '10:00', visitors: 350, capacity: 500 },
    { time: '12:00', visitors: 480, capacity: 500 },
    { time: '14:00', visitors: 420, capacity: 500 },
    { time: '16:00', visitors: 200, capacity: 500 },
  ]);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    const { data } = await supabase.from('destinations').select('id, title, max_capacity, operating_hours').order('title');
    if (data) setDestinations(data);
    setIsLoading(false);
  };

  const handleCapacityUpdate = async (id: string, newCapacity: number) => {
    await supabase.from('destinations').update({ max_capacity: newCapacity }).eq('id', id);
    alert('Capacity updated successfully!');
    fetchDestinations();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Carrying Capacity Analytics</h2>
          <p className="text-gray-500">Monitor and manage live destination crowd density.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">Live Prambanan Density</h3>
              <p className="text-sm text-gray-500">Current active visitors vs capacity</p>
            </div>
          </div>
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitors" stroke="#FF5A5F" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="capacity" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
           <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">Peak Hours (All Destinations)</h3>
              <p className="text-sm text-gray-500">Average crowding patterns</p>
            </div>
          </div>
          <div className="h-[300px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="visitors" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-black dark:text-white flex items-center gap-2">
            <Settings className="h-5 w-5" /> Control Panel (Max Capacity)
          </h3>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading control panel...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-sm font-medium text-gray-500 uppercase">
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Operating Hours</th>
                    <th className="py-3 px-4 text-center">Max Capacity (Per Slot)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => (
                    <tr key={dest.id} className="border-b border-gray-100 dark:border-slate-800/50 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-medium text-black dark:text-white">{dest.title}</td>
                      <td className="py-3 px-4 text-gray-500">{dest.operating_hours || '08:00 - 17:00'}</td>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="number" 
                          defaultValue={dest.max_capacity} 
                          id={`cap-${dest.id}`}
                          className="w-24 text-center border border-gray-300 rounded-md py-1 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                        />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => {
                            const val = (document.getElementById(`cap-${dest.id}`) as HTMLInputElement).value;
                            handleCapacityUpdate(dest.id, parseInt(val));
                          }}
                          className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-dark cursor-pointer"
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
