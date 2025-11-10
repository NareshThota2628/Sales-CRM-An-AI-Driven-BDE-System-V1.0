import React from 'react';

interface ScatterData {
  name: string;
  conversionRate: number;
  closedARR: number;
  leads: number;
}

interface ScatterPlotChartProps {
  data: ScatterData[];
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data to display chart</div>;
  }
  const chartHeight = 288;
  const chartWidth = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };

  const maxX = Math.max(...data.map(d => d.conversionRate)) * 1.1;
  const maxY = Math.max(...data.map(d => d.closedARR)) * 1.1;
  const maxLeads = Math.max(...data.map(d => d.leads));

  const xScale = (value: number) => 
    padding.left + (value / maxX) * (chartWidth - padding.left - padding.right);

  const yScale = (value: number) => 
    chartHeight - padding.bottom - (value / maxY) * (chartHeight - padding.top - padding.bottom);

  const radiusScale = (value: number) => 5 + (value / maxLeads) * 15;

  return (
    <div className="w-full h-full relative">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full">
        {/* Y Axis Label */}
        <text x={-(chartHeight / 2)} y={15} transform="rotate(-90)" textAnchor="middle" className="text-xs font-semibold fill-slate-500">Closed ARR (k)</text>
        {/* X Axis Label */}
        <text x={chartWidth / 2} y={chartHeight - 5} textAnchor="middle" className="text-xs font-semibold fill-slate-500">Conversion Rate (%)</text>
        
        {/* Bubbles */}
        {data.map((item, index) => (
          <g key={item.name} className="bubble" style={{ animationDelay: `${index * 100}ms`}}>
            <circle
              cx={xScale(item.conversionRate)}
              cy={yScale(item.closedARR)}
              r={radiusScale(item.leads)}
              fill="#4F46E5"
              fillOpacity="0.6"
              stroke="#4F46E5"
              strokeWidth="2"
            />
            <text x={xScale(item.conversionRate)} y={yScale(item.closedARR)} textAnchor="middle" dy=".3em" className="text-[8px] font-bold fill-white pointer-events-none">
                {item.name.substring(0,1)}
            </text>
          </g>
        ))}
      </svg>
      <style>{`
        .bubble {
            transform-origin: center;
            opacity: 0;
            transform: scale(0);
            animation: pop-in 0.5s ease-out forwards;
        }
        @keyframes pop-in {
            to { 
                opacity: 1;
                transform: scale(1);
            }
        }
      `}</style>
    </div>
  );
};

export default ScatterPlotChart;