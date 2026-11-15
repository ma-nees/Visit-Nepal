'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons in React Leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });
}

export interface NepalMapProps {
  height?: string;
}

export const NepalMap: React.FC<NepalMapProps> = ({ height = '100%' }) => {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/nepal.geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setGeoData(data);
      })
      .catch(() => { });
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#EAF3FB',
      }}
      className="overflow-hidden"
    >
      <MapContainer
        center={[28.3949, 84.124]}
        zoom={7}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%', minHeight: '380px', backgroundColor: '#EAF3FB' }}
      >
        {/* 100% Free OpenStreetMap Tiles - No API key required */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Nepal Border GeoJSON - Brown outline with soft #92C4EA sky blue fill */}
        {geoData && (
          <GeoJSON
            data={geoData}
            style={() => ({
              color: '#8B4513', // Warm Himalayan Earth Brown outline
              weight: 4.5,
              opacity: 0.95,
              fillColor: '#92C4EA', // Soft sky blue from brand palette (#92C4EA)
              fillOpacity: 0.35,
            })}
          />
        )}

        {/* Kathmandu */}
        <Marker position={[27.7172, 85.324]}>
          <Popup>
            <div className="text-slate-900 font-sans text-xs">
              <b className="text-[#0552A2] text-sm">Kathmandu</b>
              <br />
              Capital City of Nepal
              <br />
              <span className="text-[10px] text-slate-500 font-mono">Elevation: 1,400m</span>
            </div>
          </Popup>
        </Marker>

        {/* Pokhara */}
        <Marker position={[28.2096, 83.9856]}>
          <Popup>
            <div className="text-slate-900 font-sans text-xs">
              <b className="text-[#0552A2] text-sm">Pokhara</b>
              <br />
              Gandaki Province • Phewa Lake
              <br />
              <span className="text-[10px] text-slate-500 font-mono">Elevation: 822m</span>
            </div>
          </Popup>
        </Marker>

        {/* Mount Everest / Khumbu */}
        <Marker position={[27.9881, 86.925]}>
          <Popup>
            <div className="text-slate-900 font-sans text-xs">
              <b className="text-[#EC1F27] text-sm">Mt. Everest (Sagarmatha)</b>
              <br />
              Khumbu Region • Top of the World
              <br />
              <span className="text-[10px] font-bold text-slate-600 font-mono">Elevation: 8,848.86m</span>
            </div>
          </Popup>
        </Marker>

        {/* Annapurna Sanctuary */}
        <Marker position={[28.5306, 83.878]}>
          <Popup>
            <div className="text-slate-900 font-sans text-xs">
              <b className="text-[#0552A2] text-sm">Annapurna Sanctuary</b>
              <br />
              Alpine Amphitheater &amp; Base Camp
              <br />
              <span className="text-[10px] text-slate-500 font-mono">Elevation: 4,130m</span>
            </div>
          </Popup>
        </Marker>

        {/* Chitwan */}
        <Marker position={[27.5341, 84.4533]}>
          <Popup>
            <div className="text-slate-900 font-sans text-xs">
              <b className="text-[#0552A2] text-sm">Chitwan National Park</b>
              <br />
              Subtropical Jungle &amp; Rhino Sanctuary
              <br />
              <span className="text-[10px] text-slate-500 font-mono">Elevation: 150m</span>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default NepalMap;
