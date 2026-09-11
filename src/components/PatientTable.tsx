import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Eye, 
  Bot, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  Edit3, 
  Trash2, 
  X,
  Printer,
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { ChildRecord } from '../types';
import { GrowthChart } from './GrowthChart';

interface PatientTableProps {
  childrenList: ChildRecord[];
  onAddChild: (record: ChildRecord) => void;
  onUpdateChild: (record: ChildRecord) => void;
  onConsultAI: (childContext: any) => void;
  userRole: 'parent' | 'cadre' | 'guest';
}

export const PatientTable: React.FC<PatientTableProps> = ({
  childrenList,
  onAddChild,
  onUpdateChild,
  onConsultAI,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [selectedChild, setSelectedChild] = useState<ChildRecord | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New child form state
  const [newName, setNewName] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');
  const [newHeight, setNewHeight] = useState<number | ''>('');
  const [newWeight, setNewWeight] = useState<number | ''>('');
  const [newNotes, setNewNotes] = useState('');

  // Filtering
  const filtered = childrenList.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Semua' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newDob || newHeight === '' || newWeight === '') return;

    // Calculate approximate age in months
    const dobDate = new Date(newDob);
    const today = new Date();
    const months = Math.max(0, (today.getFullYear() - dobDate.getFullYear()) * 12 + (today.getMonth() - dobDate.getMonth()));

    // Automatic classification
    const stdHeight = newGender === 'L' ? 50 + months * 1.8 : 49 + months * 1.75;
    let status: ChildRecord['status'] = 'Normal';
    if (Number(newHeight) < stdHeight - 4.5) status = 'Stunting';
    else if (Number(newHeight) < stdHeight - 2.5) status = 'Risiko';

    const newRecord: ChildRecord = {
      id: Date.now(),
      name: newName.trim(),
      dob: newDob,
      age: months,
      gender: newGender,
      height: Number(newHeight),
      weight: Number(newWeight),
      status: status,
      notes: newNotes.trim() || 'Pemeriksaan rutin Posyandu.',
      history: [
        {
          date: new Date().toISOString().split('T')[0] as string,
          age: months,
          h: Number(newHeight),
          w: Number(newWeight),
          status: status,
        },
      ],
    };

    onAddChild(newRecord);
    setIsAddingNew(false);
    // Reset form
    setNewName('');
    setNewDob('');
    setNewHeight('');
    setNewWeight('');
    setNewNotes('');
  };

  const statusBadge = (status: ChildRecord['status']) => {
    switch (status) {
      case 'Stunting':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
      case 'Risiko':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Dashboard {userRole === 'cadre' ? 'Kader Posyandu' : 'Pemantauan Balita'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Rekapitulasi Data Tumbuh Kembang
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Daftar pemantauan antropometri balita untuk deteksi dini dan intervensi gizi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Cetak Laporan</span>
          </button>

          <button
            id="add-patient-btn"
            onClick={() => setIsAddingNew(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Balita</span>
          </button>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 font-medium">Total Balita Terdata</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {childrenList.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-900/50">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Risiko Stunting</span>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {childrenList.filter((c) => c.status === 'Risiko').length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50">
          <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">Terindikasi Stunting</span>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {childrenList.filter((c) => c.status === 'Stunting').length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama balita..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['Semua', 'Normal', 'Risiko', 'Stunting'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/75 dark:bg-slate-900/60 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Balita</th>
                <th className="py-3.5 px-4">Usia & Gender</th>
                <th className="py-3.5 px-4">TB / BB Terkini</th>
                <th className="py-3.5 px-4">Status Gizi</th>
                <th className="py-3.5 px-4">Catatan</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium text-slate-700 dark:text-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    Tidak ada data balita yang cocok.
                  </td>
                </tr>
              ) : (
                filtered.map((child) => (
                  <tr key={child.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {child.name}
                      </div>
                      <span className="text-[11px] text-slate-400">DOB: {child.dob}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold">{child.age} Bulan</span>
                      <span className="text-slate-400 ml-1">({child.gender === 'L' ? 'L' : 'P'})</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                      {child.height} cm / {child.weight} kg
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${statusBadge(child.status)}`}>
                        {child.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-500 text-[11px]">
                      {child.notes || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedChild(child)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Lihat Detail & Grafik"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => onConsultAI({
                            name: child.name,
                            age: child.age,
                            height: child.height,
                            weight: child.weight,
                            status: child.status,
                          })}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Konsultasi AI untuk Balita Ini"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>AI</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Child Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Tambah Data Balita Baru
              </h3>
              <button
                onClick={() => setIsAddingNew(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewChild} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Balita *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tanggal Lahir *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDob}
                    onChange={(e) => setNewDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tinggi Badan (cm) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Contoh: 75"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Berat Badan (kg) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Contoh: 8.5"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Posyandu / Riwayat Gizi
                </label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Contoh: ASI eksklusif, nafsu makan baik, suka makan telur"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Simpan Balita
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Child Detail & Chart Modal */}
      {selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-black">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                    {selectedChild.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Usia: {selectedChild.age} Bulan ({selectedChild.gender === 'L' ? 'Laki-laki' : 'Perempuan'}) • Lahir: {selectedChild.dob}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedChild(null)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Tinggi Terkini</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedChild.height} cm
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Berat Terkini</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedChild.weight} kg
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Status Stunting</span>
                <div className="text-base font-bold mt-0.5 text-emerald-600">
                  {selectedChild.status}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                <span className="text-[11px] text-slate-400">Jumlah Pengukuran</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedChild.history?.length || 1} kali
                </div>
              </div>
            </div>

            {/* Embedded Responsive Growth Chart */}
            <GrowthChart
              history={selectedChild.history || []}
              childName={selectedChild.name}
              gender={selectedChild.gender}
            />

            {/* Notes & Actions */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700 space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Catatan Kader / Dokter:</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedChild.notes || 'Belum ada catatan khusus.'}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  const childContext = {
                    name: selectedChild.name,
                    age: selectedChild.age,
                    height: selectedChild.height,
                    weight: selectedChild.weight,
                    status: selectedChild.status,
                  };
                  setSelectedChild(null);
                  onConsultAI(childContext);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>Konsultasikan Rekomendasi Menu ke GlucoBot</span>
              </button>

              <button
                onClick={() => setSelectedChild(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
