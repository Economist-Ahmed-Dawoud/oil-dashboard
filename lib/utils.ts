export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(1)}%`;
};

export const getRiskColor = (level: number): string => {
  if (level <= 1) return '#d1d5db';
  if (level === 2) return '#fbbf24';
  if (level === 3) return '#fb923c';
  return '#ef4444';
};

export const getRiskIntensity = (level: number): number => {
  return Math.min(1, (level / 5) * 1.2);
};

export const interpolateColor = (ratio: number, startColor: string, endColor: string): string => {
  const hex = (x: number) => {
    return ('0' + Math.round(x).toString(16)).slice(-2);
  };

  const start = startColor.replace('#', '');
  const end = endColor.replace('#', '');

  const r = parseInt(start.substr(0, 2), 16) * (1 - ratio) + parseInt(end.substr(0, 2), 16) * ratio;
  const g = parseInt(start.substr(2, 2), 16) * (1 - ratio) + parseInt(end.substr(2, 2), 16) * ratio;
  const b = parseInt(start.substr(4, 2), 16) * (1 - ratio) + parseInt(end.substr(4, 2), 16) * ratio;

  return `#${hex(r)}${hex(g)}${hex(b)}`;
};
