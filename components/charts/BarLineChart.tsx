import React from 'react';

interface BarLineData {
  name: string;
  monthly: number;
  cumulative: number;
}

interface BarLineChartProps {
  data: BarLineData[];
}

const BarLineChart: React.FC<BarLineChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data to display chart</div>;
  }
  const chartHeight = 288;
  const chartWidth = 600;
  const padding = { top: 20, right: 30, bottom: 30, left: 30 };

  const maxMonthly = Math.max(...data.map(d => d.monthly));
  const maxCumulative = Math.max(...data.map(d => d.cumulative));

  const xScale = (index: number) => 
    padding.left + index * ((chartWidth - padding.left - padding.right) / (data.length - 1));

  const yBarScale = (value: number) => 
    chartHeight - padding.bottom - (value / maxMonthly) * (chartHeight - padding.top - padding.bottom);

  const yLineScale = (value: number) =>
    chartHeight - padding.bottom - (value / maxCumulative) * (chartHeight - padding.top - padding.bottom);

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yLineScale(d.cumulative)}`)
    .join(' ');
  
  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
        {/* Bars for monthly revenue */}
        {data.map((item, index) => (
          <g key={item.name}>
            <rect
              x={xScale(index) - 15}
              y={yBarScale(item.monthly)}
              width="30"
              height={chartHeight - padding.bottom - yBarScale(item.monthly)}
              fill="#A5B4FC"
              className="bar"
              style={{ animationDelay: `${index * 100}ms` }}
            />
            <text x={xScale(index)} y={chartHeight - 10} textAnchor="middle" className="text-xs font-semibold fill-slate-500">
              {item.name}
            </text>
          </g>
        ))}
        {/* Line for cumulative revenue */}
        <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="2.5" className="line-path" />
        {data.map((item, index) => (
          <circle key={`dot-${index}`} cx={xScale(index)} cy={yLineScale(item.cumulative)} r="4" fill="#4F46E5" className="dot" style={{ animationDelay: `${500 + index * 100}ms` }} />
        ))}
      </svg>
      <style>{`
        .bar {
            transform-origin: bottom;
            transform: scaleY(0);
            animation: grow-bar 0.5s ease-out forwards;
        }
        .line-path {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: draw-line 1s 0.5s ease-out forwards;
        }
        .dot {
            opacity: 0;
            animation: fade-in 0.3s ease-out forwards;
        }
        @keyframes grow-bar {
            to { transform: scaleY(1); }
        }
        @keyframes draw-line {
            to { stroke-dashoffset: 0; }
        }
        @keyframes fade-in {
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BarLineChart;