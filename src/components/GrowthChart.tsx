import React, { useRef, useEffect, useState } from 'react';
import { LineChart as ChartIcon, Maximize2, Info } from 'lucide-react';

interface GrowthDataPoint {
  age: number; // months
  h: number;   // height cm
  w: number;   // weight kg
  date?: string;
  status?: string;
}

interface GrowthChartProps {
  history: GrowthDataPoint[];
  childName?: string;
  gender?: 'L' | 'P';
}

export const GrowthChart: React.FC<GrowthChartProps> = ({
  history,
  childName = 'Balita',
  gender = 'L',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metric, setMetric] = useState<'height' | 'weight'>('height');
  const [dimensions, setDimensions] = useState({ width: 600, height: 320 });

  // Handle dynamic container sizing via ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDimensions({
            width: Math.floor(entry.contentRect.width),
            height: Math.min(380, Math.max(260, Math.floor(entry.contentRect.width * 0.5))),
          });
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Draw chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = dimensions.width;
    const h = dimensions.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 30, right: 30, bottom: 40, left: 45 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    const maxAge = 24; // 0 to 24 months (1000 HPK focus)
    const maxHeight = 95;
    const minHeight = 45;
    const maxWeight = 16;
    const minWeight = 2;

    const isHeight = metric === 'height';
    const minY = isHeight ? minHeight : minWeight;
    const maxY = isHeight ? maxHeight : maxWeight;

    const getX = (age: number) => padding.left + (Math.min(age, maxAge) / maxAge) * chartW;
    const getY = (val: number) => padding.top + chartH - ((val - minY) / (maxY - minY)) * chartH;

    // WHO Reference curves approximate values
    const getMedianVal = (a: number) => {
      if (isHeight) {
        return gender === 'L' ? 49.9 + a * 1.8 : 49.1 + a * 1.75;
      } else {
        return gender === 'L' ? 3.3 + a * 0.45 : 3.2 + a * 0.42;
      }
    };

    const getMinus2SDVal = (a: number) => {
      if (isHeight) {
        return getMedianVal(a) - (gender === 'L' ? 3.8 + a * 0.08 : 3.6 + a * 0.08);
      } else {
        return getMedianVal(a) - (gender === 'L' ? 1.2 + a * 0.04 : 1.1 + a * 0.04);
      }
    };

    // 1. Draw Grid Lines & Axes
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const val = minY + (i / ySteps) * (maxY - minY);
      const y = getY(val);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      // Axis label Y
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${Math.round(val)}${isHeight ? 'cm' : 'kg'}`, padding.left - 6, y + 3);
    }

    // Vertical grid lines (every 3 months)
    for (let a = 0; a <= maxAge; a += 3) {
      const x = getX(a);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartH);
      ctx.stroke();

      // Axis label X
      ctx.fillStyle = '#94A3B8';
      ctx.font = '10px Plus Jakarta Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${a} bln`, x, padding.top + chartH + 18);
    }

    // 2. Fill Stunting Danger Zone (-2 SD and below)
    ctx.beginPath();
    ctx.moveTo(getX(0), getY(getMinus2SDVal(0)));
    for (let a = 1; a <= maxAge; a++) {
      ctx.lineTo(getX(a), getY(getMinus2SDVal(a)));
    }
    ctx.lineTo(getX(maxAge), padding.top + chartH);
    ctx.lineTo(getX(0), padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = 'rgba(244, 63, 94, 0.08)';
    ctx.fill();

    // 3. Draw -2 SD Line (Batas Stunting / Gizi Kurang)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    for (let a = 0; a <= maxAge; a++) {
      const x = getX(a);
      const y = getY(getMinus2SDVal(a));
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Draw WHO Median Line
    ctx.beginPath();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    for (let a = 0; a <= maxAge; a++) {
      const x = getX(a);
      const y = getY(getMedianVal(a));
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 5. Draw Child Historical Growth Curve
    if (history && history.length > 0) {
      const sortedHistory = [...history].sort((a, b) => a.age - b.age);

      ctx.beginPath();
      ctx.strokeStyle = '#0284C7'; // Blue primary
      ctx.lineWidth = 3;
      ctx.lineJoin = 'round';

      sortedHistory.forEach((pt, idx) => {
        const val = isHeight ? pt.h : pt.w;
        const x = getX(pt.age);
        const y = getY(val);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw Data Dots
      sortedHistory.forEach((pt) => {
        const val = isHeight ? pt.h : pt.w;
        const x = getX(pt.age);
        const y = getY(val);

        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0284C7';
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#0284C7';
        ctx.fill();

        // Value text
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 9px Plus Jakarta Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${val}`, x, y - 9);
      });
    }
  }, [dimensions, history, metric, gender]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      {/* Header with Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Kurva Pertumbuhan Standar WHO: {childName}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Perbandingan riwayat tumbuh balita dengan median acuan Kemenkes RI
          </p>
        </div>

        {/* Height / Weight Metric Toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-700/70 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setMetric('height')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'height'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Tinggi Badan (TB/U)
          </button>
          <button
            onClick={() => setMetric('weight')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'weight'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            Berat Badan (BB/U)
          </button>
        </div>
      </div>

      {/* Canvas Chart Area */}
      <div ref={containerRef} className="w-full relative min-h-[260px] flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full block" />
      </div>

      {/* Legend & Interpretations */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">Data Pengukuran Anak</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 bg-emerald-500 rounded"></span>
          <span className="font-medium text-slate-600 dark:text-slate-400">Median WHO (Garis Hijau)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-1 border-t-2 border-dashed border-rose-500"></span>
          <span className="font-medium text-rose-600 dark:text-rose-400">Batas -2 SD (Zona Risiko Stunting)</span>
        </div>
      </div>
    </div>
  );
};
