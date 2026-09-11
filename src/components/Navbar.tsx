import React from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Bot, 
  Moon, 
  Sun, 
  LogIn, 
  LogOut, 
  Activity, 
  BookOpen, 
  Calculator,
  Cpu
} from 'lucide-react';
import { AiStatus } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: 'home' | 'calculator' | 'nutrition' | 'education' | 'dashboard') => void;
  isLoggedIn: boolean;
  userRole: 'parent' | 'cadre' | 'guest';
  onOpenLogin: () => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenChat: () => void;
  aiStatus: AiStatus;
  selectedProvider: 'gemini' | 'openai';
  onChangeProvider: (provider: 'gemini' | 'openai') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  userRole,
  onOpenLogin,
  onLogout,
  darkMode,
  onToggleDarkMode,
  onOpenChat,
  aiStatus,
  selectedProvider,
  onChangeProvider,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
          id="navbar-brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
            <HeartHandshake className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                GLUCO<span className="text-emerald-600 dark:text-emerald-400">GROW</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                AI Stunting
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
              Nutrisi Cerdas & Pemantauan Balita
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            id="nav-link-home"
            onClick={() => setActiveTab('home')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            Beranda
          </button>
          <button
            id="nav-link-calculator"
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Kalkulator Stunting
          </button>
          <button
            id="nav-link-nutrition"
            onClick={() => setActiveTab('nutrition')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'nutrition'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            Menu AI & Gizi
          </button>
          <button
            id="nav-link-education"
            onClick={() => setActiveTab('education')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'education'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Pusat Edukasi
          </button>
          {isLoggedIn && (
            <button
              id="nav-link-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-blue-500" />
              {userRole === 'cadre' ? 'Rekam Posyandu' : 'Data Anak'}
            </button>
          )}
        </nav>

        {/* Right Tools: AI Model Selector & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Model Switcher Button */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              id="ai-select-gemini"
              onClick={() => onChangeProvider('gemini')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                selectedProvider === 'gemini'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Google Gemini 3.8 Flash (Server-Side)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini
            </button>
            <button
              id="ai-select-openai"
              onClick={() => onChangeProvider('openai')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                selectedProvider === 'openai'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="OpenAI ChatGPT (gpt-4o-mini)"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              ChatGPT
            </button>
          </div>

          {/* Quick Chat Open Button */}
          <button
            id="navbar-open-ai-chat-btn"
            onClick={onOpenChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all"
            title="Buka GlucoBot AI"
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">GlucoBot AI</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle tema gelap/terang"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Auth Button */}
          {isLoggedIn ? (
            <button
              id="navbar-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          ) : (
            <button
              id="navbar-login-btn"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-semibold transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Masuk</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
