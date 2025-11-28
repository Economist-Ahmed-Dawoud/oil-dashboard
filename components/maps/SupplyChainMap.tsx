'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  role: string;
  color: string;
  icon: string;
  description: string;
  capacity_tons_day?: number;
  volume_mt?: number;
  demand_soybean_mt?: number;
  demand_sunflower_mt?: number;
}

interface Flow {
  id: string;
  from: string;
  to: string;
  commodity: string;
  volume_percent_of_facility: number;
  annual_volume_tons?: number;
  color: string;
  route: string;
  trade_agreement: string;
}

interface SupplyChainData {
  locations: Location[];
  supply_flows: Flow[];
}

// Custom icon factory
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    className: 'custom-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};

export default function SupplyChainMap() {
  const [data, setData] = useState<SupplyChainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/supplyChainData.json')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load supply chain data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-gray-500">Loading map data...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-red-500">Failed to load supply chain data</div>;
  }

  // Find locations by ID for flow lines
  const getLocationCoords = (id: string) => {
    const location = data.locations.find((l) => l.id === id);
    return location ? [location.lat, location.lng] : null;
  };

  // Get flow lines for polylines
  const flowLines = data.supply_flows
    .map((flow) => {
      const from = getLocationCoords(flow.from);
      const to = getLocationCoords(flow.to);
      return from && to ? { ...flow, path: [from, to] } : null;
    })
    .filter((f) => f !== null);

  return (
    <div className="w-full space-y-8">
      {/* Map Container */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-200">
        <div style={{ height: '500px' }} className="w-full">
          <MapContainer
            center={[-2, 25]}
            zoom={5}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />

            {/* Markers for locations */}
            {data.locations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={createCustomIcon(location.color, location.icon)}
              >
                <Popup maxWidth={300} className="text-sm">
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-900">{location.name}</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Role:</strong> {location.role}
                    </p>
                    <p className="text-sm text-gray-700">{location.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Flow lines */}
            {flowLines.map((flow: any) => (
              <Polyline
                key={flow.id}
                positions={flow.path}
                color={flow.color}
                weight={flow.id === selectedFlow ? 4 : 2}
                opacity={flow.id === selectedFlow ? 0.9 : 0.6}
                dashArray={flow.type === 'supplier' ? '5, 5' : 'none'}
                eventHandlers={{
                  click: () => setSelectedFlow(flow.id),
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📍 Key Locations</h3>
          <div className="space-y-3">
            {data.locations.map((location) => (
              <div key={location.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mt-1">{location.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{location.name}</div>
                  <div className="text-sm text-gray-600">{location.role}</div>
                  {location.type === 'processing_hub' && (
                    <div className="text-xs text-emerald-600 font-semibold mt-1">
                      Capacity: {location.capacity_tons_day} tons/day
                    </div>
                  )}
                  {location.type === 'supplier' && location.volume_mt && (
                    <div className="text-xs text-blue-600 font-semibold mt-1">
                      Available: {(location.volume_mt / 1000).toFixed(1)}K MT/year
                    </div>
                  )}
                  {location.type === 'market' && location.demand_soybean_mt && location.demand_sunflower_mt && (
                    <div className="text-xs text-orange-600 font-semibold mt-1">
                      Demand: {((location.demand_soybean_mt + location.demand_sunflower_mt) / 1000000).toFixed(1)}K MT/year
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📦 Trade Agreements</h3>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="font-semibold text-green-900">SADC (0% Tariff)</div>
              <p className="text-sm text-gray-700 mt-1">
                Zambia → Tanzania soybean imports duty-free
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="font-semibold text-blue-900">EAC (0% Tariff)</div>
              <p className="text-sm text-gray-700 mt-1">
                Uganda/Kenya → Tanzania sunflower imports duty-free
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border-l-4 border-emerald-500">
              <div className="font-semibold text-emerald-900">DFTP (0% Tariff)</div>
              <p className="text-sm text-gray-700 mt-1">
                Tanzania → India oil exports receive 0% duty (Least Developed Country preference)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Supply Flows Detail */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-6">📊 Supply Chain Flows</h3>
        <div className="space-y-4">
          {data.supply_flows.map((flow) => (
            <motion.div
              key={flow.id}
              className={`p-4 rounded-lg border-l-4 cursor-pointer transition-all ${
                selectedFlow === flow.id
                  ? 'bg-blue-50 border-blue-500 shadow-md'
                  : 'bg-gray-50 border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
            >
              <div className="grid md:grid-cols-3 gap-4 mb-2">
                <div>
                  <div className="text-sm text-gray-600 font-semibold">FROM</div>
                  <div className="font-bold text-gray-900">
                    {data.locations.find((l) => l.id === flow.from)?.name}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-2xl">→</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 font-semibold">TO</div>
                  <div className="font-bold text-gray-900">
                    {data.locations.find((l) => l.id === flow.to)?.name}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-3">
                <div className="bg-white rounded p-2">
                  <div className="text-xs text-gray-600">Commodity</div>
                  <div className="font-semibold text-gray-900 text-sm">{flow.commodity}</div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-xs text-gray-600">Volume</div>
                  <div className="font-semibold text-gray-900 text-sm">
                    {flow.annual_volume_tons ? `${(flow.annual_volume_tons / 1000).toFixed(0)}K tons` : `${flow.volume_percent_of_facility}% capacity`}
                  </div>
                </div>
                <div className="bg-white rounded p-2">
                  <div className="text-xs text-gray-600">Trade Agreement</div>
                  <div className="font-semibold text-emerald-600 text-sm">{flow.trade_agreement}</div>
                </div>
              </div>

              {selectedFlow === flow.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-gray-300 space-y-2"
                >
                  <div>
                    <div className="text-sm text-gray-600 font-semibold">Route</div>
                    <div className="text-gray-700">{flow.route}</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Supply Security Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl shadow-lg p-6 border-2 border-emerald-200">
        <h3 className="text-lg font-bold text-emerald-900 mb-4">🎯 Supply Chain Advantages</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-900 mb-3">Sunflower Supply (70% of facility)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Tanzania domestic: 300-350K tons (primary)</li>
              <li>✓ Uganda backup: 50-75K tons (EAC duty-free)</li>
              <li>✓ Kenya backup: 25-50K tons (EAC duty-free)</li>
              <li>✓ Cost: $350-400/ton (vs Russia $450-500/ton)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-900 mb-3">Soybean Supply (30% of facility)</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Zambia primary: 1.15 MT available (SADC duty-free)</li>
              <li>✓ Malawi backup: 475K tons available (SADC duty-free)</li>
              <li>✓ Total available: 2.3+ MT (far exceeds need)</li>
              <li>✓ Cost: $500-550/ton (vs Argentina $550-600/ton)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
