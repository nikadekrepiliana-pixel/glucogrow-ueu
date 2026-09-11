import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  ShieldCheck, 
  HeartPulse, 
  Apple, 
  LineChart, 
  Users,
  CheckCircle2
} from 'lucide-react';

interface HeroSectionProps {
  onStartCalculator: () => void;
  onOpenAI: () => void;
  onOpenEducation: () => void;
  selectedProvider: 'gemini' | 'openai';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCalculator,
  onOpenAI,
  onOpenEducation,
  selectedProvider,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-300/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-blue-300/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading, Value Prop, CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300/50 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Didukung AI Terbuka: Google Gemini & OpenAI ChatGPT</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Cegah Stunting Balita dengan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                Nutrisi Cerdas & AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Pantau tumbuh kembang balita sesuai standar kurva WHO & Kemenkes RI. Dapatkan deteksi dini risiko stunting dan rekomendasi menu MPASI padat gizi berbasis bahan pangan lokal dari <strong>GlucoBot AI</strong>.
            </p>

            {/* Feature Highlights Bullet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Kalkulator Z-Score WHO (TB/U & BB/U)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Pilihan Mesin: Gemini 3.8 & GPT-4o mini</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Generator Menu MPASI Kaya Protein Hewani</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Format Rekam Posyandu & Edukasi 1000 HPK</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-calc-cta"
                onClick={onStartCalculator}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all hover:-translate-y-0.5"
              >
                <span>Cek Risiko Stunting Balita</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-ai-chat-cta"
                onClick={onOpenAI}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/80 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-xs flex items-center gap-2 transition-all"
              >
                <Bot className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Konsultasi GlucoBot AI</span>
              </button>

              <button
                id="hero-edu-cta"
                onClick={onOpenEducation}
                className="px-4 py-3.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                Pelajari 1000 HPK
              </button>
            </div>
          </div>

          {/* Right Column: Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-white dark:bg-slate-800/90 rounded-3xl p-6 shadow-xl border border-slate-200/80 dark:border-slate-700/80">
              {/* Header inside Card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Status Gizi Anak Indonesia
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Standar Antropometri Kemenkes RI
                    </p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  WHO 2024
                </span>
              </div>

              {/* Sample Quick Metrics */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Periode Kritis</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">1.000 HPK</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Usia 0 - 24 Bulan</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Target Nasional</span>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">&lt; 14%</div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Penurunan Stunting</span>
                </div>
              </div>

              {/* Interactive Preview of AI Recommendation */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Insight Cerdas GlucoBot
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300">
                    {selectedProvider === 'gemini' ? 'Gemini 3.8 Flash' : 'OpenAI ChatGPT'}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed italic">
                  &ldquo;1 butir telur dan 40g hati ayam cincang per hari memberikan 100% kebutuhan zat besi & kolin balita untuk merangsang hormon pertumbuhan secara maksimal.&rdquo;
                </p>
              </div>

              {/* Card Footer Button */}
              <button
                onClick={onStartCalculator}
                className="w-full mt-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Mulai Simulasi Antropometri</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
