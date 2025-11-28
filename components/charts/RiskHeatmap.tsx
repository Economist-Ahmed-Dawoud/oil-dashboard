'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
        <div className="text-gray-500">Loading risk data...</div>
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
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Risk Scale</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">1</div>
            <div className="text-xs text-gray-600 mt-1">Low Risk</div>
          </div>
          <div className="text-center p-4 bg-yellow-100 rounded-lg">
            <div className="text-2xl font-bold text-yellow-700">2</div>
            <div className="text-xs text-gray-600 mt-1">Moderate</div>
          </div>
          <div className="text-center p-4 bg-orange-100 rounded-lg">
            <div className="text-2xl font-bold text-orange-700">3</div>
            <div className="text-xs text-gray-600 mt-1">Mod-High</div>
          </div>
          <div className="text-center p-4 bg-red-100 rounded-lg">
            <div className="text-2xl font-bold text-red-700">4</div>
            <div className="text-xs text-gray-600 mt-1">High</div>
          </div>
          <div className="text-center p-4 bg-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-800">5</div>
            <div className="text-xs text-gray-600 mt-1">Critical</div>
          </div>
        </div>
      </div>

      {/* Risk Matrix Heatmap */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 overflow-x-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Risk Assessment Matrix</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left font-bold text-gray-700 border border-gray-300 text-sm">Risk Factor</th>
              <th className="p-4 text-center font-bold text-emerald-600 border border-gray-300 text-sm">
                Tanzania Risk
              </th>
              <th className="p-4 text-center font-bold text-blue-600 border border-gray-300 text-sm">
                Kazakhstan Risk
              </th>
              <th className="p-4 text-center font-bold text-gray-700 border border-gray-300 text-sm">Difference</th>
            </tr>
          </thead>
          <tbody>
            {data.risks.map((risk, idx) => (
              <motion.tr
                key={risk.id}
                className={`border-b border-gray-300 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 cursor-pointer transition-colors`}
                onClick={() => setExpandedRisk(expandedRisk === risk.id ? null : risk.id)}
              >
                <td className="p-4 font-medium text-gray-700 border border-gray-300">
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-1">
                      {expandedRisk === risk.id ? '▼' : '▶'}
                    </span>
                    <div>
                      <div className="font-semibold">{risk.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{risk.probability} probability</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center border border-gray-300">
                  <motion.div
                    className={`inline-block px-4 py-2 rounded-lg font-bold w-16 ${getRiskText(risk.tanzania_risk_level)}`}
                    style={{ backgroundColor: getRiskBg(risk.tanzania_risk_level) }}
                  >
                    {risk.tanzania_risk_level}
                  </motion.div>
                </td>
                <td className="p-4 text-center border border-gray-300">
                  <motion.div
                    className={`inline-block px-4 py-2 rounded-lg font-bold w-16 ${getRiskText(risk.kazakhstan_risk_level)}`}
                    style={{ backgroundColor: getRiskBg(risk.kazakhstan_risk_level) }}
                  >
                    {risk.kazakhstan_risk_level}
                  </motion.div>
                </td>
                <td className="p-4 text-center border border-gray-300 font-bold">
                  {risk.kazakhstan_risk_level > risk.tanzania_risk_level ? (
                    <span className="text-emerald-600">Tanzania ↓</span>
                  ) : risk.tanzania_risk_level > risk.kazakhstan_risk_level ? (
                    <span className="text-blue-600">Kaz ↓</span>
                  ) : (
                    <span className="text-gray-500">Equal</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded Risk Details */}
      {expandedRisk && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border-l-4 border-amber-500"
        >
          {data.risks.map((risk) => {
            if (risk.id !== expandedRisk) return null;

            return (
              <div key={risk.id} className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{risk.name}</h4>
                  <p className="text-gray-700">{risk.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Tanzania Impact */}
                  <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-emerald-600 font-bold text-lg">{risk.tanzania_risk_level}</span>
                      <span className="text-sm text-emerald-600 font-semibold">Tanzania</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Impact:</strong> {risk.tanzania_impact}
                    </p>
                  </div>

                  {/* Kazakhstan Impact */}
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 font-bold text-lg">{risk.kazakhstan_risk_level}</span>
                      <span className="text-sm text-blue-600 font-semibold">Kazakhstan</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Impact:</strong> {risk.kazakhstan_impact}
                    </p>
                  </div>
                </div>

                {/* Mitigation Strategy */}
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <h5 className="font-bold text-gray-900 mb-2">🛡️ Mitigation Strategy</h5>
                  <p className="text-sm text-gray-700">{risk.mitigation}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Risk Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200 shadow-lg">
          <h4 className="text-lg font-bold text-emerald-900 mb-4">Tanzania: Moderate Overall Risk ✓</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Lower tariff risk (0% DFTP)</li>
            <li>✓ Geographic/supply volatility manageable with buffer stock</li>
            <li>✓ Export restrictions addressable through government engagement</li>
            <li>⚠ Quality control requires farmer partnerships</li>
          </ul>
          <p className="text-xs text-gray-600 mt-4 italic">
            All risks have clear mitigation strategies. Investment remains attractive.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg">
          <h4 className="text-lg font-bold text-blue-900 mb-4">Kazakhstan: Higher Tariff Risk ⚠</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ Very low supply/weather risk</li>
            <li>✓ Industrial-scale infrastructure proven</li>
            <li>⚠ 35% tariff creates export disadvantage</li>
            <li>⚠ Limited tariff reduction flexibility</li>
          </ul>
          <p className="text-xs text-gray-600 mt-4 italic">
            Good for supply security, but lower margins and less attractive returns.
          </p>
        </div>
      </div>
    </div>
  );
}
