import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  LogIn, 
  ShieldCheck, 
  UserCheck, 
  HeartHandshake,
  KeyRound
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: 'parent' | 'cadre') => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'parent' | 'cadre'>('parent');
  const [username, setUsername] = useState('orangtua');
  const [password, setPassword] = useState('12345');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSwitchTab = (tab: 'parent' | 'cadre') => {
    setActiveTab(tab);
    setErrorMsg('');
    if (tab === 'parent') {
      setUsername('orangtua');
      setPassword('12345');
    } else {
      setUsername('admin');
      setPassword('54321');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'parent') {
      if (username === 'orangtua' && password === '12345') {
        onLoginSuccess('parent');
        onClose();
      } else {
        setErrorMsg('Username atau password orang tua tidak sesuai. Gunakan orangtua / 12345.');
      }
    } else {
      if (username === 'admin' && password === '54321') {
        onLoginSuccess('cadre');
        onClose();
      } else {
        setErrorMsg('Username atau password tenaga kesehatan salah. Gunakan admin / 54321.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 font-bold shadow-xs">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Akses Akun GlucoGrow
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Masuk untuk memantau tumbuh kembang balita atau rekapitulasi Posyandu.
          </p>

          {/* Role Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl mt-6">
            <button
              type="button"
              onClick={() => handleSwitchTab('parent')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'parent'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Orang Tua
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab('cadre')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'cadre'
                  ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Tenaga Kesehatan / Kader
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Info */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kredensial Demo Instan:</span>
            </div>
            {activeTab === 'parent' ? (
              <p>Username: <code className="text-emerald-600 font-bold">orangtua</code> | Password: <code className="text-emerald-600 font-bold">12345</code></p>
            ) : (
              <p>Username: <code className="text-emerald-600 font-bold">admin</code> | Password: <code className="text-emerald-600 font-bold">54321</code></p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            Masuk ke Akun
          </button>
        </form>
      </div>
    </div>
  );
};
