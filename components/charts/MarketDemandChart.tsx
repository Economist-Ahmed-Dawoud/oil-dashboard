'use client';

import { useEffect, useState } from 'react';
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
        <div className="text-gray-500">Loading market data...</div>
      </div>
    );
  }

  if (!marketData) {
    return <div className="text-red-500">Failed to load market data</div>;
  }

  // Prepare data for pie chart (total breakdown)
  const pieData = marketData.oil_breakdown.map((oil) => ({
    name: oil.oil_type,
    value: parseFloat(oil.imports_mt.toString()),
    color: oil.oil_type === 'Soybean' ? '#3b82f6' : oil.oil_type === 'Sunflower' ? '#fbbf24' : '#d1d5db',
  }));

  // Soybean supplier data
  const soybeanOil = marketData.oil_breakdown.find((o) => o.oil_type === 'Soybean');
  const soybeanSuppliers =
    soybeanOil?.suppliers.map((s) => ({
      name: s.country,
      value: s.share,
      color: s.color,
    })) || [];

  // Sunflower supplier data
  const sunflowerOil = marketData.oil_breakdown.find((o) => o.oil_type === 'Sunflower');
  const sunflowerSuppliers =
    sunflowerOil?.suppliers.map((s) => ({
      name: s.country,
      value: s.share,
      color: s.color,
    })) || [];

  return (
    <div className="w-full space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Total Imports</div>
          <div className="text-2xl font-bold text-blue-600">{marketData.india_total_imports.volume_mt} MT</div>
          <div className="text-xs text-gray-500 mt-1">Per Annum</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Market Value</div>
          <div className="text-2xl font-bold text-emerald-600">${marketData.india_total_imports.value_billion_usd}B</div>
          <div className="text-xs text-gray-500 mt-1">Annual</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Soybean Imports</div>
          <div className="text-2xl font-bold text-yellow-600">5.47 MT</div>
          <div className="text-xs text-gray-500 mt-1">+36% Growth YoY</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-1">Sunflower Imports</div>
          <div className="text-2xl font-bold text-orange-600">3.25 MT</div>
          <div className="text-xs text-gray-500 mt-1">Supply Constrained</div>
        </div>
      </div>

      {/* India's Oil Imports Breakdown */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">India's Edible Oil Imports by Type (16 MT Total)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
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
                <Tooltip formatter={(value: number) => [`${value.toFixed(2)} MT`, 'Volume']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="space-y-3">
              {pieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{item.value.toFixed(2)} MT</div>
                    <div className="text-xs text-gray-500">
                      {((item.value / marketData.india_total_imports.volume_mt) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Soybean Supplier Concentration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Soybean Oil Suppliers to India (5.47 MT)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={soybeanSuppliers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
                <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {soybeanSuppliers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Market Opportunity:</strong> Argentina dominates with 53% but is not locked in. Growing demand (+36% YoY) creates entry points for new suppliers like Tanzania with cost/logistics advantages.
              </p>
            </div>
            <div className="space-y-3">
              {soybeanSuppliers.map((supplier, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: supplier.color }}></div>
                    <span className="font-medium text-gray-700">{supplier.name}</span>
                  </div>
                  <div className="font-bold text-gray-900">{supplier.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sunflower Supplier Concentration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Sunflower Oil Suppliers to India (3.25 MT)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sunflowerSuppliers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Market Share (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value: number) => [`${value}%`, 'Share']} />
                <Bar dataKey="value" fill="#fbbf24" radius={[8, 8, 0, 0]}>
                  {sunflowerSuppliers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-gray-700">
                <strong>Geopolitical Vulnerability:</strong> Russia dominates (55-60%) due to Black Sea access post-Ukraine war. Ukraine's recovery is constrained. Non-Black Sea suppliers (Argentina, Tanzania) have significant opportunity.
              </p>
            </div>
            <div className="space-y-3">
              {sunflowerSuppliers.map((supplier, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: supplier.color }}></div>
                    <span className="font-medium text-gray-700">{supplier.name}</span>
                  </div>
                  <div className="font-bold text-gray-900">{supplier.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
