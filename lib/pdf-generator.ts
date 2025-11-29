import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF() {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Define colors matching the dashboard
    const primaryGradient = '#10b981';
    const secondaryGradient = '#3b82f6';
    const darkText = '#1e293b';
    const lightText = '#64748b';

    // Helper function to add text
    const addText = (
      text: string,
      x: number,
      y: number,
      options: any = {}
    ) => {
      pdf.setFont('Helvetica', options.bold ? 'bold' : 'normal');
      pdf.setFontSize(options.size || 11);
      pdf.setTextColor(options.color || darkText);
      const lines = pdf.splitTextToSize(text, options.maxWidth || contentWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * (options.size || 11) * 0.4) + (options.space || 3);
    };

    // Helper to add section
    const addSection = (title: string) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFillColor(16, 185, 129); // Emerald green
      pdf.rect(margin, yPosition, contentWidth, 8, 'F');
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text(title, margin + 3, yPosition + 6);
      yPosition += 12;
      return yPosition;
    };

    // COVER PAGE
    pdf.setFillColor(248, 250, 252); // Light background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    // Gradient-like header
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 0, pageWidth, 60, 'F');

    yPosition = 15;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(28);
    pdf.setTextColor(255, 255, 255);
    pdf.text('Oilseed Investment Strategy', margin, yPosition);

    yPosition += 15;
    pdf.setFontSize(14);
    pdf.text('Tanzania & Kazakhstan Analysis', margin, yPosition);

    yPosition = 80;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(18);
    pdf.setTextColor(darkText);
    pdf.text('Executive Investment Opportunity', margin, yPosition);

    yPosition += 15;
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(lightText);
    const introText = pdf.splitTextToSize(
      'Comprehensive analysis of oilseed processing and export opportunities to India\'s growing edible oil market. This report evaluates two strategic locations and provides financial projections with risk assessments.',
      contentWidth
    );
    pdf.text(introText, margin, yPosition);

    yPosition = pageHeight - 40;
    pdf.setFontSize(10);
    pdf.setTextColor(lightText);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPosition);
    pdf.text('Confidential - Investment Analysis', margin, yPosition + 6);

    // PAGE 2 - KEY METRICS
    pdf.addPage();
    yPosition = margin;

    addSection('Key Market Metrics');

    // Create a metrics grid
    const metrics = [
      { label: 'Total Imports', value: '16 MT', desc: 'Annual edible oil imports' },
      { label: 'Market Value', value: '$18.3B', desc: 'Annual market opportunity' },
      { label: 'Growth Rate', value: '3.5% CAGR', desc: 'Market growth projection' },
      { label: 'Investment', value: '$2.35M', desc: 'Tanzania facility setup' },
    ];

    const metricsPerRow = 2;
    const metricWidth = (contentWidth - 5) / metricsPerRow;

    for (let i = 0; i < metrics.length; i += metricsPerRow) {
      for (let j = 0; j < metricsPerRow && i + j < metrics.length; j++) {
        const metric = metrics[i + j];
        const xPos = margin + j * (metricWidth + 5);

        // Box background
        pdf.setFillColor(243, 244, 246);
        pdf.rect(xPos, yPosition, metricWidth, 28, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.rect(xPos, yPosition, metricWidth, 28);

        // Metric value
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(59, 130, 246); // Blue
        pdf.text(metric.value, xPos + 3, yPosition + 8);

        // Metric label
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(darkText);
        pdf.text(metric.label, xPos + 3, yPosition + 15);

        // Metric description
        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(lightText);
        pdf.text(metric.desc, xPos + 3, yPosition + 22);
      }
      yPosition += 35;
    }

    // PAGE 3 - TANZANIA STRATEGY
    pdf.addPage();
    yPosition = margin;

    addSection('Recommended Strategy: Tanzania');

    yPosition += 2;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(darkText);
    pdf.text('✓ RECOMMENDED LOCATION', margin, yPosition);

    yPosition = addText(
      'Strategic Advantages: Direct port access in Dar es Salaam with 0% tariff via DFTP agreement. Regional sourcing from Zambia, Uganda, and Kenya provides supply security with cost advantages.',
      margin,
      yPosition + 5,
      { size: 10, space: 6 }
    );

    // Financial metrics
    yPosition += 3;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(darkText);
    pdf.text('Financial Projections:', margin, yPosition);

    yPosition += 8;
    const tanzaniaMetrics = [
      ['Investment Required', '$2.35 Million'],
      ['Payback Period', '2.75 Years'],
      ['5-Year IRR', '24%'],
      ['EBITDA Margin', '42%'],
      ['Daily Capacity', '30 Tons'],
      ['Annual Output', '68,000 Tons'],
    ];

    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(10);

    for (const [label, value] of tanzaniaMetrics) {
      pdf.setTextColor(darkText);
      pdf.text(label + ':', margin, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(value, margin + 65, yPosition);
      pdf.setFont('Helvetica', 'normal');
      yPosition += 6;
    }

    yPosition += 5;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(darkText);
    pdf.text('Competitive Advantages:', margin, yPosition);

    yPosition += 7;
    const advantages = [
      '0% DFTP tariff provides $420/ton cost advantage',
      'Port logistics: 14 days to India vs 25-30 days overland',
      'Regional duty-free inputs from SADC member nations',
      '70% sunflower / 30% soybean product mix',
      'Growing demand creates market entry opportunity (+36% YoY)',
    ];

    advantages.forEach((adv) => {
      yPosition = addText('• ' + adv, margin, yPosition, { size: 9, space: 4 });
    });

    // PAGE 4 - KAZAKHSTAN ALTERNATIVE
    pdf.addPage();
    yPosition = margin;

    addSection('Alternative Strategy: Kazakhstan');

    yPosition += 2;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(darkText);
    pdf.text('ℹ ALTERNATIVE LOCATION', margin, yPosition);

    yPosition = addText(
      'Supply Security: Industrial-scale infrastructure with proven capacity. However, 35% MFN tariff creates significant cost disadvantage. Better for supply reliability than financial returns.',
      margin,
      yPosition + 5,
      { size: 10, space: 6 }
    );

    // Financial metrics
    yPosition += 3;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(darkText);
    pdf.text('Financial Projections:', margin, yPosition);

    yPosition += 8;
    const kazakhstanMetrics = [
      ['Investment Required', '$2.80 Million'],
      ['Payback Period', '3.25 Years'],
      ['5-Year IRR', '16.5%'],
      ['EBITDA Margin', '28%'],
      ['Daily Capacity', '35 Tons'],
      ['Annual Output', '82,000 Tons'],
    ];

    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(10);

    for (const [label, value] of kazakhstanMetrics) {
      pdf.setTextColor(darkText);
      pdf.text(label + ':', margin, yPosition);
      pdf.setTextColor(59, 130, 246);
      pdf.setFont('Helvetica', 'bold');
      pdf.text(value, margin + 65, yPosition);
      pdf.setFont('Helvetica', 'normal');
      yPosition += 6;
    }

    yPosition += 5;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(darkText);
    pdf.text('Key Strengths:', margin, yPosition);

    yPosition += 7;
    const strengths = [
      'Very low supply/weather risk with industrial infrastructure',
      '80% sunflower / 20% soybean production capability',
      'Proven logistics with established export channels',
      'Supply security premium vs emerging market alternatives',
    ];

    strengths.forEach((str) => {
      yPosition = addText('• ' + str, margin, yPosition, { size: 9, space: 4 });
    });

    // PAGE 5 - RISK ASSESSMENT
    pdf.addPage();
    yPosition = margin;

    addSection('Risk Assessment & Mitigation');

    const risks = [
      {
        name: 'Geopolitical Risk',
        desc: 'Trade policy changes or tariff disputes',
        mitigation:
          'Tanzania: Diversify to other SADC markets. Kazakhstan: Monitor RUS-KAZ relations.',
      },
      {
        name: 'Supply Volatility',
        desc: 'Agricultural production fluctuations',
        mitigation:
          'Maintain 30-45 day buffer stock. Develop supplier relationships across 3+ countries.',
      },
      {
        name: 'Quality Control',
        desc: 'Oilseed quality variations from smallholder farmers',
        mitigation:
          'Partner with farmer cooperatives. Implement testing protocols at farm & facility level.',
      },
      {
        name: 'Market Concentration',
        desc: 'Dependence on Indian market demand',
        mitigation:
          'Develop secondary markets in Bangladesh, Pakistan, Middle East by Year 3.',
      },
    ];

    risks.forEach((risk) => {
      if (yPosition > pageHeight - 35) {
        pdf.addPage();
        yPosition = margin;
      }

      // Risk box
      pdf.setFillColor(254, 243, 199); // Yellow background
      pdf.rect(margin, yPosition, contentWidth, 2, 'F');

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(darkText);
      pdf.text(risk.name, margin + 2, yPosition + 6);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(lightText);
      pdf.text(risk.desc, margin + 2, yPosition + 11);

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.setTextColor(22, 163, 74); // Green
      pdf.text('Mitigation:', margin + 2, yPosition + 17);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(darkText);
      const mitText = pdf.splitTextToSize(risk.mitigation, contentWidth - 4);
      pdf.text(mitText, margin + 2, yPosition + 22);

      yPosition += 28 + (mitText.length - 1) * 4;
    });

    // PAGE 6 - RECOMMENDATION & TIMELINE
    pdf.addPage();
    yPosition = margin;

    addSection('Investment Recommendation');

    yPosition += 3;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(darkText);
    pdf.text('Primary Recommendation: Tanzania Investment', margin, yPosition);

    yPosition += 8;
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(darkText);

    const recommendation = [
      'Superior financial returns (24% vs 16.5% IRR)',
      'Lower tariff barrier (0% DFTP vs 35% MFN)',
      'Faster payback period (2.75 vs 3.25 years)',
      'Strong growth market with increasing demand',
      'Manageable risks with clear mitigation strategies',
    ];

    recommendation.forEach((rec) => {
      yPosition = addText('✓ ' + rec, margin, yPosition, { size: 10, space: 5 });
    });

    yPosition += 8;
    addSection('Implementation Timeline');

    yPosition += 2;
    const timeline = [
      { phase: 'Phase 1 (Months 1-3)', desc: 'Site acquisition, facility design, permitting' },
      {
        phase: 'Phase 2 (Months 4-9)',
        desc: 'Equipment procurement, construction, installation',
      },
      {
        phase: 'Phase 3 (Months 10-12)',
        desc: 'Testing, certification, initial operations ramp',
      },
      {
        phase: 'Year 2',
        desc: 'Full capacity operations, supplier network development',
      },
    ];

    timeline.forEach((item) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(59, 130, 246);
      pdf.text(item.phase, margin, yPosition);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(darkText);
      yPosition = addText(item.desc, margin + 40, yPosition - 5, {
        size: 9,
        maxWidth: contentWidth - 40,
        space: 6,
      });
    });

    // PAGE 7 - FOOTER
    pdf.addPage();
    yPosition = margin;

    pdf.setFillColor(15, 23, 42); // Dark background
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    yPosition = pageHeight / 2 - 20;

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(20);
    pdf.setTextColor(16, 185, 129);
    pdf.text('Investment Ready', pageWidth / 2, yPosition, { align: 'center' });

    yPosition += 20;
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(203, 213, 225);
    const summaryText = pdf.splitTextToSize(
      'This comprehensive analysis demonstrates a compelling investment opportunity with strong financial returns, manageable risks, and clear mitigation strategies. The Tanzania location offers superior economics with a 2.75-year payback period and 24% IRR.',
      contentWidth
    );
    pdf.text(summaryText, pageWidth / 2, yPosition, { align: 'center' });

    yPosition = pageHeight - 50;
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(16, 185, 129);
    pdf.text('Ready to proceed with Phase 1 implementation', pageWidth / 2, yPosition, {
      align: 'center',
    });

    yPosition += 15;
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(148, 163, 184);
    pdf.text(
      `Generated: ${new Date().toLocaleDateString()} | Confidential Investment Analysis`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );

    // Save the PDF
    pdf.save('Oilseed_Investment_Strategy.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
