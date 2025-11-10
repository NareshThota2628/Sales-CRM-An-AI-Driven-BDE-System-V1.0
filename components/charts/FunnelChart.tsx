import React from 'react';

interface FunnelData {
  stage: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelData[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-500">No data to display chart</div>;
  }
  const total = data[0].value;
  const colors = ['#4338CA', '#4F46E5', '#6366F1', '#818CF8', '#A5B4FC'];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-1">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const prevPercentage = index > 0 ? (data[index - 1].value / total) * 100 : 100;
        const conversionRate = index > 0 ? ((item.value / data[index - 1].value) * 100).toFixed(1) + '%' : '';

        return (
          <div key={item.stage} className="relative w-full flex items-center justify-center animate-fade-in" style={{ animationDelay: `${index * 150}ms`}}>
            {index > 0 && (
              <div className="absolute -top-4 text-center text-xs text-indigo-700 font-semibold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto"><path d="M12 5V19M19 12L12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {conversionRate}
              </div>
            )}
            <div
              className="relative h-12 rounded-md flex items-center justify-between px-4 text-white font-bold transition-all duration-500"
              style={{
                width: `${percentage}%`,
                backgroundColor: colors[index % colors.length],
                clipPath: `polygon(0 0, 100% 0, ${100 - (percentage / prevPercentage) * 5}% 100%, ${(percentage / prevPercentage) * 5}% 100%)`,
              }}
            >
              <span className="text-sm">{item.stage}</span>
              <span className="text-lg">{item.value.toLocaleString()}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelChart;