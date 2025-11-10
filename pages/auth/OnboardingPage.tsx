import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const OnboardingPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const goals = [
    'Find new leads',
    'Qualify prospects',
    'Analyze conversions',
    'Manage my team',
  ];

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        console.log('Onboarding complete:', { companyName, primaryGoal });
        // Navigate to the main dashboard/profile page
        navigate('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center mb-4">
          <img src="https://media.licdn.com/dms/image/v2/D4D0BAQEQHDp3om_eug/company-logo_200_200/company-logo_200_200/0/1702105920324/highq_labs_pvt_ltd_logo?e=2147483647&v=beta&t=scIhNIvxzHNCJLSbJEfkjTHSzC42y1kqWB_Lz0UOTvM" alt="HighQ-Labs Logo" className="w-12 h-12" />
          <div className="ml-4 h-2 w-full bg-slate-200 rounded-full">
            <div className="h-2 bg-indigo-500 rounded-full transition-all duration-500" style={{ width: '33%' }}></div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome to Sales CRM!</h1>
        <p className="text-lg text-slate-500 mb-10">Let's get your account set up in a few seconds.</p>

        <div className="space-y-8">
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* FIX: Move the label into the Input component to fix missing prop error. */}
            <Input
              label="What's your company's name?"
              id="company-name"
              type="text"
              placeholder="e.g., Acme Corporation"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-base"
            />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <label className="text-lg font-medium text-slate-700 block mb-3">
              What's your primary goal?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setPrimaryGoal(goal)}
                  className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                    primaryGoal === goal
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform -translate-y-1'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-right animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <Button 
            onClick={handleComplete} 
            isLoading={isLoading} 
            disabled={!companyName || !primaryGoal}
            className="px-8 py-3 text-base"
          >
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;