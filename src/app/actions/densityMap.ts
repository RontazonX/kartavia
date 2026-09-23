'use server'

import { createClient } from '@/utils/supabase/server'
import { getBulkBookedSlots } from '@/components/booking/actions'
import { format, addDays } from 'date-fns'

const DUMMY_COORDINATES: Record<string, { lat: number, lng: number, defaultCapacity: number }> = {
  'candi prambanan': { lat: -7.7520, lng: 110.4915, defaultCapacity: 500 },
  'pantai drini': { lat: -8.1384, lng: 110.5790, defaultCapacity: 400 },
  'taman sari': { lat: -7.8100, lng: 110.3592, defaultCapacity: 200 },
  'hutan pinus': { lat: -7.9255, lng: 110.4300, defaultCapacity: 300 },
  'tebing breksi': { lat: -7.7816, lng: 110.5042, defaultCapacity: 400 },
  'goa pindul': { lat: -7.9262, lng: 110.6480, defaultCapacity: 250 },
  'pantai timang': { lat: -8.1187, lng: 110.6212, defaultCapacity: 150 },
  'kalibiru': { lat: -7.8049, lng: 110.1264, defaultCapacity: 200 },
  'keraton': { lat: -7.8053, lng: 110.3642, defaultCapacity: 300 },
  'ratu boko': { lat: -7.7681, lng: 110.4897, defaultCapacity: 300 },
  'malioboro': { lat: -7.7926, lng: 110.3658, defaultCapacity: 1000 },
  'pantai parangtritis': { lat: -8.0238, lng: 110.3292, defaultCapacity: 800 },
  'merapi': { lat: -7.5407, lng: 110.4461, defaultCapacity: 400 },
  'borobudur': { lat: -7.6079, lng: 110.2038, defaultCapacity: 1000 },
};

// Fallback coordinate around central Jogja if not found
const FALLBACK_LAT = -7.7956;
const FALLBACK_LNG = 110.3695;

export type DestinationDensity = {
  id: string;
  title: string;
  lat: number;
  lng: number;
  todayPercentage: number;
  tomorrowPercentage: number;
  todayLevel: 'Low' | 'Medium' | 'High';
  tomorrowLevel: 'Low' | 'Medium' | 'High';
}

function getLevel(percentage: number): 'Low' | 'Medium' | 'High' {
  if (percentage >= 90) return 'High';
  if (percentage >= 60) return 'Medium';
  return 'Low';
}

function findCoordinates(title: string) {
  const lowerTitle = title.toLowerCase();
  for (const key in DUMMY_COORDINATES) {
    if (lowerTitle.includes(key)) {
      return DUMMY_COORDINATES[key];
    }
  }
  return { lat: FALLBACK_LAT + (Math.random() * 0.1 - 0.05), lng: FALLBACK_LNG + (Math.random() * 0.1 - 0.05), defaultCapacity: 200 };
}

export async function getDensityMapData(): Promise<DestinationDensity[]> {
  const supabase = await createClient();
  
  // Fetch all destinations
  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('id, title');
    
  if (error) {
    console.error("Error fetching destinations for map:", error);
  }
    
  if (!destinations) return [];

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const tomorrowStr = format(addDays(new Date(), 1), 'yyyy-MM-dd');
  const destinationIds = destinations.map(d => d.id);

  // Use bulk fetch to prevent N+1 query problem
  const bulkBookings = await getBulkBookedSlots(destinationIds, [todayStr, tomorrowStr]);

  const densityData = destinations.map((dest) => {
    const coords = findCoordinates(dest.title || '');
    const capacity = coords.defaultCapacity;
    
    const todayBookings = bulkBookings[dest.id]?.[todayStr] || 0;
    const tomorrowBookings = bulkBookings[dest.id]?.[tomorrowStr] || 0;

    const todayPercentage = Math.min((todayBookings / capacity) * 100, 100);
    const tomorrowPercentage = Math.min((tomorrowBookings / capacity) * 100, 100);

    return {
      id: dest.id,
      title: dest.title,
      lat: coords.lat,
      lng: coords.lng,
      todayPercentage,
      tomorrowPercentage,
      todayLevel: getLevel(todayPercentage),
      tomorrowLevel: getLevel(tomorrowPercentage)
    };
  });
  
  // Sort by today's density descending
  densityData.sort((a, b) => b.todayPercentage - a.todayPercentage);

  return densityData;
}
