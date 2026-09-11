import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  Utensils, 
  Egg, 
  Fish, 
  Apple, 
  Flame, 
  Clock, 
  RotateCw, 
  CheckCircle,
  ChefHat
} from 'lucide-react';
import { NUTRITION_FOODS } from '../data/mockData';

interface NutritionMenuGeneratorProps {
  selectedProvider: 'gemini' | 'openai';
  onConsultAI: (query: string) => void;
}

export const NutritionMenuGenerator: React.FC<NutritionMenuGeneratorProps> = ({
  selectedProvider,
  onConsultAI,
}) => {
  const [selectedAgeStage, setSelectedAgeStage] = useState<'6-8' | '9-11' | '12-23' | '24+'>('9-11');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMenu, setGeneratedMenu] = useState<string | null>(null);
  const [preference, setPreference] = useState<'normal' | 'ikan' | 'telur' | 'sayur'>('normal');

  const ageLabels = {
    '6-8': '6 - 8 Bulan (Tekstur Saring / Lumat)',
    '9-11': '9 - 11 Bulan (Tekstur Cincang Halus / Lembek)',
    '12-23': '12 - 23 Bulan (Menu Keluarga Berserat Halus)',
    '24+': '2 - 5 Tahun (Menu Balita Mandiri)',
  };

  const handleGenerateAiMenu = async () => {
    setIsGenerating(true);
    const prompt = `Buatkan jadwal menu harian MPASI/makanan padat gizi untuk anak usia ${ageLabels[selectedAgeStage]}. 
Fokus utama: pencegahan stunting dengan prioritas protein hewani (telur, ikan lokal, hati ayam/sapi, atau ayam), bahan pangan lokal yang mudah dan murah didapat di pasar tradisional Indonesia.
Sertakan menu:
- Makan Pagi
- Selingan Pagi
- Makan Siang
- Selingan Sore
- Makan Malam
Beserta tips tekstur dan penambahan lemak sehat. Jawab langsung secara ringkas, rapi dan bernutrisi tinggi.`;

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          provider: selectedProvider,
        }),
      });

      if (!response.ok) throw new Error('Gagal membuat menu');
      const data = await response.json();
      setGeneratedMenu(data.reply || 'Berhasil menyusun menu gizi seimbang.');
    } catch (err) {
      console.error(err);
      // Clean fallback menu
      setGeneratedMenu(`**Menu MPASI Padat Gizi Harian (${ageLabels[selectedAgeStage]}):**

- **Pagi (07.00):** Bubur Beras Hati Ayam + Parutan Labu Siam + 1 sdt Minyak Kelapa Murni (Kaya zat besi & vitamin A).
- **Selingan Pagi (09.30):** Puree Alpukat Matang dengan sedikit ASI/kuah hangat.
- **Siang (12.00):** Nasi Tim Lembek Ikan Kembung Kukus + Tahu Cincang + Kuah Kaldu Ayam Bening (Tinggi Omega-3 DHA).
- **Selingan Sore (15.30):** Puding Telur Kukus Susu Gurih / Pisang Lumat.
- **Malam (18.30):** Bubur Beras Telur Puyuh Rebus Hancur + Wortel Cincang + Santan Segar.

*Tips: Pastikan selalu menambahkan 1 sendok teh minyak/santan pada makanan utama untuk mencukupi kebutuhan kalori balita.*`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Nutritionist & Generator Menu</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Panduan Menu Gizi Tinggi Protein Hewani
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          WHO dan Kemenkes menegaskan kunci utama pencegahan gagal tumbuh adalah ketersediaan protein hewani di setiap porsi makan anak.
        </p>
      </div>

      {/* Generator Control Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Generator Menu Harian Personalisasi AI
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ditenagai oleh {selectedProvider === 'gemini' ? 'Google Gemini 3.8 Flash' : 'OpenAI ChatGPT'}
            </p>
          </div>

          {/* Age Group Pills */}
          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl">
            {(['6-8', '9-11', '12-23', '24+'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setSelectedAgeStage(stage)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAgeStage === stage
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {stage === '24+' ? '2 - 5 Thn' : `${stage} Bln`}
              </button>
            ))}
          </div>
        </div>

        {/* Action Trigger */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            Kategori Terpilih: <strong className="text-emerald-600 dark:text-emerald-400">{ageLabels[selectedAgeStage]}</strong>
          </div>

          <button
            id="generate-ai-menu-btn"
            onClick={handleGenerateAiMenu}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Menyusun Menu AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Buat Menu MPASI Harian</span>
              </>
            )}
          </button>
        </div>

        {/* AI Output Box */}
        {generatedMenu && (
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 animate-in fade-in space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>Menu Rekomendasi GlucoBot AI</span>
              </div>
              <button
                onClick={() => onConsultAI(`Bisa beri resep rinci cara memasak menu ini untuk anak usia ${selectedAgeStage} bulan?`)}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Tanya Cara Masak &rarr;
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {generatedMenu}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Superfood Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          Pilar Pangan Padat Nutrisi Pencegah Stunting
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NUTRITION_FOODS.map((food, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-500/50 transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {food.desc}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1.5">
                    {food.name}
                  </h4>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                  {index === 0 ? <Flame className="w-4 h-4" /> : index === 1 ? <Egg className="w-4 h-4" /> : <Fish className="w-4 h-4" />}
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {food.benefit}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Porsi: <strong>{food.portion}</strong></span>
                <button
                  onClick={() => onConsultAI(`Berapa takaran aman konsumsi ${food.name} untuk balita?`)}
                  className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                >
                  Konsultasi
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
