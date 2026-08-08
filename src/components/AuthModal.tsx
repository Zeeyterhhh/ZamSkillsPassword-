import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { fetchJson } from '../lib/api';
import { Award, Building2, User as UserIcon, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'reset'>(initialMode);
  const [role, setRole] = useState<UserRole>('youth');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('password123');
  const [resetSent, setResetSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'reset') {
      setResetSent(true);
      return;
    }

    setLoading(true);

    if (mode === 'login') {
      fetchJson<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email })
      })
        .then((data) => {
          onSuccess(data.user);
          onClose();
        })
        .catch((err) => setErrorMsg(err.message))
        .finally(() => setLoading(false));
    } else {
      fetchJson<{ user: User }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          role,
          fullName,
          phone
        })
      })
        .then((data) => {
          onSuccess(data.user);
          onClose();
        })
        .catch((err) => setErrorMsg(err.message))
        .finally(() => setLoading(false));
    }
  };

  const handleQuickDemoFill = (type: 'youth' | 'employer' | 'admin') => {
    if (type === 'youth') {
      setEmail('aminu.gusau@gmail.com');
      setMode('login');
    } else if (type === 'employer') {
      setEmail('hr@zamfaratechhub.ng');
      setMode('login');
    } else {
      setEmail('admin@skills.zamfara.gov.ng');
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-8 space-y-5 shadow-2xl border border-slate-200 relative my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md">
            <Award className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            {mode === 'login' ? 'Sign In to Skills Passport' : mode === 'register' ? 'Create Your Account' : 'Password Reset'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login' ? 'Access your digital passport or employer dashboard' : 'Join the Zamfara youth competency ecosystem'}
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-2 text-center text-xs">
          <span className="font-bold text-amber-900 block">Quick Demo One-Click Sign In:</span>
          <div className="flex justify-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoFill('youth')}
              className="bg-white text-emerald-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 text-[11px]"
            >
              Demo Youth
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('employer')}
              className="bg-white text-emerald-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 text-[11px]"
            >
              Demo Employer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoFill('admin')}
              className="bg-white text-emerald-950 font-bold px-2.5 py-1 rounded-lg border border-amber-300 text-[11px]"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        {mode === 'reset' && resetSent ? (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs text-center space-y-2">
            <p className="font-bold">Password Reset Request Processed!</p>
            <p>If an account exists for {email}, instructions have been dispatched.</p>
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs font-bold text-emerald-800 underline"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select User Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('youth')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 ${
                      role === 'youth' ? 'bg-emerald-800 text-amber-300 border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Youth Jobseeker</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all flex flex-col items-center gap-1 ${
                      role === 'employer' ? 'bg-emerald-800 text-amber-300 border-emerald-800' : 'bg-slate-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Employer / Org</span>
                  </button>
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name / Organization Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aminu Bello Gusau or Zamfara Tech Hub"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aminu.gusau@gmail.com"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 803 123 4567"
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800"
                />
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800"
              />
            </div>

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-[11px] font-medium text-emerald-800 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl shadow transition-colors"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Register Account' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Footer Toggle */}
        <div className="text-center pt-2 border-t border-slate-200 text-xs text-slate-600">
          {mode === 'login' ? (
            <p>
              Don’t have an account yet?{' '}
              <button onClick={() => setMode('register')} className="font-bold text-emerald-800 hover:underline">
                Register Free
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button onClick={() => setMode('login')} className="font-bold text-emerald-800 hover:underline">
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};
