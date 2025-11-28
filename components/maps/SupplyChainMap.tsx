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

      {/* Supply Flows - Interactive Visual Flows */}
      <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-sky-50/80 backdrop-blur rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 border border-blue-200/60 overflow-hidden">
        {/* Decorative background elements */}
        <motion.div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-200 rounded-full blur-3xl" />
        </motion.div>

        <div className="relative z-10">
          <h3 className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
            <span>🔄 Supply Chain Flows</span>
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              className="text-lg"
            >
              ↻
            </motion.span>
          </h3>

          <motion.div className="space-y-2 sm:space-y-3 md:space-y-4" variants={staggerContainer} initial="initial" animate="animate">
            {data.supply_flows.map((flow, idx) => {
              const fromLocation = data.locations.find((l) => l.id === flow.from);
              const toLocation = data.locations.find((l) => l.id === flow.to);
              const isSelected = selectedFlow === flow.id;

              // Determine badge color based on trade agreement
              const getBadgeColor = (agreement?: string) => {
                if (!agreement) return 'from-gray-400 to-slate-500';
                if (agreement.includes('DFTP')) return 'from-emerald-400 to-green-500';
                if (agreement.includes('SADC')) return 'from-blue-400 to-cyan-500';
                if (agreement.includes('EAC')) return 'from-purple-400 to-pink-500';
                return 'from-gray-400 to-slate-500';
              };

              // Skip rendering if location references are missing
              if (!fromLocation || !toLocation) return null;

              return (
                <motion.div
                  key={flow.id}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedFlow(selectedFlow === flow.id ? null : flow.id)}
                  className={`relative overflow-hidden rounded-lg sm:rounded-xl border cursor-pointer transition-all backdrop-blur group ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80 border-cyan-400 shadow-xl'
                      : 'bg-white/50 border-white/60 hover:bg-white/70 hover:border-blue-300/80 shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Animated gradient border */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-cyan-400/20 to-blue-400/0 opacity-50"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                    />
                  )}

                  <div className="relative z-10 p-3 sm:p-4 md:p-5">
                    {/* Header: FROM → TO with animated arrow */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 sm:gap-3 md:gap-2 mb-3 sm:mb-4 items-center">
                      {/* From Location */}
                      <div className="md:col-span-2">
                        <div className="text-xs text-gray-600 font-bold uppercase tracking-wider opacity-75">FROM</div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base mt-1 flex items-center gap-2">
                          <span className="text-lg">{fromLocation?.icon}</span>
                          {fromLocation?.name}
                        </div>
                      </div>

                      {/* Animated Arrow */}
                      <div className="hidden md:flex items-center justify-center">
                        <motion.div
                          animate={{ x: [0, 6, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                          className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent"
                        >
                          →
                        </motion.div>
                      </div>

                      {/* To Location */}
                      <div className="md:col-span-2">
                        <div className="text-xs text-gray-600 font-bold uppercase tracking-wider opacity-75">TO</div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base mt-1 flex items-center gap-2">
                          <span className="text-lg">{toLocation?.icon}</span>
                          {toLocation?.name}
                        </div>
                      </div>
                    </div>

                    {/* Metrics Grid - Mobile Arrow Version */}
                    <div className="md:hidden mb-3">
                      <motion.div
                        animate={{ y: [0, 4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                        className="text-xl font-bold text-blue-400 text-center"
                      >
                        ↓
                      </motion.div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                      {/* Commodity Card */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur rounded-lg p-2 sm:p-3 border border-blue-200/60 shadow-sm"
                      >
                        <div className="text-xs text-blue-700 font-bold uppercase tracking-wide">📦 Commodity</div>
                        <div className="font-bold text-slate-900 text-sm mt-1 flex items-center gap-1">
                          {flow.commodity === 'Soybean' ? '🫘' : '🌻'} {flow.commodity}
                        </div>
                      </motion.div>

                      {/* Volume Card with Visual Bar */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-white/80 to-cyan-50/80 backdrop-blur rounded-lg p-2 sm:p-3 border border-cyan-200/60 shadow-sm"
                      >
                        <div className="text-xs text-cyan-700 font-bold uppercase tracking-wide">📊 Volume</div>
                        <div className="font-bold text-slate-900 text-sm mt-1">
                          {flow.annual_volume_tons ? `${(flow.annual_volume_tons / 1000).toFixed(0)}K tons` : `${flow.volume_percent_of_facility}%`}
                        </div>
                        {/* Volume visualization bar */}
                        <motion.div
                          className="w-full h-1.5 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-full mt-2 overflow-hidden"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: 0.3 + idx * 0.1, duration: 0.8 }}
                        />
                      </motion.div>

                      {/* Trade Agreement Badge */}
                      <motion.div
                        whileHover={{ y: -2 }}
                        className="bg-gradient-to-br from-white/80 to-emerald-50/80 backdrop-blur rounded-lg p-2 sm:p-3 border border-emerald-200/60 shadow-sm"
                      >
                        <div className="text-xs text-emerald-700 font-bold uppercase tracking-wide">🤝 Agreement</div>
                        <motion.div
                          className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getBadgeColor(flow.trade_agreement)} shadow-md`}
                          whileHover={{ scale: 1.1 }}
                        >
                          {flow.trade_agreement}
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Expandable Route Details */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-blue-200/60 space-y-2 sm:space-y-3"
                        >
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                            <div className="text-xs text-blue-700 font-bold uppercase tracking-wide mb-1">🗺️ Detailed Route</div>
                            <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-lg p-2 sm:p-3 border border-blue-200/40 text-gray-700 text-xs sm:text-sm leading-relaxed">
                              {flow.route}
                            </div>
                          </motion.div>

                          {/* Additional Flow Stats */}
                          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-2 sm:gap-3">
                            <div className="bg-white/60 rounded-lg p-2 border border-blue-200/40">
                              <div className="text-xs text-gray-600 font-bold">Tariff Status</div>
                              <div className="font-semibold text-emerald-600 text-sm mt-1">0% Duty ✓</div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-2 border border-blue-200/40">
                              <div className="text-xs text-gray-600 font-bold">Flow Type</div>
                              <div className="font-semibold text-blue-600 text-sm mt-1">{flow.commodity}</div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Expand/Collapse Indicator */}
                    <motion.div
                      className="flex justify-center mt-2 text-gray-400"
                      animate={{ rotate: isSelected ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-xs">▼</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
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
