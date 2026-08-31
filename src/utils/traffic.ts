// src/utils/traffic.ts

export type CrowdLevel = 'Low' | 'Medium' | 'Crowded'

/**
 * Fetches live crowd level using TomTom Traffic API,
 * with a fallback to deterministic simulation if API key is missing or request fails.
 */
export async function fetchLiveCrowdLevel(destinationTitle: string, location: string): Promise<CrowdLevel> {
  const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
  
  if (TOMTOM_API_KEY) {
    try {
      // 1. Geocode the location text to get Lat/Lng
      const query = `${destinationTitle}, ${location}`;
      const geocodeUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=1`;
      const geoRes = await fetch(geocodeUrl);
      const geoData = await geoRes.json();

      if (geoData.results && geoData.results.length > 0) {
        const { lat, lon } = geoData.results[0].position;

        // 2. Fetch traffic flow data around the coordinates
        const trafficUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${lat},${lon}`;
        const trafficRes = await fetch(trafficUrl);
        
        if (trafficRes.ok) {
          const trafficData = await trafficRes.json();
          const flow = trafficData.flowSegmentData;

          if (flow && flow.freeFlowSpeed > 0) {
            const ratio = flow.currentSpeed / flow.freeFlowSpeed;
            if (ratio < 0.6) return 'Crowded';
            if (ratio < 0.85) return 'Medium';
            return 'Low';
          }
        }
      }
    } catch (error) {
      console.error('TomTom API error:', error);
    }
  }

  // Fallback Simulation if no key or API failed
  const currentHour = new Date().getHours()
  const baseScore = destinationTitle.length + location.length
  
  let timeModifier = 0
  if (currentHour >= 10 && currentHour <= 17) {
    timeModifier = 2
  } else if (currentHour >= 18 && currentHour <= 21) {
    timeModifier = 1
  }

  const finalScore = (baseScore % 3) + timeModifier

  if (finalScore >= 3) return 'Crowded'
  if (finalScore === 2) return 'Medium'
  return 'Low'
}
