'use client'

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'
import { DestinationDensity } from '@/app/actions/densityMap'

interface MapCanvasProps {
  data: DestinationDensity[];
  mode: 'today' | 'tomorrow';
  searchedDest?: DestinationDensity | null;
}

function MapFlyTo({ dest }: { dest?: DestinationDensity | null }) {
  const map = useMap();
  useEffect(() => {
    if (dest) {
      map.flyTo([dest.lat, dest.lng], 13, { duration: 1.5 });
    }
  }, [dest, map]);
  return null;
}

export default function MapCanvas({ data, mode, searchedDest }: MapCanvasProps) {
  // Center of Jogja
  const center: [number, number] = [-7.7956, 110.3695];

  const getColor = (level: string) => {
    switch (level) {
      case 'High': return '#FF5A5F'; // Red (crowded)
      case 'Medium': return '#F59E0B'; // Orange
      default: return '#10B981'; // Green (not crowded)
    }
  }

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative z-0">
      <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="h-full w-full relative z-0">
        <MapFlyTo dest={searchedDest} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data.map((dest) => {
          const percentage = mode === 'today' ? dest.todayPercentage : dest.tomorrowPercentage;
          const level = mode === 'today' ? dest.todayLevel : dest.tomorrowLevel;
          const color = getColor(level);

          return (
            <CircleMarker
              key={dest.id}
              center={[dest.lat, dest.lng]}
              radius={10}
              pathOptions={{ fillColor: color, color: '#fff', weight: 2, fillOpacity: 0.8 }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-900 mb-1">{dest.title}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    Kondisi {mode === 'today' ? 'Hari Ini' : 'Prediksi Besok'}:
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                    <span className="font-medium text-gray-800">
                      {level === 'High' ? 'Sangat Ramai' : level === 'Medium' ? 'Mulai Ramai' : 'Aman/Sepi'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Kapasitas: {percentage.toFixed(0)}% terisi
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}
