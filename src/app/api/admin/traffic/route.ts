import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');

  if (!location) {
    return NextResponse.json({ error: 'Location is required' }, { status: 400 });
  }

  const TOMTOM_API_KEY = process.env.TOMTOM_API_KEY;
  if (!TOMTOM_API_KEY) {
    return NextResponse.json({ error: 'TomTom API Key is not configured' }, { status: 500 });
  }

  try {
    // 1. Geocode the location text to get Lat/Lng
    // Using TomTom Search API (Fuzzy Search)
    const geocodeUrl = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(location)}.json?key=${TOMTOM_API_KEY}&limit=1`;
    const geoRes = await fetch(geocodeUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 });
    }

    const position = geoData.results[0].position;
    const { lat, lon } = position;

    // 2. Fetch traffic flow data around the coordinates
    // Using TomTom Traffic Flow API (Absolute)
    // Style: 10 (absolute), zoom: 12 (approx 10km radius context)
    const trafficUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${lat},${lon}`;
    
    const trafficRes = await fetch(trafficUrl);
    
    if (!trafficRes.ok) {
      // If there's no traffic data for this exact point, return default Moderate
      console.warn('Traffic API error or no data for point', lat, lon);
      return NextResponse.json({ 
        congestionLevel: 'Moderate', 
        currentSpeed: 0, 
        freeFlowSpeed: 0,
        coordinates: { lat, lon }
      });
    }

    const trafficData = await trafficRes.json();
    const flow = trafficData.flowSegmentData;

    if (!flow) {
      return NextResponse.json({ 
        congestionLevel: 'Low', 
        currentSpeed: 0, 
        freeFlowSpeed: 0,
        coordinates: { lat, lon }
      });
    }

    const currentSpeed = flow.currentSpeed;
    const freeFlowSpeed = flow.freeFlowSpeed;
    
    // Calculate congestion level
    // If current speed is less than 60% of free flow speed, it's highly congested
    // If less than 85%, moderate
    // Otherwise low
    let congestionLevel = 'Low';
    
    // Safety check in case freeFlowSpeed is 0
    if (freeFlowSpeed > 0) {
      const ratio = currentSpeed / freeFlowSpeed;
      if (ratio < 0.6) {
        congestionLevel = 'High';
      } else if (ratio < 0.85) {
        congestionLevel = 'Moderate';
      }
    }

    return NextResponse.json({
      congestionLevel,
      currentSpeed,
      freeFlowSpeed,
      coordinates: { lat, lon }
    });

  } catch (error: any) {
    console.error('Error fetching traffic data:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch traffic data' }, { status: 500 });
  }
}
