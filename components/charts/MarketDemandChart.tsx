'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface OilType {
  oil_type: string;
  imports_mt: number;
  percentage: number;
  status: string;
  suppliers: Array<{ country: string; share: number; color: string }>;
}

interface MarketData {
  india_total_imports: {
    volume_mt: number;
    value_billion_usd: number;
  };
  oil_breakdown: OilType[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export default function MarketDemandChart() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/marketData.json')
      .then((res) => res.json())
      .then((data) => {
        setMarketData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load market data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }} className="text-4xl">
          ⚙️
        </motion.div>
      </div>
    );
  }

  if (!marketData) {
    return <div className="text-red-500">Failed to load market data</div>;
  }

  const pieData = marketData.oil_breakdown.map((oil) => ({
    name: oil.oil_type,
    value: parseFloat(oil.imports_mt.toString()),
    color: oil.oil_type === 'Soybean' ? '#3b82f6' : oil.oil_type === 'Sunflower' ? '#fbbf24' : '#d1d5db',
  }));

  const soybeanOil = marketData.oil_breakdown.find((o) => o.oil_type === 'Soybean');
  const soybeanSuppliers = soybeanOil?.suppliers.map((s) => ({
    name: s.country,
    value: s.share,
    color: s.color,
  })) || [];

  const sunflowerOil = marketData.oil_breakdown.find((o) => o.oil_type === 'Sunflower');
  const sunflowerSuppliers = sunflowerOil?.suppliers.map((s) => ({
    name: s.country,
    value: s.share,
    color: s.color,
  })) || [];

  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="w-full space-y-8">
      {/* Key Metrics */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Imports', value: `${marketData.india_total_imports.volume_mt} MT`, icon: '📦', color: 'from-blue-500 to-cyan-500' },
          { label: 'Market Value', value: `$${marketData.india_total_imports.value_billion_usd}B`, icon: '💎', color: 'from-emerald-500 to-teal-500' },
          { label: 'Soybean Growth', value: '+36% YoY', icon: '📈', color: 'from-yellow-500 to-amber-500' },
          { label: 'Sunflower Dep.', value: '97%', icon: '🌻', color: 'from-orange-500 to-red-500' },
        ].map((metric, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${metric.color} p-6 text-white shadow-xl group`}
          >
            {/* Animated background glow */}
            <motion.div
              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />

            <div className="relative z-10">
              <div className="text-4xl mb-2">{metric.icon}</div>
              <div className="text-xs font-bold tracking-widest uppercase opacity-80 mb-1">{metric.label}</div>
              <div className="text-2xl font-black">{metric.value}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Charts Section */}
      <motion.div
        variants={fadeInUp}
        className="rounded-2xl bg-white/60 backdrop-blur border border-white/40 shadow-2xl p-8 overflow-hidden"
      >
        <h3 className="text-2xl font-black text-slate-900 mb-8">
          India's Edible Oil Imports by Type (16 MT Total)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(2)}MT`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} MT`, 'Volume']}
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-4">
            {pieData.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 8 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-slate-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-black text-slate-900">{item.value.toFixed(2)} MT</div>
                  <div className="text-xs text-slate-500 font-semibold">
                    {((item.value / marketData.india_total_imports.volume_mt) * 100).toFixed(0)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Soybean Suppliers */}
      <motion.div variants={fadeInUp} className="rounded-2xl bg-white/60 backdrop-blur border border-white/40 shadow-2xl p-8">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Soybean Oil Suppliers to India (5.47 MT)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={fadeInUp}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={soybeanSuppliers}>
                <defs>
                  <linearGradient id="soybeanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="url(#soybeanGradient)" radius={[8, 8, 0, 0]}>
                  {soybeanSuppliers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                <strong>Market Opportunity:</strong> Argentina dominates with 53% but growing demand (+36% YoY) creates entry points for reliable suppliers like Tanzania.
              </p>
            </div>
            {soybeanSuppliers.map((supplier, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 8 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: supplier.color }}></div>
                  <span className="font-semibold text-slate-900">{supplier.name}</span>
                </div>
                <div className="font-black text-slate-900">{supplier.value}%</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Sunflower Suppliers */}
      <motion.div variants={fadeInUp} className="rounded-2xl bg-white/60 backdrop-blur border border-white/40 shadow-2xl p-8">
        <h3 className="text-2xl font-black text-slate-900 mb-8">Sunflower Oil Suppliers to India (3.25 MT)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div variants={fadeInUp}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sunflowerSuppliers}>
                <defs>
                  <linearGradient id="sunflowerGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="value" fill="url(#sunflowerGradient)" radius={[8, 8, 0, 0]}>
                  {sunflowerSuppliers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-4">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                <strong>Geopolitical Vulnerability:</strong> Russia dominates (55-60%) post-Ukraine war. Non-Black Sea suppliers like Tanzania have significant opportunity.
              </p>
            </div>
            {sunflowerSuppliers.map((supplier, idx) => (
              <motion.div
                key={idx}
                whileHover={{ x: 8 }}
                className="flex items-center justify-between p-4 bg-gradient-to-r hover:from-orange-50 hover:to-red-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: supplier.color }}></div>
                  <span className="font-semibold text-slate-900">{supplier.name}</span>
                </div>
                <div className="font-black text-slate-900">{supplier.value}%</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
