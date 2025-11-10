import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Email is required.');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Password reset for:', { email });
      setMessage('If an account exists, a password reset link has been sent.');
      setEmail('');
    }, 1500);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
          <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob" style={{ animationDelay: '6s' }}></div>
      </div>

       <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-lg rounded-[40px] shadow-2xl p-10 z-10 animate-fade-in">
        <div className="mb-8 text-center animate-fade-in" style={{ animationDelay: '0.1s'}}>
             <h1 className="text-4xl font-bold text-slate-800">Forgot Password</h1>
             <p className="text-slate-600 mt-3">No worries, we'll send you reset instructions.</p>
        </div>
        
        <form onSubmit={handleReset} className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s'}}>
            <Input
            label="Email address"
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            />

            {error && <p className="text-sm text-red-500 text-center !mt-4">{error}</p>}
            {message && <p className="text-sm text-green-600 text-center !mt-4">{message}</p>}

            <div className="pt-2">
            <Button type="submit" isLoading={isLoading} className="w-full">
                Send Reset Link
            </Button>
            </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 animate-fade-in" style={{ animationDelay: '0.3s'}}>
            <Link to="/login" className="font-bold text-slate-800 hover:underline flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m15 18-6-6 6-6"/></svg>
              Back to Sign In
            </Link>
        </p>
       </div>
    </main>
  );
};

export default ForgotPasswordPage;
