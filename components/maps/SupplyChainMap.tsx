'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';

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

/* Mobile-first animation variants */
const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Custom icon factory - enlarged for better touch targets
const createCustomIcon = (color: string, icon: string) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        color: white;
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-items: center;
        justify-content: center;
        font-size: 24px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${icon}
      </div>
    `,
    className: 'custom-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
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
      <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-3xl sm:text-4xl">
          ⚙️
        </motion.div>
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
    <div className="w-full space-y-4 sm:space-y-6 md:space-y-8">
      {/* Map Container - Dynamic responsive height */}
      <motion.div variants={fadeInUp} className="rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl overflow-hidden border border-white/60 backdrop-blur-sm">
        <div style={{ height: '320px' }} className="w-full sm:h-96 md:h-[500px]">
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
      </motion.div>

      {/* Legend - Mobile-first responsive */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6" variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/60">
          <h3 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">📍 Key Locations</h3>
          <motion.div className="space-y-2 sm:space-y-3" variants={staggerContainer} initial="initial" animate="animate">
            {data.locations.map((location) => (
              <motion.div key={location.id} variants={fadeInUp} whileHover={{ x: 2 }} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 bg-white/40 backdrop-blur rounded-lg sm:rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-all">
                <div className="text-2xl sm:text-3xl mt-1 flex-shrink-0">{location.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm sm:text-base">{location.name}</div>
                  <div className="text-xs sm:text-sm text-gray-700 font-medium">{location.role}</div>
                  {location.type === 'processing_hub' && (
                    <div className="text-xs text-emerald-600 font-bold mt-2">
                      Capacity: {location.capacity_tons_day} tons/day
                    </div>
                  )}
                  {location.type === 'supplier' && location.volume_mt && (
                    <div className="text-xs text-blue-600 font-bold mt-2">
                      Available: {(location.volume_mt / 1000).toFixed(1)}K MT/year
                    </div>
                  )}
                  {location.type === 'market' && location.demand_soybean_mt && location.demand_sunflower_mt && (
                    <div className="text-xs text-orange-600 font-bold mt-2">
                      Demand: {((location.demand_soybean_mt + location.demand_sunflower_mt) / 1000000).toFixed(1)}K MT/year
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/60">
          <h3 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">📦 Trade Agreements</h3>
          <motion.div className="space-y-2 sm:space-y-3" variants={staggerContainer} initial="initial" animate="animate">
            {[
              { color: 'from-green-100 to-green-200', border: 'border-green-500', title: 'SADC (0% Tariff)', desc: 'Zambia → Tanzania soybean imports duty-free' },
              { color: 'from-blue-100 to-blue-200', border: 'border-blue-500', title: 'EAC (0% Tariff)', desc: 'Uganda/Kenya → Tanzania sunflower imports duty-free' },
              { color: 'from-emerald-100 to-emerald-200', border: 'border-emerald-500', title: 'DFTP (0% Tariff)', desc: 'Tanzania → India oil exports receive 0% duty (Least Developed Country preference)' },
            ].map((agreement, idx) => (
              <motion.div key={idx} variants={fadeInUp} className={`p-2 sm:p-3 md:p-4 bg-gradient-to-br ${agreement.color} rounded-lg sm:rounded-xl border-l-4 ${agreement.border} shadow-sm hover:shadow-md transition-all`}>
                <div className="font-bold text-slate-900 text-sm sm:text-base">{agreement.title}</div>
                <p className="text-xs sm:text-sm text-gray-700 mt-1 sm:mt-2 leading-relaxed">{agreement.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Supply Flows Detail */}
      <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-white/60">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">📊 Supply Chain Flows</h3>
        <motion.div className="space-y-2 sm:space-y-3 md:space-y-4" variants={staggerContainer} initial="initial" animate="animate">
          {data.supply_flows.map((flow, idx) => (
            <motion.div
              key={flow.id}
              variants={fadeInUp}
              whileHover={{ y: -1 }}
              className={`p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl border-l-4 cursor-pointer transition-all backdrop-blur ${
                selectedFlow === flow.id
                  ? 'bg-blue-100/60 border-blue-500 shadow-lg'
                  : 'bg-white/40 border-white/60 hover:bg-white/50 hover:shadow-md'
              }`}
              onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
                <div>
                  <div className="text-xs text-gray-700 font-bold uppercase tracking-wide">FROM</div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                    {data.locations.find((l) => l.id === flow.from)?.name}
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-400">→</div>
                </div>
                <div>
                  <div className="text-xs text-gray-700 font-bold uppercase tracking-wide">TO</div>
                  <div className="font-bold text-slate-900 text-sm sm:text-base mt-1">
                    {data.locations.find((l) => l.id === flow.to)?.name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3">
                <div className="bg-white/60 backdrop-blur rounded-lg p-2 sm:p-3 border border-white/60">
                  <div className="text-xs text-gray-700 font-bold uppercase tracking-wide">Commodity</div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-1">{flow.commodity}</div>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-lg p-2 sm:p-3 border border-white/60">
                  <div className="text-xs text-gray-700 font-bold uppercase tracking-wide">Volume</div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-1">
                    {flow.annual_volume_tons ? `${(flow.annual_volume_tons / 1000).toFixed(0)}K tons` : `${flow.volume_percent_of_facility}% capacity`}
                  </div>
                </div>
                <div className="bg-white/60 backdrop-blur rounded-lg p-2 sm:p-3 border border-white/60">
                  <div className="text-xs text-gray-700 font-bold uppercase tracking-wide">Trade Agreement</div>
                  <div className="font-bold text-emerald-600 text-xs sm:text-sm mt-1">{flow.trade_agreement}</div>
                </div>
              </div>

              {selectedFlow === flow.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-white/40 space-y-2"
                >
                  <div>
                    <div className="text-sm text-gray-700 font-bold uppercase tracking-wide">Route</div>
                    <div className="text-gray-700 mt-1">{flow.route}</div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Supply Security Summary */}
      <motion.div variants={fadeInUp} className="bg-gradient-to-r from-emerald-50/80 via-green-50/80 to-teal-50/80 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-emerald-200/60 backdrop-blur-sm">
        <h3 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">🎯 Supply Chain Advantages</h3>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6" variants={staggerContainer} initial="initial" animate="animate">
          <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200/60">
            <h4 className="font-bold text-emerald-900 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Sunflower Supply (70% of facility)</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Tanzania domestic: 300-350K tons (primary)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Uganda backup: 50-75K tons (EAC duty-free)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Kenya backup: 25-50K tons (EAC duty-free)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Cost: $350-400/ton (vs Russia $450-500/ton)</span>
              </li>
            </ul>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-emerald-200/60">
            <h4 className="font-bold text-emerald-900 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg">Soybean Supply (30% of facility)</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Zambia primary: 1.15 MT available (SADC duty-free)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Malawi backup: 475K tons available (SADC duty-free)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Total available: 2.3+ MT (far exceeds need)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-emerald-500 font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                <span>Cost: $500-550/ton (vs Argentina $550-600/ton)</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
