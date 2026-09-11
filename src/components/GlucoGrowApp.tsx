import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  MessageSquare, 
  Activity, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { GrowthCalculator } from './GrowthCalculator';
import { GrowthChart } from './GrowthChart';
import { NutritionMenuGenerator } from './NutritionMenuGenerator';
import { EducationSection } from './EducationSection';
import { PatientTable } from './PatientTable';
import { AiChatbotDrawer } from './AiChatbotDrawer';
import { LoginModal } from './LoginModal';
import { INITIAL_CHILDREN } from '../data/mockData';
import { ChildRecord, AiStatus } from '../types';

export default function GlucoGrowApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'calculator' | 'nutrition' | 'education' | 'dashboard'>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'parent' | 'cadre' | 'guest'>('guest');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Provider State (default Gemini, with OpenAI toggle)
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'openai'>('gemini');
  const [aiStatus, setAiStatus] = useState<AiStatus>({
    gemini: { available: true, model: 'gemini-3.8-flash' },
    openai: { available: false, model: 'gpt-4o-mini' },
    activeProvider: 'gemini',
  });

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Patient / Children State
  const [childrenList, setChildrenList] = useState<ChildRecord[]>(INITIAL_CHILDREN);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state after hydration (browser only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('glucogrow_children');
      if (saved) setChildrenList(JSON.parse(saved));
    } catch (e) {
      console.warn('LocalStorage load error:', e);
    }
    setDarkMode(window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
    setHydrated(true);
  }, []);

  // Persist children records
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('glucogrow_children', JSON.stringify(childrenList));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [childrenList, hydrated]);

  // Sync Dark Mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check Backend AI Status
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.providers) {
          setAiStatus({
            gemini: data.providers.gemini || { available: true, model: 'gemini-3.8-flash' },
            openai: data.providers.openai || { available: false, model: 'gpt-4o-mini' },
            activeProvider: data.activeProvider || 'gemini',
          });
          if (data.activeProvider) {
            setSelectedProvider(data.activeProvider);
          }
        }
      })
      .catch((err) => {
        console.warn('Health check fallback:', err);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLoginSuccess = (role: 'parent' | 'cadre') => {
    setIsLoggedIn(true);
    setUserRole(role);
    showToast(`Berhasil masuk sebagai ${role === 'parent' ? 'Orang Tua' : 'Tenaga Kesehatan / Kader'}!`);
    if (role === 'cadre') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('guest');
    setActiveTab('home');
    showToast('Anda telah keluar dari akun.');
  };

  const handleConsultAI = (context: any) => {
    setChatContext(context);
    setIsChatOpen(true);
  };

  const handleAddChild = (child: ChildRecord) => {
    setChildrenList((prev) => [child, ...prev]);
    showToast(`Data balita ${child.name} berhasil disimpan!`);
  };

  const handleUpdateChild = (child: ChildRecord) => {
    setChildrenList((prev) => prev.map((c) => (c.id === child.id ? child : c)));
    showToast(`Data ${child.name} diperbarui.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl border border-emerald-500/40 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenChat={() => {
          setChatContext(null);
          setIsChatOpen(true);
        }}
        aiStatus={aiStatus}
        selectedProvider={selectedProvider}
        onChangeProvider={(p) => {
          setSelectedProvider(p);
          showToast(`Mesin AI dialihkan ke ${p === 'gemini' ? 'Google Gemini 3.8 Flash' : 'OpenAI ChatGPT'}`);
        }}
      />

      {/* Active Tab View Rendering */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-12 pb-16">
            <HeroSection
              onStartCalculator={() => setActiveTab('calculator')}
              onOpenAI={() => {
                setChatContext(null);
                setIsChatOpen(true);
              }}
              onOpenEducation={() => setActiveTab('education')}
              selectedProvider={selectedProvider}
            />

            {/* Quick Teaser of Growth Curve & Calculator */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Pemantauan Kontinu</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                    Pantau Kurva Tumbuh Sesuai Standar Acuan WHO
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    Setiap milimeter tinggi badan dan gram berat badan anak dicatat untuk mendeteksi dini jika grafik pertumbuhan mulai melandai atau berada di bawah garis -2 Standar Deviasi.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('calculator')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Buka Kalkulator Antropometri</span>
                      &rarr;
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <GrowthChart
                    history={childrenList[0]?.history || []}
                    childName={childrenList[0]?.name || 'Aisyah'}
                    gender={childrenList[0]?.gender || 'P'}
                  />
                </div>
              </div>
            </div>

            {/* Nutrition Menu Teaser */}
            <NutritionMenuGenerator
              selectedProvider={selectedProvider}
              onConsultAI={(q) => handleConsultAI({ query: q })}
            />
          </div>
        )}

        {activeTab === 'calculator' && (
          <GrowthCalculator
            onConsultAI={handleConsultAI}
            onSaveChildRecord={handleAddChild}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionMenuGenerator
            selectedProvider={selectedProvider}
            onConsultAI={(q) => handleConsultAI({ query: q })}
          />
        )}

        {activeTab === 'education' && (
          <EducationSection
            onConsultAI={(topic) => handleConsultAI({ topic })}
          />
        )}

        {activeTab === 'dashboard' && (
          <PatientTable
            childrenList={childrenList}
            onAddChild={handleAddChild}
            onUpdateChild={handleUpdateChild}
            onConsultAI={handleConsultAI}
            userRole={userRole}
          />
        )}
      </main>

      {/* Floating GlucoBot AI Assistant Trigger */}
      <button
        id="floating-ai-chatbot-btn"
        onClick={() => {
          setChatContext(null);
          setIsChatOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition-all hover:scale-105 cursor-pointer"
        aria-label="Buka GlucoBot AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-300 animate-ping"></span>
        </div>
        <span className="hidden sm:inline">Tanya GlucoBot AI</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 text-white font-mono uppercase">
          {selectedProvider === 'gemini' ? 'Gemini' : 'ChatGPT'}
        </span>
      </button>

      {/* Dedicated GlucoBot AI Drawer */}
      <AiChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedProvider={selectedProvider}
        onChangeProvider={setSelectedProvider}
        initialContext={chatContext}
      />

      {/* Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <HeartHandshake className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">GLUCOGROW</span>
            <span>• Platform Nutrisi Cerdas & Pencegahan Stunting</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Standar WHO & Kemenkes RI</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Terintegrasi Gemini & ChatGPT
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
