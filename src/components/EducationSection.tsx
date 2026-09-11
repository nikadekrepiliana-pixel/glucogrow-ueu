import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  X, 
  Bot, 
  Syringe, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import { ArticleItem } from '../types';
import { ARTICLES_DATA, IMMUNIZATION_LIST } from '../data/mockData';

interface EducationSectionProps {
  onConsultAI: (topic: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ onConsultAI }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [readingArticle, setReadingArticle] = useState<ArticleItem | null>(null);

  const categories = ['Semua', 'Perkembangan', 'Nutrisi', 'Parenting', 'Imunisasi'];

  const filteredArticles = selectedCategory === 'Semua'
    ? ARTICLES_DATA
    : ARTICLES_DATA.filter((a) => a.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Pusat Edukasi Medis & Gizi</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Panduan Resmi Pencegahan Stunting
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Informasi tervalidasi berbasis panduan World Health Organization (WHO) dan Kementerian Kesehatan Republik Indonesia.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col hover:shadow-md transition-shadow group"
          >
            <div className="relative h-44 overflow-hidden bg-slate-100">
              <img
                src={article.img}
                alt={article.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                {article.category}
              </span>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-900/75 text-white text-[10px] flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  {article.source}
                </span>
                <button
                  onClick={() => setReadingArticle(article)}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Baca</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Immunization Tracker & Schedule Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Syringe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Jadwal Imunisasi Dasar Lengkap (Kemenkes RI)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Imunisasi lengkap melindungi balita dari infeksi parah yang merupakan pemicu utama stunting sekunder.
            </p>
          </div>

          <button
            onClick={() => onConsultAI('Jelaskan mengapa anak yang tidak divaksin lebih berisiko mengalami stunting?')}
            className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Tanya AI tentang Vaksin</span>
          </button>
        </div>

        {/* Table of Immunizations */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3">Vaksin / Antigen</th>
                <th className="py-3 px-3">Jadwal Usia</th>
                <th className="py-3 px-3">Manfaat Perlindungan</th>
                <th className="py-3 px-3 text-right">Status Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200 font-medium">
              {IMMUNIZATION_LIST.map((vax, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {vax.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold">
                      {vax.age}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {vax.desc}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <CheckCircle className="w-3 h-3" /> Wajib Nasional
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reading Modal */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 relative">
            <button
              onClick={() => setReadingArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-56 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden relative">
              <img
                src={readingArticle.img}
                alt={readingArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  {readingArticle.category}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Sumber: <strong>{readingArticle.source}</strong></span>
                <span>•</span>
                <span>{readingArticle.readTime} membaca</span>
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {readingArticle.title}
              </h2>

              <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap space-y-3">
                {readingArticle.content}
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    const topic = readingArticle.title;
                    setReadingArticle(null);
                    onConsultAI(`Bisa jelaskan lebih dalam mengenai ${topic}?`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>Tanyakan Topik Ini ke GlucoBot AI</span>
                </button>

                <button
                  onClick={() => setReadingArticle(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
                >
                  Tutup Artikel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
