'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Activity, Settings, AlertTriangle, Sparkles } from 'lucide-react';

export default function CapacityDashboard() {
  const supabase = createClient();
  const [destinations, setDestinations] = useState<any[]>([]);
  const [trafficData, setTrafficData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // ML State
  const [isGeneratingML, setIsGeneratingML] = useState<string | null>(null);
  const [mlRecommendations, setMlRecommendations] = useState<Record<string, any[]>>({});

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
    const { data } = await supabase.from('destinations').select('id, title, location, category, description, max_capacity, operating_hours').order('title');
    if (data) {
      setDestinations(data);
      // Fetch traffic data for each destination
      fetchTrafficData(data);
    } else {
      setIsLoading(false);
    }
  };

  const fetchTrafficData = async (dests: any[]) => {
    const trafficRecord: Record<string, any> = {};
    
    await Promise.all(
      dests.map(async (dest) => {
        if (!dest.location) return;
        try {
          const res = await fetch(`/api/admin/traffic?location=${encodeURIComponent(dest.location)}`);
          if (res.ok) {
            const data = await res.json();
            trafficRecord[dest.id] = data;
          }
        } catch (e) {
          console.error('Failed to fetch traffic for', dest.title, e);
        }
      })
    );
    
    setTrafficData(trafficRecord);
    setIsLoading(false);
  };

  const handleCapacityUpdate = async (id: string, newCapacity: number) => {
    await supabase.from('destinations').update({ max_capacity: newCapacity }).eq('id', id);
    alert('Capacity updated successfully!');
    fetchDestinations();
  };

  const generateAlternatives = async (destId: string) => {
    setIsGeneratingML(destId);
    
    const targetDest = destinations.find(d => d.id === destId);
    
    // Filter candidates: exclude target, and exclude those with High traffic
    const candidates = destinations.filter(d => 
      d.id !== destId && 
      (!trafficData[d.id] || trafficData[d.id].congestionLevel !== 'High')
    );

    try {
      const res = await fetch('/api/admin/ml-alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          congestedDestination: targetDest,
          candidates
        })
      });
      
      const data = await res.json();
      if (data.alternatives) {
        setMlRecommendations(prev => ({
          ...prev,
          [destId]: data.alternatives
        }));
      } else {
        alert(data.error || 'Failed to generate alternatives');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to ML service');
    } finally {
      setIsGeneratingML(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white">Carrying Capacity Analytics</h2>
          <p className="text-gray-500">Monitor live traffic congestion and generate ML-based alternatives to prevent overtourism.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Charts remain the same as they are mock visualizers */}
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
            <Settings className="h-5 w-5" /> Live Traffic & Control Panel
          </h3>
        </div>
        
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading control panel and traffic data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 text-sm font-medium text-gray-500 uppercase">
                    <th className="py-3 px-4">Destination</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Real-Time Traffic</th>
                    <th className="py-3 px-4 text-center">Max Capacity</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations.map((dest) => {
                    const traffic = trafficData[dest.id];
                    const isCongested = traffic?.congestionLevel === 'High';
                    const hasML = mlRecommendations[dest.id];
                    
                    return (
                      <tr key={dest.id} className="border-b border-gray-100 dark:border-slate-800/50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-black dark:text-white">{dest.title}</div>
                          <div className="text-xs text-gray-400">{dest.category}</div>
                          
                          {/* ML Recommendations Sub-row inside the cell for compactness */}
                          {hasML && (
                            <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg max-w-lg">
                              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                <Sparkles className="h-4 w-4" /> AI Suggested Alternatives
                              </h4>
                              <div className="space-y-3">
                                {hasML.map((alt: any) => (
                                  <div key={alt.id} className="text-sm">
                                    <div className="font-semibold text-black dark:text-white">{alt.title}</div>
                                    <div className="text-gray-500 text-xs italic">{alt.reasoning}</div>
                                  </div>
                                ))}
                                <button className="mt-2 text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-primary-dark w-full">
                                  Broadcast Push Notification to Users
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500 text-sm max-w-[200px] truncate" title={dest.location}>{dest.location}</td>
                        <td className="py-3 px-4">
                          {traffic ? (
                            <div className="flex items-center gap-2">
                              {isCongested ? (
                                <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium dark:bg-red-900/30 dark:text-red-400">
                                  <AlertTriangle className="h-3 w-3" />
                                  High Congestion
                                </span>
                              ) : traffic.congestionLevel === 'Moderate' ? (
                                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium dark:bg-orange-900/30 dark:text-orange-400">
                                  Moderate
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-medium dark:bg-green-900/30 dark:text-green-400">
                                  Low Traffic
                                </span>
                              )}
                              <div className="text-xs text-gray-400">
                                {traffic.currentSpeed > 0 ? `${traffic.currentSpeed}km/h` : ''}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Fetching...</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input 
                            type="number" 
                            defaultValue={dest.max_capacity} 
                            id={`cap-${dest.id}`}
                            className="w-20 text-center border border-gray-300 rounded-md py-1 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                          />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => {
                                const val = (document.getElementById(`cap-${dest.id}`) as HTMLInputElement).value;
                                handleCapacityUpdate(dest.id, parseInt(val));
                              }}
                              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-200 cursor-pointer dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700"
                            >
                              Save Cap
                            </button>
                            
                            {isCongested && !hasML && (
                              <button 
                                onClick={() => generateAlternatives(dest.id)}
                                disabled={isGeneratingML === dest.id}
                                className="bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-dark cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              >
                                {isGeneratingML === dest.id ? (
                                  <span className="animate-pulse">Analyzing...</span>
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4" /> AI Alternatives
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
