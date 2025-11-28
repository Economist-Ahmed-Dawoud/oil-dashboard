'use client';

import { useState } from 'react';
import MarketDemandChart from '@/components/charts/MarketDemandChart';
import StrategyComparison from '@/components/charts/StrategyComparison';
import RiskHeatmap from '@/components/charts/RiskHeatmap';
import dynamic from 'next/dynamic';

const SupplyChainMap = dynamic(() => import('@/components/maps/SupplyChainMap'), { ssr: false });

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Executive Summary', icon: '📊' },
    { id: 'market', label: 'Market Analysis', icon: '📈' },
    { id: 'strategies', label: 'Strategies', icon: '🎯' },
    { id: 'supply', label: 'Supply Chain', icon: '🗺️' },
    { id: 'risks', label: 'Risk Assessment', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Oilseed Investment Analysis
            </h1>
            <p className="text-gray-700 text-lg">
              Strategic comparison: Tanzania vs Kazakhstan for India edible oil export
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Executive Summary */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl shadow-xl p-8 border-2 border-emerald-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Opportunity Summary</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-emerald-500">
                  <div className="text-sm text-gray-600 font-semibold mb-2">RECOMMENDED STRATEGY</div>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">Tanzania Focused</div>
                  <p className="text-sm text-gray-700">
                    Direct port access + 0% tariff + regional sourcing = superior returns
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                  <div className="text-sm text-gray-600 font-semibold mb-2">MARKET OPPORTUNITY</div>
                  <div className="text-2xl font-bold text-blue-600 mb-2">$18.3 Billion</div>
                  <p className="text-sm text-gray-700">
                    India's annual edible oil import value growing 3-3.5% annually
                  </p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500">
                  <div className="text-sm text-gray-600 font-semibold mb-2">EXPECTED RETURNS</div>
                  <div className="text-2xl font-bold text-amber-600 mb-2">22-26% IRR</div>
                  <p className="text-sm text-gray-700">
                    5-year return on $2.35M investment with 2.75-year payback
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">🎯 Three-Legged Competitive Advantage</h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">1.</span>
                      <div>
                        <div className="font-semibold text-gray-900">Tariff Arbitrage</div>
                        <p className="text-sm text-gray-700">0% DFTP vs 35% MFN = $420/ton savings</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">2.</span>
                      <div>
                        <div className="font-semibold text-gray-900">Logistics Efficiency</div>
                        <p className="text-sm text-gray-700">14 days to India vs 25-30 days overland</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">3.</span>
                      <div>
                        <div className="font-semibold text-gray-900">Regional Sourcing</div>
                        <p className="text-sm text-gray-700">Zambia/Uganda/Kenya duty-free inputs</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="font-bold text-gray-900 mb-4">📋 Facility Specifications</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Location</span>
                      <span className="font-bold text-gray-900">Dar es Salaam, Tanzania</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Capacity</span>
                      <span className="font-bold text-gray-900">30 tons/day (68K tons/year)</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Products</span>
                      <span className="font-bold text-gray-900">70% Sunflower, 30% Soybean</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                      <span className="text-gray-700">Investment</span>
                      <span className="font-bold text-emerald-600">$2.35M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Target Market</span>
                      <span className="font-bold text-gray-900">India (5.47 MT soybean + 3.25 MT sunflower demand)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">India's Import Demand: The Opportunity</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-1">Total Edible Oil Imports</div>
                    <div className="text-4xl font-bold text-blue-600">16 MT/year</div>
                    <div className="text-sm text-gray-600 mt-1">55-60% import dependency</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-1">Market Value</div>
                    <div className="text-4xl font-bold text-emerald-600">$18.3 Billion</div>
                    <div className="text-sm text-gray-600 mt-1">Growing 3-3.5% annually</div>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-1">Soybean Oil Imports</div>
                    <div className="text-4xl font-bold text-yellow-600">5.47 MT/year</div>
                    <div className="text-sm text-gray-600 mt-1">+36% growth YoY (2024-25)</div>
                  </div>
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 font-semibold mb-1">Sunflower Oil Imports</div>
                    <div className="text-4xl font-bold text-orange-600">3.25 MT/year</div>
                    <div className="text-sm text-gray-600 mt-1">97% import dependency (supply constrained)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Market Analysis */}
        {activeSection === 'market' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">India's Edible Oil Market</h2>
            <MarketDemandChart />
          </div>
        )}

        {/* Strategies */}
        {activeSection === 'strategies' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Investment Strategies</h2>
            <StrategyComparison />
          </div>
        )}

        {/* Supply Chain */}
        {activeSection === 'supply' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Supply Chain & Sourcing</h2>
            <SupplyChainMap />
          </div>
        )}

        {/* Risk Assessment */}
        {activeSection === 'risks' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">Risk Assessment</h2>
            <RiskHeatmap />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">About This Analysis</h3>
              <p className="text-sm text-gray-400">
                Comprehensive investment strategy for oilseed processing and export to India. Based on market data, tariff analysis, and supply chain logistics.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Key Markets</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>🇮🇳 India (Primary Market)</li>
                <li>🇹🇿 Tanzania (Recommended Location)</li>
                <li>🇰🇿 Kazakhstan (Alternative)</li>
                <li>🇿🇲 Zambia (Key Supplier)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Investment Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>💰 Investment: $2.35M</li>
                <li>📈 IRR: 22-26%</li>
                <li>⏱️ Payback: 2.75 years</li>
                <li>⚙️ Capacity: 68K tons/year</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>
              © 2025 Investment Decision Analysis. For detailed information, see the comprehensive investment document.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
