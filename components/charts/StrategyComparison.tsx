'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
        <div className="text-gray-500">Loading strategy data...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-red-500">Failed to load strategy data</div>;
  }

  const tanzania = data.strategies[0];
  const kazakhstan = data.strategies[1];

  const MetricCard = ({ label, value, unit = '', highlight = false, winner = false }: any) => (
    <div className={`p-3 rounded-lg ${winner ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-50 border border-gray-200'}`}>
      <div className="text-xs text-gray-600 font-medium">{label}</div>
      <div className={`text-lg font-bold mt-1 ${highlight ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
        {unit && <span className="text-sm ml-1">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {/* Strategy Selector */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => setSelectedStrategy('compare')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedStrategy === 'compare'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Compare Both
        </button>
        <button
          onClick={() => setSelectedStrategy('tanzania')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedStrategy === 'tanzania'
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Tanzania Only
        </button>
        <button
          onClick={() => setSelectedStrategy('kazakhstan')}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedStrategy === 'kazakhstan'
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Kazakhstan Only
        </button>
      </div>

      {/* Comparison View */}
      {(selectedStrategy === 'compare' || selectedStrategy === 'tanzania') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-xl p-8 border-2 border-green-200"
        >
          {/* Badge */}
          <div className="inline-block mb-4">
            <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ✓ RECOMMENDED
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">{tanzania.name}</h2>
          <p className="text-gray-700 mb-6">📍 {tanzania.location}</p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard
              label="Investment Required"
              value={`$${tanzania.investment.total_million}M`}
              highlight={true}
              winner={true}
            />
            <MetricCard
              label="Payback Period"
              value={tanzania.financial.payback_years}
              unit="years"
              highlight={true}
              winner={true}
            />
            <MetricCard
              label="5-Year IRR"
              value={`${tanzania.financial.irr_5yr_percent}%`}
              highlight={true}
              winner={true}
            />
            <MetricCard
              label="EBITDA Margin"
              value={`${tanzania.financial.ebitda_margin}%`}
              highlight={true}
              winner={true}
            />
          </div>

          {/* Operational Specs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <MetricCard label="Capacity (Daily)" value={tanzania.capacity.tons_day} unit="tons" />
            <MetricCard
              label="Annual Output"
              value={(tanzania.capacity.annual_output_tons / 1000).toFixed(0)}
              unit="K tons"
            />
            <MetricCard label="Transit Time" value={tanzania.tariff_and_logistics.logistics_days} unit="days" />
            <MetricCard label="Tariff Access" value={tanzania.tariff_and_logistics.tariff_access} />
            <MetricCard label="Products" value="70% Sunflower" />
            <MetricCard label="" value="30% Soybean" />
          </div>

          {/* Tariff & Logistics Advantage */}
          <div className="bg-white rounded-xl p-6 mb-8 border-2 border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Competitive Advantages</h3>
            <ul className="space-y-3">
              {tanzania.competitive_advantages.map((advantage, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl mt-1">✓</span>
                  <span className="text-gray-700">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}

      {/* Kazakhstan Card */}
      {(selectedStrategy === 'compare' || selectedStrategy === 'kazakhstan') && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-8 border-2 border-blue-200"
        >
          {/* Badge */}
          <div className="inline-block mb-4">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
              ℹ ALTERNATIVE
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">{kazakhstan.name}</h2>
          <p className="text-gray-700 mb-6">📍 {kazakhstan.location}</p>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <MetricCard label="Investment Required" value={`$${kazakhstan.investment.total_million}M`} />
            <MetricCard label="Payback Period" value={kazakhstan.financial.payback_years} unit="years" />
            <MetricCard label="5-Year IRR" value={`${kazakhstan.financial.irr_5yr_percent}%`} />
            <MetricCard label="EBITDA Margin" value={`${kazakhstan.financial.ebitda_margin}%`} />
          </div>

          {/* Operational Specs */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            <MetricCard label="Capacity (Daily)" value={kazakhstan.capacity.tons_day} unit="tons" />
            <MetricCard
              label="Annual Output"
              value={(kazakhstan.capacity.annual_output_tons / 1000).toFixed(0)}
              unit="K tons"
            />
            <MetricCard label="Transit Time" value={kazakhstan.tariff_and_logistics.logistics_days} unit="days" />
            <MetricCard label="Tariff Access" value={kazakhstan.tariff_and_logistics.tariff_access} />
            <MetricCard label="Products" value="80% Sunflower" />
            <MetricCard label="" value="20% Soybean" />
          </div>

          {/* Advantages */}
          <div className="bg-white rounded-xl p-6 mb-8 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💪 Key Strengths</h3>
            <ul className="space-y-3">
              {kazakhstan.competitive_advantages.map((advantage, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-blue-500 font-bold text-xl mt-1">✓</span>
                  <span className="text-gray-700">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenge */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Main Challenge:</strong> 35% MFN tariff creates $420/ton export disadvantage vs Tanzania's 0% DFTP.
              Compensated by supply security, but lower financial returns (16.5% vs 24% IRR).
            </p>
          </div>
        </motion.div>
      )}

      {/* Detailed Comparison Table */}
      {selectedStrategy === 'compare' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <h3 className="text-lg font-bold text-gray-900">Head-to-Head Comparison</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 font-bold text-gray-700">Factor</th>
                  <th className="text-center p-4 font-bold text-emerald-600">Tanzania</th>
                  <th className="text-center p-4 font-bold text-blue-600">Kazakhstan</th>
                  <th className="text-center p-4 font-bold text-orange-600">Winner</th>
                </tr>
              </thead>
              <tbody>
                {data.comparison_key_factors.map((factor, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="p-4 font-medium text-gray-700">{factor.factor}</td>
                    <td className="text-center p-4 text-emerald-600 font-semibold">{factor.tanzania}</td>
                    <td className="text-center p-4 text-blue-600 font-semibold">{factor.kazakhstan}</td>
                    <td className="text-center p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          factor.winner === 'Tanzania'
                            ? 'bg-emerald-100 text-emerald-700'
                            : factor.winner === 'Kazakhstan'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {factor.winner}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
