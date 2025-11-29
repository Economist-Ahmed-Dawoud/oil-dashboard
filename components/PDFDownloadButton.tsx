'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { generatePDF } from '@/lib/pdf-generator';

export default function PDFDownloadButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      await generatePDF();
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleDownloadPDF}
      disabled={isLoading}
      whileHover={{ scale: isLoading ? 1 : 1.05 }}
      whileTap={{ scale: isLoading ? 1 : 0.98 }}
      className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all border touch-target ${
        isLoading
          ? 'bg-gray-400 text-white border-transparent cursor-not-allowed'
          : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg border-transparent hover:shadow-xl hover:from-emerald-600 hover:to-teal-700'
      }`}
    >
      <span className="text-lg">{isLoading ? '⏳' : '📥'}</span>
      <span className="hidden sm:inline text-sm">
        {isLoading ? 'Generating...' : 'Download PDF'}
      </span>
      <span className="sm:hidden text-xs">PDF</span>
    </motion.button>
  );
}
