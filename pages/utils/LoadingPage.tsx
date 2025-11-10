import React, { useState, useEffect } from 'react';

const loadingMessages = [
    'Initializing AI Core...',
    'Analyzing Performance Data...',
    'Preparing Your Dashboard...',
    'Unlocking Insights...',
    'Almost there...',
];

const LoadingPage: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 1500); // Change message every 1.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F7FE] flex-col font-sans">
            <div className="relative flex items-center justify-center">
                {/* Pulsing glow effect */}
                <div className="absolute w-48 h-48 bg-indigo-200 rounded-full animate-ping opacity-50"></div>
                
                <div className="relative w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
                    <img src="https://media.licdn.com/dms/image/v2/D4D0BAQEQHDp3om_eug/company-logo_200_200/company-logo_200_200/0/1702105920324/highq_labs_pvt_ltd_logo?e=2147483647&v=beta&t=scIhNIvxzHNCJLSbJEfkjTHSzC42y1kqWB_Lz0UOTvM" alt="HighQ-Labs Logo" className="w-20 h-20" />
                </div>
            </div>
            <div className="mt-8 text-center">
                <p className="text-xl font-semibold text-slate-700 transition-opacity duration-500">
                    {loadingMessages[messageIndex]}
                </p>
                <div className="w-64 h-2 bg-slate-200 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full animate-loading-bar"></div>
                </div>
            </div>
             <style>{`
                @keyframes loading-bar {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-loading-bar {
                    animation: loading-bar 1.5s infinite ease-in-out;
                }
             `}</style>
        </div>
    );
};

export default LoadingPage;