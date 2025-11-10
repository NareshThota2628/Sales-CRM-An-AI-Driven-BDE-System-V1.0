import React from 'react';

interface RadialData {
  name: string;
  value: number;
  color: string;
}

interface RadialBarChartProps {
  data: RadialData[];
}

const RadialBarChart: React.FC<RadialBarChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="flex items-center justify-center h-full text-slate-500">No data to display chart</div>;
    }
    const size = 240;
    const strokeWidth = 20;
    const center = size / 2;
    const maxVal = Math.max(...data.map(d => d.value));

    return (
        <div className="w-full h-full flex items-center justify-center gap-8">
            <div className="relative" style={{ width: size, height: size }}>
                <svg viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                    {data.map((item, index) => {
                        const radius = center - strokeWidth * (index + 1) + (strokeWidth / 2);
                        const circumference = 2 * Math.PI * radius;
                        const percentage = (item.value / maxVal) * 100;
                        const offset = circumference - (percentage / 100) * circumference;

                        return (
                            <g key={item.name}>
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke="#E2E8F0"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                />
                                <circle
                                    cx={center}
                                    cy={center}
                                    r={radius}
                                    stroke={item.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={circumference}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    className="radial-bar"
                                    style={{ animationDelay: `${index * 150}ms`, '--circumference': circumference, '--offset': offset } as React.CSSProperties}
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <div>
                            <p className="font-bold text-slate-800">{item.name}</p>
                            <p className="text-sm text-slate-500">{item.value}% of Leads</p>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`
                .radial-bar {
                    animation: draw-radial 1s ease-out forwards;
                }
                @keyframes draw-radial {
                    to {
                        stroke-dashoffset: var(--offset);
                    }
                }
            `}</style>
        </div>
    );
};

export default RadialBarChart;