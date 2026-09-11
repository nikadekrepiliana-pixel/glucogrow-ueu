import React, { useState } from 'react';
import { 
  Calculator, 
  Bot, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  RotateCcw, 
  ArrowRight, 
  BookmarkPlus,
  Scale,
  Ruler
} from 'lucide-react';
import { ChildRecord } from '../types';

interface GrowthCalculatorProps {
  onConsultAI: (childContext: {
    name: string;
    age: number;
    gender: string;
    height: number;
    weight: number;
    status: string;
  }) => void;
  onSaveChildRecord?: (record: ChildRecord) => void;
}

export const GrowthCalculator: React.FC<GrowthCalculatorProps> = ({
  onConsultAI,
  onSaveChildRecord,
}) => {
  const [childName, setChildName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [ageMonths, setAgeMonths] = useState<number | ''>(12);
  const [height, setHeight] = useState<number | ''>(74);
  const [weight, setWeight] = useState<number | ''>(8.8);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Calculate WHO standard median and standard deviations
  const age = typeof ageMonths === 'number' ? ageMonths : 0;
  const currentH = typeof height === 'number' ? height : 0;
  const currentW = typeof weight === 'number' ? weight : 0;

  // WHO approximate median formulas for 0-60 months
  const medianHeight = gender === 'L'
    ? (age <= 12 ? 49.9 + (age * 2.15) : 75.7 + ((age - 12) * 0.72))
    : (age <= 12 ? 49.1 + (age * 2.08) : 74.0 + ((age - 12) * 0.73));

  const sdHeight = gender === 'L'
    ? (age <= 12 ? 2.1 + (age * 0.08) : 3.0 + ((age - 12) * 0.04))
    : (age <= 12 ? 2.0 + (age * 0.08) : 2.9 + ((age - 12) * 0.04));

  const medianWeight = gender === 'L'
    ? (age <= 12 ? 3.3 + (age * 0.55) : 9.6 + ((age - 12) * 0.18))
    : (age <= 12 ? 3.2 + (age * 0.52) : 8.9 + ((age - 12) * 0.18));

  const sdWeight = gender === 'L'
    ? (age <= 12 ? 0.6 + (age * 0.05) : 1.2 + ((age - 12) * 0.03))
    : (age <= 12 ? 0.55 + (age * 0.05) : 1.15 + ((age - 12) * 0.03));

  // Z-Score TB/U
  const zHeight = currentH > 0 && sdHeight > 0
    ? Number(((currentH - medianHeight) / sdHeight).toFixed(2))
    : 0;

  // Z-Score BB/U
  const zWeight = currentW > 0 && sdWeight > 0
    ? Number(((currentW - medianWeight) / sdWeight).toFixed(2))
    : 0;

  // Classification based on WHO Standard
  let stuntingStatus: 'Normal' | 'Risiko' | 'Stunting' = 'Normal';
  let statusColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200';
  let recommendationSummary = '';

  if (zHeight < -3.0) {
    stuntingStatus = 'Stunting';
    statusColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
    badgeColor = 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200';
    recommendationSummary = 'Tinggi badan anak berada di bawah -3 SD (Sangat Pendek). Sangat disarankan segera periksakan ke Puskesmas/Dokter Spesialis Anak untuk intervensi gizi intensif dan evaluasi infeksi berulang.';
  } else if (zHeight < -2.0) {
    stuntingStatus = 'Risiko';
    statusColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200';
    recommendationSummary = 'Tinggi badan anak berada di rentang -2 hingga -3 SD (Pendek / Berisiko). Tambahkan asupan 1-2 butir telur dan lauk protein hewani seperti hati ayam dan ikan setiap hari untuk mengejar pertumbuhan.';
  } else {
    stuntingStatus = 'Normal';
    recommendationSummary = 'Pertumbuhan tinggi badan anak berada dalam rentang normal WHO (-2 SD hingga +3 SD). Teruskan pemberian variasi makanan bergizi seimbang dan ASI/makanan pendamping.';
  }

  const handleReset = () => {
    setChildName('');
    setAgeMonths(12);
    setHeight(74);
    setWeight(8.8);
    setSavedSuccess(false);
  };

  const handleSaveToRecord = () => {
    if (!onSaveChildRecord) return;
    const newRecord: ChildRecord = {
      id: Date.now(),
      name: childName.trim() || 'Balita Baru',
      dob: new Date(Date.now() - (Number(ageMonths || 0) * 30.4 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
      age: Number(ageMonths || 0),
      gender: gender,
      height: Number(height || 0),
      weight: Number(weight || 0),
      status: stuntingStatus,
      notes: `Kalkulasi Z-Score: TB/U ${zHeight} SD, BB/U ${zWeight} SD.`,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          age: Number(ageMonths || 0),
          h: Number(height || 0),
          w: Number(weight || 0),
          status: stuntingStatus,
        },
      ],
    };
    onSaveChildRecord(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendToAI = () => {
    onConsultAI({
      name: childName.trim() || 'Anak',
      age: Number(ageMonths || 0),
      gender: gender === 'L' ? 'Laki-laki' : 'Perempuan',
      height: Number(height || 0),
      weight: Number(weight || 0),
      status: stuntingStatus,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5" />
          <span>Kalkulator Antropometri WHO</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Deteksi Dini Status Gizi & Risiko Stunting
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Masukkan usia, jenis kelamin, serta ukuran tinggi dan berat badan anak untuk mengetahui Z-score kurva standar WHO secara instan.
        </p>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Input Parameters */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Data Pengukuran Balita
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              title="Reset Formulir"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Nama Anak */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Balita (Opsional)
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Contoh: Aisyah / Budi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Jenis Kelamin
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('L')}
                  className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    gender === 'L'
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>👦 Laki-laki</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('P')}
                  className={`py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    gender === 'P'
                      ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-500 text-pink-700 dark:text-pink-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span>👧 Perempuan</span>
                </button>
              </div>
            </div>

            {/* Usia dalam Bulan */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Usia Anak (Bulan)
                </label>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {age} Bulan {age >= 12 ? `(${Math.floor(age / 12)} thn ${age % 12} bln)` : ''}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={ageMonths === '' ? 0 : ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="w-full accent-emerald-600 mb-2 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(e.target.value === '' ? '' : Math.max(0, Math.min(60, Number(e.target.value))))}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-center"
                />
                <span className="text-xs text-slate-500">Bulan (Rentang 0 - 60 Bulan)</span>
              </div>
            </div>

            {/* Tinggi / Panjang Badan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Panjang / Tinggi Badan (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="40"
                  max="130"
                  value={height}
                  onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Contoh: 74.5"
                  className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  cm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                *Anak di bawah 2 tahun diukur terlentang (panjang badan).
              </p>
            </div>

            {/* Berat Badan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Berat Badan (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="40"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Contoh: 8.5"
                  className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-emerald-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Immediate Results & AI Consultation */}
        <div className="lg:col-span-6 space-y-4">
          <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-all ${statusColor}`}>
            <div className="flex items-center justify-between pb-4 border-b border-current/15">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                  Status Gizi TB/U (Tinggi menurut Usia)
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold mt-0.5">
                  {stuntingStatus === 'Normal' ? 'Normal (Tumbuh Optimal)' : stuntingStatus === 'Risiko' ? 'Pendek (Risiko Stunting)' : 'Stunting (Sangat Pendek)'}
                </h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${badgeColor}`}>
                {stuntingStatus}
              </span>
            </div>

            {/* Score Comparison Cards */}
            <div className="grid grid-cols-2 gap-3 my-6">
              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-current/10 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Z-Score TB/U
                </span>
                <div className="text-xl sm:text-2xl font-black mt-1">
                  {zHeight > 0 ? `+${zHeight}` : zHeight} <span className="text-xs font-normal">SD</span>
                </div>
                <span className="text-[11px] opacity-75">
                  Median WHO: {medianHeight.toFixed(1)} cm
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-current/10 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Z-Score BB/U
                </span>
                <div className="text-xl sm:text-2xl font-black mt-1">
                  {zWeight > 0 ? `+${zWeight}` : zWeight} <span className="text-xs font-normal">SD</span>
                </div>
                <span className="text-[11px] opacity-75">
                  Median WHO: {medianWeight.toFixed(1)} kg
                </span>
              </div>
            </div>

            {/* Recommendation Summary */}
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-current/10 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {stuntingStatus === 'Normal' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                )}
                <span>Rekomendasi Medis & Gizi</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {recommendationSummary}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-2.5">
              <button
                id="calc-consult-ai-btn"
                onClick={handleSendToAI}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Konsultasikan ke GlucoBot AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onSaveChildRecord && (
                <button
                  id="calc-save-record-btn"
                  onClick={handleSaveToRecord}
                  className="py-3 px-4 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-emerald-600" />
                  <span>{savedSuccess ? 'Tersimpan!' : 'Simpan Data'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Informative Card */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong>Bagaimana Z-Score dibaca?</strong> Nilai Z-score mengukur seberapa jauh pertumbuhan balita dari median populasi acuan standar WHO. Skor di bawah -2 SD menunjukkan keterlambatan pertumbuhan yang butuh perhatian nutrisi khusus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
