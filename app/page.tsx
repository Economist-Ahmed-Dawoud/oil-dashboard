'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MarketDemandChart from '@/components/charts/MarketDemandChart';
import StrategyComparison from '@/components/charts/StrategyComparison';
import RiskHeatmap from '@/components/charts/RiskHeatmap';
import dynamic from 'next/dynamic';

const SupplyChainMap = dynamic(() => import('@/components/maps/SupplyChainMap'), { ssr: false });

/* Mobile-first animation variants with responsive durations */
const fadeInUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.5,
    ease: 'easeOut'
  },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export default function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sections = [
    { id: 'overview', label: 'Executive Summary', abbreviation: 'Summary', icon: '📊' },
    { id: 'market', label: 'Market Analysis', abbreviation: 'Market', icon: '📈' },
    { id: 'strategies', label: 'Strategies', abbreviation: 'Strategy', icon: '🎯' },
    { id: 'supply', label: 'Supply Chain', abbreviation: 'Supply', icon: '🗺️' },
    { id: 'risks', label: 'Risk Assessment', abbreviation: 'Risks', icon: '⚠️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Premium Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-5 lg:py-6">
          <motion.div className="space-y-4" variants={staggerContainer} initial="initial" animate="animate">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-base sm:text-lg font-bold">📊</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent truncate">
                  Oilseed Investment
                </h1>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Premium Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-lg"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-0 sm:px-4 lg:px-8">
          <div className="flex overflow-x-auto gap-1.5 sm:gap-2 py-2 sm:py-3 px-3 sm:px-0 scrollbar-hide scroll-smooth">
            {sections.map((section, idx) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * idx }}
                onClick={() => setActiveSection(section.id)}
                aria-label={section.label}
                aria-current={activeSection === section.id ? 'page' : undefined}
                className={`relative px-3 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold whitespace-nowrap text-xs sm:text-sm md:text-base min-h-[44px] flex items-center justify-center transition-all duration-200 flex-shrink-0 touch-target ${
                  activeSection === section.id
                    ? 'text-white shadow-2xl'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {activeSection === section.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg sm:rounded-xl -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    aria-hidden="true"
                  />
                )}
                {/* Mobile: abbreviation, Tablet+: full label */}
                <span className="hidden sm:inline" aria-hidden="false">{section.icon} {section.label}</span>
                <span className="sm:hidden flex items-center gap-1" aria-hidden="false">
                  {section.icon} <span className="text-xs font-bold">{section.abbreviation}</span>
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-10">
        {/* Executive Summary */}
        {activeSection === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10"
          >
            {/* Hero Cards */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8"
            >
              {[
                {
                  label: 'RECOMMENDED STRATEGY',
                  value: 'Tanzania Focused',
                  desc: 'Direct port + 0% tariff + regional sourcing',
                  icon: '🏆',
                  color: 'from-emerald-500 to-teal-600',
                  textColor: 'text-emerald-600',
                },
                {
                  label: 'MARKET OPPORTUNITY',
                  value: '$18.3 Billion',
                  desc: 'Annual edible oil imports, growing 3.5% CAGR',
                  icon: '💰',
                  color: 'from-blue-500 to-cyan-600',
                  textColor: 'text-blue-600',
                },
                {
                  label: 'EXPECTED RETURNS',
                  value: '22-26% IRR',
                  desc: '5-year return with 2.75 year payback',
                  icon: '📈',
                  color: 'from-amber-500 to-orange-600',
                  textColor: 'text-amber-600',
                },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-white/60 backdrop-blur p-3 sm:p-4 md:p-6 lg:p-8 border border-white/40 hover:border-white/60 transition-all duration-300 hover:shadow-2xl"
                >
                  {/* Gradient background on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 md:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>

                  {/* Content */}
                  <p className="text-xs font-bold text-slate-600 tracking-widest uppercase mb-1 sm:mb-2">
                    {card.label}
                  </p>
                  <h3 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-black mb-1 sm:mb-2 md:mb-3 ${card.textColor}`}>{card.value}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>

                  {/* Accent line */}
                  <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${card.color} transition-all duration-500`} />
                </motion.div>
              ))}
            </motion.div>

            {/* Main Content Cards */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Competitive Advantage */}
              <motion.div
                variants={fadeInUp}
                className="relative group rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 overflow-hidden p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Animated background */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-200 opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500" />

                <h3 className="text-2xl font-black text-slate-900 mb-6 relative z-10 flex items-center gap-2">
                  🎯 Three-Legged Competitive Advantage
                </h3>

                <ul className="space-y-4 relative z-10">
                  {[
                    { num: '1', title: 'Tariff Arbitrage', desc: '0% DFTP vs 35% MFN = $420/ton savings' },
                    { num: '2', title: 'Logistics Efficiency', desc: '14 days to India vs 25-30 days overland' },
                    { num: '3', title: 'Regional Sourcing', desc: 'Zambia/Uganda/Kenya duty-free inputs' },
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      whileHover={{ x: 8 }}
                      className="flex gap-4 p-3 rounded-xl hover:bg-white/50 transition-colors"
                    >
                      <span className="text-2xl font-black bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                        {item.num}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900">{item.title}</div>
                        <p className="text-sm text-slate-600">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Facility Specs */}
              <motion.div
                variants={fadeInUp}
                className="relative group rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 overflow-hidden p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {/* Animated background */}
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-3xl group-hover:opacity-30 transition-opacity duration-500" />

                <h3 className="text-2xl font-black text-slate-900 mb-6 relative z-10 flex items-center gap-2">
                  📋 Facility Specifications
                </h3>

                <div className="space-y-4 relative z-10">
                  {[
                    { label: 'Location', value: 'Dar es Salaam, Tanzania' },
                    { label: 'Capacity', value: '30 tons/day (68K tons/year)' },
                    { label: 'Products', value: '70% Sunflower, 30% Soybean' },
                    { label: 'Investment', value: '$2.35M' },
                    { label: 'Target Market', value: 'India (8.7 MT annual demand)' },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ x: 8 }}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-white/50 transition-colors border-b border-blue-100/50 last:border-b-0"
                    >
                      <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                      <span className="font-bold text-slate-900 text-right">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Market Overview */}
            <motion.div
              variants={fadeInUp}
              className="relative group rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200 overflow-hidden p-8 shadow-xl"
            >
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-300 to-blue-300 opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500" />

              <h3 className="text-2xl font-black text-slate-900 mb-8 relative z-10">
                📊 India's Import Demand: The Opportunity
              </h3>

              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid md:grid-cols-2 gap-8 relative z-10"
              >
                {[
                  {
                    label: 'Total Edible Oil Imports',
                    value: '16 MT/year',
                    subtext: '55-60% import dependency',
                    icon: '🌾',
                    color: 'from-amber-500 to-orange-500',
                  },
                  {
                    label: 'Market Value',
                    value: '$18.3 Billion',
                    subtext: 'Growing 3-3.5% annually',
                    icon: '💎',
                    color: 'from-emerald-500 to-teal-500',
                  },
                  {
                    label: 'Soybean Oil Imports',
                    value: '5.47 MT/year',
                    subtext: '+36% growth YoY (2024-25)',
                    icon: '🫘',
                    color: 'from-yellow-500 to-amber-500',
                  },
                  {
                    label: 'Sunflower Oil Imports',
                    value: '3.25 MT/year',
                    subtext: '97% import dependency',
                    icon: '🌻',
                    color: 'from-orange-500 to-red-500',
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeInUp}
                    className="p-6 rounded-xl bg-white/40 border border-white/60 hover:bg-white/60 hover:border-white/80 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs font-bold text-slate-600 tracking-widest uppercase mb-2">
                          {stat.label}
                        </p>
                        <h4 className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </h4>
                      </div>
                      <span className="text-4xl">{stat.icon}</span>
                    </div>
                    <p className="text-sm text-slate-600">{stat.subtext}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Market Analysis */}
        {activeSection === 'market' && (
          <motion.div
            key="market"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-8"
            >
              India's Edible Oil Market Analysis
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <MarketDemandChart />
            </motion.div>
          </motion.div>
        )}

        {/* Strategies */}
        {activeSection === 'strategies' && (
          <motion.div
            key="strategies"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4"
            >
              Investment Strategies
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StrategyComparison />
            </motion.div>
          </motion.div>
        )}

        {/* Supply Chain */}
        {activeSection === 'supply' && (
          <motion.div
            key="supply"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-8"
            >
              Supply Chain & Sourcing Strategy
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SupplyChainMap />
            </motion.div>
          </motion.div>
        )}

        {/* Risk Assessment */}
        {activeSection === 'risks' && (
          <motion.div
            key="risks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-8"
            >
              Risk Assessment & Analysis
            </motion.h2>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <RiskHeatmap />
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* Premium Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-slate-900 via-emerald-900 to-blue-900 text-white mt-8 sm:mt-12 md:mt-16 lg:mt-24 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-8 md:mb-12"
          >
            <motion.div variants={fadeInUp}>
              <h4 className="text-base sm:text-lg font-black mb-3 sm:mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                About This Analysis
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                Comprehensive investment strategy for oilseed processing and export to India. Based on market data, tariff analysis, and supply chain logistics.
              </p>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-base sm:text-lg font-black mb-3 sm:mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Key Markets
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <span>🇮🇳</span> India (Primary Market)
                </li>
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <span>🇹🇿</span> Tanzania (Recommended)
                </li>
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <span>🇰🇿</span> Kazakhstan (Alternative)
                </li>
                <li className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
                  <span>🇿🇲</span> Zambia (Key Supplier)
                </li>
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <h4 className="text-base sm:text-lg font-black mb-3 sm:mb-4 bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Investment Metrics
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span>💰</span> <span className="font-semibold">$2.35M</span> Investment
                </li>
                <li className="flex items-center gap-2">
                  <span>📈</span> <span className="font-semibold">24% IRR</span> 5-Year Return
                </li>
                <li className="flex items-center gap-2">
                  <span>⏱️</span> <span className="font-semibold">2.75 years</span> Payback
                </li>
                <li className="flex items-center gap-2">
                  <span>⚙️</span> <span className="font-semibold">68K tons/year</span> Capacity
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <div className="border-t border-white/10 pt-4 sm:pt-6 md:pt-8 text-center">
            <motion.p
              variants={fadeInUp}
              className="text-xs sm:text-sm text-slate-400 font-medium tracking-widest uppercase"
            >
              © 2025 Elite Investment Analysis Dashboard | Advanced Analytics
            </motion.p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
