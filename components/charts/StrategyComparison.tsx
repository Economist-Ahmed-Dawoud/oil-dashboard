'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Strategy {
  id: string;
  name: string;
  badge: string;
  badge_color: string;
  location: string;
  color: string;
  financial: {
    payback_years: number;
    irr_5yr_percent: number;
    ebitda_margin: number;
  };
  capacity: {
    tons_day: number;
    annual_output_tons: number;
  };
  investment: {
    total_million: number;
  };
  tariff_and_logistics: {
    tariff_access: string;
    tariff_advantage?: string;
    tariff_disadvantage?: string;
    logistics_days: number;
  };
  competitive_advantages: string[];
}

interface StrategiesData {
  strategies: Strategy[];
  comparison_key_factors: Array<{
    factor: string;
    tanzania: string;
    kazakhstan: string;
    winner: string;
  }>;
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

export default function StrategyComparison() {
  const [data, setData] = useState<StrategiesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('compare');

  useEffect(() => {
    fetch('/data/strategiesData.json')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load strategies data:', err);
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

  if (!data) {
    return <div className="text-red-500">Failed to load strategy data</div>;
  }

  const tanzania = data.strategies[0];
  const kazakhstan = data.strategies[1];

  const MetricCard = ({ label, value, unit = '', highlight = false, winner = false }: any) => (
    <motion.div
      whileHover={{ y: -2 }}
      className={`p-4 rounded-xl backdrop-blur transition-all border ${
        winner
          ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 shadow-md'
          : 'bg-white/40 border-white/60 shadow-sm'
      }`}
    >
      <div className="text-xs text-gray-600 font-semibold uppercase tracking-wide">{label}</div>
      <div className={`text-lg font-black mt-2 ${highlight ? 'bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent' : 'text-slate-900'}`}>
        {value}
        {unit && <span className="text-sm ml-1 text-gray-600">{unit}</span>}
      </div>
    </motion.div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Strategy Selector */}
      <motion.div className="flex gap-4 flex-wrap" variants={staggerContainer} initial="initial" animate="animate">
        {[
          { key: 'compare', label: 'Compare Both', color: 'from-emerald-500 to-teal-600' },
          { key: 'tanzania', label: 'Tanzania Only', color: 'from-green-500 to-emerald-600' },
          { key: 'kazakhstan', label: 'Kazakhstan Only', color: 'from-blue-500 to-cyan-600' },
        ].map((btn) => (
          <motion.button
            key={btn.key}
            variants={fadeInUp}
            onClick={() => setSelectedStrategy(btn.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className={`px-8 py-3 rounded-xl font-semibold transition-all border ${
              selectedStrategy === btn.key
                ? `bg-gradient-to-r ${btn.color} text-white shadow-lg border-transparent`
                : 'bg-white/40 backdrop-blur text-slate-700 border-white/60 hover:border-white/80'
            }`}
          >
            {btn.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Comparison View */}
      <AnimatePresence>
        {(selectedStrategy === 'compare' || selectedStrategy === 'tanzania') && (
          <motion.div
            key="tanzania"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl shadow-2xl p-8 border border-emerald-200/60 backdrop-blur-sm overflow-hidden"
          >
            {/* Decorative gradient background */}
            <motion.div className="absolute inset-0 bg-gradient-to-br from-emerald-100/20 to-transparent" />
            <div className="relative z-10">
              {/* Badge */}
              <motion.div className="inline-block mb-4" whileHover={{ scale: 1.05 }}>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ✓ RECOMMENDED
                </span>
              </motion.div>

              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2">{tanzania.name}</h2>
              <p className="text-gray-700 mb-8 text-lg">📍 {tanzania.location}</p>

              {/* Key Metrics Grid */}
              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" variants={staggerContainer} initial="initial" animate="animate">
                <motion.div variants={fadeInUp}>
                  <MetricCard
                    label="Investment Required"
                    value={`$${tanzania.investment.total_million}M`}
                    highlight={true}
                    winner={true}
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard
                    label="Payback Period"
                    value={tanzania.financial.payback_years}
                    unit="years"
                    highlight={true}
                    winner={true}
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard
                    label="5-Year IRR"
                    value={`${tanzania.financial.irr_5yr_percent}%`}
                    highlight={true}
                    winner={true}
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard
                    label="EBITDA Margin"
                    value={`${tanzania.financial.ebitda_margin}%`}
                    highlight={true}
                    winner={true}
                  />
                </motion.div>
              </motion.div>

              {/* Operational Specs */}
              <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" variants={staggerContainer} initial="initial" animate="animate">
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Capacity (Daily)" value={tanzania.capacity.tons_day} unit="tons" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard
                    label="Annual Output"
                    value={(tanzania.capacity.annual_output_tons / 1000).toFixed(0)}
                    unit="K tons"
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Transit Time" value={tanzania.tariff_and_logistics.logistics_days} unit="days" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Tariff Access" value={tanzania.tariff_and_logistics.tariff_access} />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Products" value="70% Sunflower" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="" value="30% Soybean" />
                </motion.div>
              </motion.div>

              {/* Tariff & Logistics Advantage */}
              <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-xl p-6 mb-8 border border-emerald-200/60 shadow-md">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">🎯 Competitive Advantages</h3>
                <ul className="space-y-3">
                  {tanzania.competitive_advantages.map((advantage, idx) => (
                    <motion.li key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-start gap-3">
                      <span className="text-emerald-500 font-bold text-xl mt-1">✓</span>
                      <span className="text-gray-700">{advantage}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kazakhstan Card */}
      <AnimatePresence>
        {(selectedStrategy === 'compare' || selectedStrategy === 'kazakhstan') && (
          <motion.div
            key="kazakhstan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 rounded-2xl shadow-2xl p-8 border border-blue-200/60 backdrop-blur-sm overflow-hidden"
          >
            {/* Decorative gradient background */}
            <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-transparent" />
            <div className="relative z-10">
              {/* Badge */}
              <motion.div className="inline-block mb-4" whileHover={{ scale: 1.05 }}>
                <span className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  ℹ ALTERNATIVE
                </span>
              </motion.div>

              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-2">{kazakhstan.name}</h2>
              <p className="text-gray-700 mb-8 text-lg">📍 {kazakhstan.location}</p>

              {/* Key Metrics Grid */}
              <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" variants={staggerContainer} initial="initial" animate="animate">
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Investment Required" value={`$${kazakhstan.investment.total_million}M`} />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Payback Period" value={kazakhstan.financial.payback_years} unit="years" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="5-Year IRR" value={`${kazakhstan.financial.irr_5yr_percent}%`} />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="EBITDA Margin" value={`${kazakhstan.financial.ebitda_margin}%`} />
                </motion.div>
              </motion.div>

              {/* Operational Specs */}
              <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" variants={staggerContainer} initial="initial" animate="animate">
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Capacity (Daily)" value={kazakhstan.capacity.tons_day} unit="tons" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard
                    label="Annual Output"
                    value={(kazakhstan.capacity.annual_output_tons / 1000).toFixed(0)}
                    unit="K tons"
                  />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Transit Time" value={kazakhstan.tariff_and_logistics.logistics_days} unit="days" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Tariff Access" value={kazakhstan.tariff_and_logistics.tariff_access} />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="Products" value="80% Sunflower" />
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <MetricCard label="" value="20% Soybean" />
                </motion.div>
              </motion.div>

              {/* Advantages */}
              <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-xl p-6 mb-8 border border-blue-200/60 shadow-md">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-4">💪 Key Strengths</h3>
                <ul className="space-y-3">
                  {kazakhstan.competitive_advantages.map((advantage, idx) => (
                    <motion.li key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="flex items-start gap-3">
                      <span className="text-blue-500 font-bold text-xl mt-1">✓</span>
                      <span className="text-gray-700">{advantage}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Challenge */}
              <motion.div variants={fadeInUp} className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">
                  <strong>Main Challenge:</strong> 35% MFN tariff creates $420/ton export disadvantage vs Tanzania's 0% DFTP.
                  Compensated by supply security, but lower financial returns (16.5% vs 24% IRR).
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detailed Comparison Table */}
      <AnimatePresence>
        {selectedStrategy === 'compare' && (
          <motion.div
            key="comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/60 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-white/60"
          >
            <div className="p-6 border-b border-white/60 bg-gradient-to-r from-slate-50/80 to-blue-50/80">
              <h3 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-blue-700 bg-clip-text text-transparent">Head-to-Head Comparison</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/40 border-b border-white/60">
                    <th className="text-left p-4 font-bold text-slate-700">Factor</th>
                    <th className="text-center p-4 font-bold text-emerald-600">Tanzania</th>
                    <th className="text-center p-4 font-bold text-blue-600">Kazakhstan</th>
                    <th className="text-center p-4 font-bold text-orange-600">Winner</th>
                  </tr>
                </thead>
                <tbody>
                  {data.comparison_key_factors.map((factor, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-white/40 hover:bg-white/20 transition-colors ${idx % 2 === 0 ? 'bg-white/20' : 'bg-white/10'}`}
                    >
                      <td className="p-4 font-medium text-slate-700">{factor.factor}</td>
                      <td className="text-center p-4 text-emerald-600 font-semibold">{factor.tanzania}</td>
                      <td className="text-center p-4 text-blue-600 font-semibold">{factor.kazakhstan}</td>
                      <td className="text-center p-4">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold backdrop-blur ${
                            factor.winner === 'Tanzania'
                              ? 'bg-emerald-200/60 text-emerald-700'
                              : factor.winner === 'Kazakhstan'
                                ? 'bg-blue-200/60 text-blue-700'
                                : 'bg-gray-200/60 text-gray-700'
                          }`}
                        >
                          {factor.winner}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
