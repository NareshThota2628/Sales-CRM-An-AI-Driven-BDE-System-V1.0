import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import MailIcon from '../../components/icons/MailIcon';
import LockIcon from '../../components/icons/LockIcon';
import FireIcon from '../../components/icons/FireIcon';
import XIcon from '../../components/icons/XIcon';
import LoadingPage from '../utils/LoadingPage';

// Widgets for the image panel
const ProfileWidget = () => (
    <div className="absolute top-24 left-16 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s'}}>
        <img className="w-12 h-12 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?img=1" alt="avatar" />
        <div>
            <p className="text-sm text-slate-600">Welcome back,</p>
            <h3 className="font-bold text-slate-800">Amélie Laurent</h3>
        </div>
    </div>
);

const KpiWidget = () => (
    <div className="absolute bottom-32 -right-8 bg-indigo-500 text-white p-5 rounded-2xl shadow-lg w-56 animate-fade-in" style={{ animationDelay: '0.4s'}}>
        <div className="flex justify-between items-center">
            <h3 className="font-bold">Hot Leads</h3>
            <FireIcon className="w-5 h-5 text-yellow-300" />
        </div>
        <p className="text-4xl font-bold mt-2">12</p>
        <p className="text-sm text-indigo-200">+3 since yesterday</p>
    </div>
);

const ActivityStreamWidget = () => (
    <div className="absolute bottom-8 left-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg w-72 animate-fade-in" style={{ animationDelay: '0.6s'}}>
        <h3 className="font-bold text-slate-800 text-sm mb-2">Recent Activity</h3>
        <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>Converted Quantum Leap</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>Logged call with Innovatech</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>Sent follow-up to DataCorp</li>
        </ul>
    </div>
);


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            let targetPath = '';
            if (email === 'master@nr123' && password === '2628') {
                localStorage.setItem('userRole', 'master');
                targetPath = '/master/dashboard';
            } else {
                 const credentials = JSON.parse(localStorage.getItem('bde-ai-credentials') || '{}');
                 const allUsers = JSON.parse(localStorage.getItem('bde-ai-users') || '[]');

                 if (credentials[email] && credentials[email] === password) {
                     const user = allUsers.find((u: any) => u.email === email);
                     const userRole = user?.role.toLowerCase() === 'admin' ? 'master' : 'bde';
                     localStorage.setItem('userRole', userRole);

                     if (userRole === 'master') {
                         targetPath = '/master/dashboard';
                     } else {
                         targetPath = '/bde/dashboard';
                     }
                 }
            }

            if (targetPath) {
                setIsRedirecting(true); // Trigger the loading screen
                setTimeout(() => {
                    navigate(targetPath);
                }, 3000); // Show animation for 3 seconds
            } else {
                setError('Invalid email or password.');
                setIsLoading(false);
            }
        }, 1000);
    };

    if (isRedirecting) {
        return <LoadingPage />;
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-[#F4F7FE]">
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white/60 backdrop-blur-lg rounded-[40px] shadow-2xl overflow-hidden animate-fade-in">
                {/* Form Panel */}
                <div className="flex flex-col justify-center p-12">
                     <div className="w-full max-w-sm mx-auto">
                        <div className="flex items-center mb-8 animate-fade-in">
                             <img src="https://media.licdn.com/dms/image/v2/D4D0BAQEQHDp3om_eug/company-logo_200_200/company-logo_200_200/0/1702105920324/highq_labs_pvt_ltd_logo?e=2147483647&v=beta&t=scIhNIvxzHNCJLSbJEfkjTHSzC42y1kqWB_Lz0UOTvM" alt="HighQ-Labs Logo" className="w-12 h-12" />
                             <h1 className="ml-4 text-3xl font-bold text-slate-800 tracking-tight">
                                Sales CRM
                            </h1>
                        </div>
                        
                        <div className="animate-fade-in" style={{ animationDelay: '0.1s'}}>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h2>
                            <p className="text-slate-600 mb-8">Sign in to continue your work.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in" style={{ animationDelay: '0.2s'}}>
                            <Input
                                label="Email Address"
                                id="email"
                                type="email"
                                placeholder="you@company.com"
                                icon={<MailIcon className="w-5 h-5 text-gray-400" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isLoading}
                            />
                            <Input
                                label="Password"
                                id="password"
                                type="password"
                                placeholder="••••••••••••"
                                icon={<LockIcon className="w-5 h-5 text-gray-400" />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                            
                            {error && <p className="text-sm text-red-500 text-center !mt-4">{error}</p>}

                            <div className="flex items-center justify-end text-sm !mt-4">
                                 <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Forgot your password?
                                </Link>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" isLoading={isLoading} className="w-full">
                                    Sign In
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
                 {/* Image Panel */}
                <div className="relative hidden md:block">
                    <img 
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2832&auto=format&fit=crop" 
                        alt="Team collaborating in an office"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-100/20 to-transparent"></div>
                    <div className="absolute inset-0 p-8">
                       <ProfileWidget />
                       <KpiWidget />
                       <ActivityStreamWidget />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;