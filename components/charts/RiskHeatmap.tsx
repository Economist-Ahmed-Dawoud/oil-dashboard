'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRiskColor } from '@/lib/utils';

interface Risk {
  id: string;
  name: string;
  description: string;
  probability: string;
  tanzania_risk_level: number;
  kazakhstan_risk_level: number;
  tanzania_impact: string;
  kazakhstan_impact: string;
  mitigation: string;
}

interface RiskData {
  risks: Risk[];
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

export default function RiskHeatmap() {
  const [data, setData] = useState<RiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/riskData.json')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load risk data:', err);
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
    return <div className="text-red-500">Failed to load risk data</div>;
  }

  const getRiskLabel = (level: number) => {
    if (level <= 1) return 'Low';
    if (level === 2) return 'Moderate';
    if (level === 3) return 'Moderate-High';
    return 'High';
  };

  const getRiskBg = (level: number) => {
    if (level <= 1) return '#dbeafe';
    if (level === 2) return '#fef3c7';
    if (level === 3) return '#fed7aa';
    return '#fecaca';
  };

  const getRiskText = (level: number) => {
    if (level <= 1) return 'text-blue-700';
    if (level === 2) return 'text-amber-700';
    if (level === 3) return 'text-orange-700';
    return 'text-red-700';
  };

  return (
    <div className="w-full space-y-8">
      {/* Risk Legend */}
      <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/60">
        <h3 className="text-2xl font-black bg-gradient-to-r from-red-700 to-orange-600 bg-clip-text text-transparent mb-6">Risk Scale</h3>
        <motion.div className="grid grid-cols-2 md:grid-cols-5 gap-4" variants={staggerContainer} initial="initial" animate="animate">
          {[
            { level: 1, label: 'Low Risk', color: 'from-blue-100 to-blue-200', text: 'text-blue-700' },
            { level: 2, label: 'Moderate', color: 'from-yellow-100 to-yellow-200', text: 'text-yellow-700' },
            { level: 3, label: 'Mod-High', color: 'from-orange-100 to-orange-200', text: 'text-orange-700' },
            { level: 4, label: 'High', color: 'from-red-100 to-red-200', text: 'text-red-700' },
            { level: 5, label: 'Critical', color: 'from-red-200 to-red-300', text: 'text-red-800' },
          ].map((item) => (
            <motion.div key={item.level} variants={fadeInUp} whileHover={{ scale: 1.05 }} className={`text-center p-4 bg-gradient-to-br ${item.color} rounded-xl shadow-md border border-white/40`}>
              <div className={`text-3xl font-black ${item.text} mb-2`}>{item.level}</div>
              <div className="text-xs text-gray-700 font-semibold">{item.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Risk Matrix Heatmap */}
      <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/60 overflow-x-auto">
        <h3 className="text-2xl font-black bg-gradient-to-r from-orange-700 to-red-600 bg-clip-text text-transparent mb-6">Risk Assessment Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/40 border-b border-white/60">
                <th className="p-4 text-left font-bold text-slate-700 text-sm">Risk Factor</th>
                <th className="p-4 text-center font-bold text-emerald-600 text-sm">
                  Tanzania Risk
                </th>
                <th className="p-4 text-center font-bold text-blue-600 text-sm">
                  Kazakhstan Risk
                </th>
                <th className="p-4 text-center font-bold text-slate-700 text-sm">Difference</th>
              </tr>
            </thead>
            <tbody>
              {data.risks.map((risk, idx) => (
                <motion.tr
                  key={risk.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-white/40 hover:bg-white/20 cursor-pointer transition-all ${idx % 2 === 0 ? 'bg-white/20' : 'bg-white/10'}`}
                  onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
                >
                  <td className="p-4 font-medium text-slate-700">
                    <div className="flex items-start gap-2">
                      <span className="text-lg mt-1">
                        {expandedRisk === risk.id ? '▼' : '▶'}
                      </span>
                      <div>
                        <div className="font-semibold">{risk.name}</div>
                        <div className="text-xs text-gray-600 mt-1 font-medium">{risk.probability} probability</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-block px-4 py-2 rounded-lg font-bold w-16 backdrop-blur ${getRiskText(risk.tanzania_risk_level)}`}
                      style={{ backgroundColor: getRiskBg(risk.tanzania_risk_level) }}
                    >
                      {risk.tanzania_risk_level}
                    </motion.div>
                  </td>
                  <td className="p-4 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-block px-4 py-2 rounded-lg font-bold w-16 backdrop-blur ${getRiskText(risk.kazakhstan_risk_level)}`}
                      style={{ backgroundColor: getRiskBg(risk.kazakhstan_risk_level) }}
                    >
                      {risk.kazakhstan_risk_level}
                    </motion.div>
                  </td>
                  <td className="p-4 text-center font-bold text-slate-700">
                    {risk.kazakhstan_risk_level > risk.tanzania_risk_level ? (
                      <span className="text-emerald-600 font-bold">Tanzania ↓</span>
                    ) : risk.tanzania_risk_level > risk.kazakhstan_risk_level ? (
                      <span className="text-blue-600 font-bold">Kaz ↓</span>
                    ) : (
                      <span className="text-gray-500">Equal</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Expanded Risk Details */}
      <AnimatePresence>
        {expandedRisk && (
          <motion.div
            key={expandedRisk}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-gradient-to-r from-amber-50/80 via-orange-50/80 to-red-50/80 rounded-2xl shadow-2xl p-8 border border-amber-200/60 backdrop-blur-sm overflow-hidden"
          >
          {data.risks.map((risk) => {
            if (risk.id !== expandedRisk) return null;

            return (
              <motion.div key={risk.id} className="space-y-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <h4 className="text-3xl font-black bg-gradient-to-r from-orange-700 to-red-600 bg-clip-text text-transparent mb-3">{risk.name}</h4>
                  <p className="text-gray-700 text-lg">{risk.description}</p>
                </motion.div>

                <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="initial" animate="animate">
                  {/* Tanzania Impact */}
                  <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-xl p-6 border-l-4 border-emerald-500 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-emerald-600 font-black text-2xl">{risk.tanzania_risk_level}</span>
                      <span className="text-sm text-emerald-700 font-bold uppercase tracking-wide">Tanzania</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong className="text-emerald-700">Impact:</strong> {risk.tanzania_impact}
                    </p>
                  </motion.div>

                  {/* Kazakhstan Impact */}
                  <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-xl p-6 border-l-4 border-blue-500 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-blue-600 font-black text-2xl">{risk.kazakhstan_risk_level}</span>
                      <span className="text-sm text-blue-700 font-bold uppercase tracking-wide">Kazakhstan</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong className="text-blue-700">Impact:</strong> {risk.kazakhstan_impact}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Mitigation Strategy */}
                <motion.div variants={fadeInUp} className="bg-white/60 backdrop-blur rounded-xl p-6 border-l-4 border-green-500 shadow-md">
                  <h5 className="font-bold text-gray-900 mb-3 text-lg">🛡️ Mitigation Strategy</h5>
                  <p className="text-sm text-gray-700 leading-relaxed">{risk.mitigation}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
        )}
      </AnimatePresence>

      {/* Risk Summary */}
      <motion.div className="grid md:grid-cols-2 gap-6" variants={staggerContainer} initial="initial" animate="animate">
        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-emerald-50/80 via-green-50/80 to-teal-50/80 rounded-2xl p-8 border border-emerald-200/60 backdrop-blur-sm shadow-xl overflow-hidden">
          <h4 className="text-xl font-black bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">Tanzania: Moderate Overall Risk ✓</h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold text-lg">✓</span>
              <span>Lower tariff risk (0% DFTP)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold text-lg">✓</span>
              <span>Geographic/supply volatility manageable with buffer stock</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-500 font-bold text-lg">✓</span>
              <span>Export restrictions addressable through government engagement</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold text-lg">⚠</span>
              <span>Quality control requires farmer partnerships</span>
            </li>
          </ul>
          <p className="text-xs text-gray-700 mt-6 italic font-medium bg-white/40 backdrop-blur p-3 rounded-lg">
            All risks have clear mitigation strategies. Investment remains attractive.
          </p>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-50/80 via-cyan-50/80 to-sky-50/80 rounded-2xl p-8 border border-blue-200/60 backdrop-blur-sm shadow-xl overflow-hidden">
          <h4 className="text-xl font-black bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent mb-4">Kazakhstan: Higher Tariff Risk ⚠</h4>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold text-lg">✓</span>
              <span>Very low supply/weather risk</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 font-bold text-lg">✓</span>
              <span>Industrial-scale infrastructure proven</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold text-lg">⚠</span>
              <span>35% tariff creates export disadvantage</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 font-bold text-lg">⚠</span>
              <span>Limited tariff reduction flexibility</span>
            </li>
          </ul>
          <p className="text-xs text-gray-700 mt-6 italic font-medium bg-white/40 backdrop-blur p-3 rounded-lg">
            Good for supply security, but lower margins and less attractive returns.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
