import React, { useState, useRef, useMemo } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: ChartData[];
}

const AreaChart: React.FC<AreaChartProps> = ({ data }) => {
  if (!data || data.length < 2) {
    return <div className="flex items-center justify-center h-full text-slate-500">Not enough data to display chart</div>;
  }
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    content: string;
    x: number;
    y: number;
    label: string;
  }>({ visible: false, content: '', x: 0, y: 0, label: '' });

  const chartHeight = 288;
  const chartWidth = 600;
  const padding = { top: 20, right: 0, bottom: 30, left: 0 };

  const { xScale, yScale, linePath, areaPath } = useMemo(() => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = 0;

    const xScale = (index: number) => 
      padding.left + index * ((chartWidth - padding.left - padding.right) / (data.length - 1));
    
    const yScale = (value: number) => 
      chartHeight - padding.bottom - ((value - minValue) / (maxValue - minValue)) * (chartHeight - padding.top - padding.bottom);
      
    const linePath = data
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.value)}`)
      .join(' ');

    const areaPath = `${linePath} L ${xScale(data.length - 1)} ${chartHeight - padding.bottom} L ${xScale(0)} ${chartHeight - padding.bottom} Z`;

    return { xScale, yScale, linePath, areaPath };
  }, [data, chartHeight, chartWidth, padding]);
  
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    const svgRect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - svgRect.left;
    
    const index = Math.round((mouseX - padding.left) / ((chartWidth - padding.left - padding.right) / (data.length - 1)));
    
    if (index >= 0 && index < data.length) {
      const item = data[index];
      setTooltip({
        visible: true,
        content: `$${item.value.toLocaleString()}`,
        label: item.label,
        x: xScale(index),
        y: yScale(item.value),
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A5B4FC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#areaGradient)" className="area-path" />
        <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="2.5" className="line-path" />

        {data.map((item, index) => (
          <text key={item.label} x={xScale(index)} y={chartHeight - 10} textAnchor="middle" className="text-xs font-semibold fill-slate-500">
            {item.label}
          </text>
        ))}

        {tooltip.visible && (
          <g>
            <line
              x1={tooltip.x}
              y1={padding.top}
              x2={tooltip.x}
              y2={chartHeight - padding.bottom}
              stroke="#4F46E5"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" />
          </g>
        )}
      </svg>
      {tooltip.visible && (
        <div
          className="absolute bg-slate-800 text-white text-xs font-bold py-1 px-3 rounded-md pointer-events-none transition-opacity duration-200 shadow-lg"
          style={{
            transform: 'translate(-50%, -120%)',
            left: `${(tooltip.x / chartWidth) * 100}%`,
            top: `${(tooltip.y / chartHeight) * 100}%`,
          }}
        >
          <div className="font-semibold">{tooltip.label}</div>
          <div>{tooltip.content}</div>
        </div>
      )}
      <style>{`
        .line-path {
            stroke-dasharray: 2000;
            stroke-dashoffset: 2000;
            animation: draw-line 1.5s ease-out forwards;
        }
        .area-path {
            opacity: 0;
            animation: fade-in 1s 0.5s ease-out forwards;
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

export default AreaChart;