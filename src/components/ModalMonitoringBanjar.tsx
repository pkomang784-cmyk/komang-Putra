import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  MessageSquare, 
  Printer, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  Edit3, 
  Send,
  Sparkles,
  Search,
  Filter,
  Check,
  UserCheck,
  Calendar,
  CreditCard,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AppUser, 
  Pelanggan, 
  PengurusBanjar, 
  LogUpdateBanjar,
  StatusSetoranBanjar 
} from '../types';
import { formatRupiah } from '../utils/formatters';
import { DAFTAR_BANJAR_PETUGAS } from '../data/defaultData';

interface ModalMonitoringBanjarProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  pelangganList: Pelanggan[];
  periode: string;
  pengurusList: PengurusBanjar[];
  logsList: LogUpdateBanjar[];
  onVerifikasiSetoran: (banjarId: string) => void;
  onUpdatePengurus: (updated: PengurusBanjar) => void;
  onSubmitSetoranBanjar: (banjar: string, nominal: number, metode: 'Transfer Rekening Kas Pusat' | 'Setor Tunai Langsung' | 'QRIS Kas', catatan: string) => void;
  onSelectBanjarFilter: (banjar: string) => void;
}

export const ModalMonitoringBanjar: React.FC<ModalMonitoringBanjarProps> = ({
  isOpen,
  onClose,
  currentUser,
  pelangganList = [],
  periode = '',
  pengurusList = [],
  logsList = [],
  onVerifikasiSetoran,
  onUpdatePengurus,
  onSubmitSetoranBanjar,
  onSelectBanjarFilter = (_banjar: string) => {},
}) => {
  const [activeTab, setActiveTab] = useState<'monitoring' | 'logs' | 'pengurus' | 'setor'>('monitoring');
  const [logFilterBanjar, setLogFilterBanjar] = useState<string>('ALL');
  const [editingPengurus, setEditingPengurus] = useState<PengurusBanjar | null>(null);

  // Setoran form state
  const [setorBanjar, setSetorBanjar] = useState<string>(
    currentUser?.rtRw && currentUser.rtRw.includes('Banjar') ? currentUser.rtRw : 'Banjar 01 - Made Wirawan'
  );
  const [setorNominal, setSetorNominal] = useState<number>(100000);
  const [setorMetode, setSetorMetode] = useState<'Transfer Rekening Kas Pusat' | 'Setor Tunai Langsung' | 'QRIS Kas'>('Transfer Rekening Kas Pusat');
  const [setorCatatan, setSetorCatatan] = useState<string>('');
  const [setorSuccessMsg, setSetorSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const safePelanggan = pelangganList || [];
  const safePengurus = pengurusList || [];
  const safeLogs = logsList || [];

  const isAdminKeuanganUtama = currentUser?.role === 'admin_keuangan' || currentUser?.username === 'admin';

  // Per-Banjar aggregation from real data (9 Banjar & Petugas Iuran)
  const banjarMetrics = DAFTAR_BANJAR_PETUGAS.map((bInfo) => {
    const pengurus = safePengurus.find(
      (p) => p.banjar === bInfo.name || p.banjar === bInfo.code || p.banjar.includes(bInfo.code)
    ) || {
      id: `PGB-${bInfo.id}`,
      banjar: bInfo.name,
      namaPengurus: bInfo.petugasName,
      jabatan: `Bendahara & Petugas Iuran ${bInfo.code}`,
      telepon: bInfo.phone,
      email: `${bInfo.username}@siups.id`,
      username: bInfo.username,
      avatar: '👨‍💼',
      statusAktif: true,
      statusSetoran: 'Belum Disetor' as StatusSetoranBanjar,
      nominalSetoran: 0,
      terakhirUpdateData: 'Belum ada data',
      metodeSetoran: 'Transfer Rekening Kas Pusat' as const
    };

    const wargaBanjar = safePelanggan.filter(
      (p) =>
        p.rtRw === bInfo.name ||
        p.rtRw === bInfo.code ||
        p.rtRw.includes(bInfo.code) ||
        p.rtRw.toLowerCase().includes(bInfo.petugasName.toLowerCase())
    );
    const totalWarga = wargaBanjar.length;
    const lunasWarga = wargaBanjar.filter((p) => p.status === 'Sudah Dibayar');
    const belumLunasWarga = wargaBanjar.filter((p) => p.status === 'Belum Dibayar');

    const totalKasTerkumpul = lunasWarga.reduce((acc, curr) => acc + curr.iuran, 0);
    const totalTarget = wargaBanjar.reduce((acc, curr) => acc + curr.iuran, 0);
    const persentase = totalTarget > 0 ? Math.round((totalKasTerkumpul / totalTarget) * 100) : 0;

    return {
      banjarName: bInfo.name,
      banjarCode: bInfo.code,
      petugasName: bInfo.petugasName,
      pengurus,
      totalWarga,
      lunasCount: lunasWarga.length,
      belumLunasCount: belumLunasWarga.length,
      totalKasTerkumpul,
      totalTarget,
      persentase,
      statusSetoran: pengurus.statusSetoran,
      nominalSetoran: pengurus.nominalSetoran,
      tanggalSetorTerakhir: pengurus.tanggalSetorTerakhir || '-',
      terakhirUpdateData: pengurus.terakhirUpdateData,
      catatanSetoran: pengurus.catatanSetoran
    };
  });

  // Global consolidated summaries
  const totalWargaSeLingkungan = safePelanggan.length;
  const totalTargetSeLingkungan = safePelanggan.reduce((acc, p) => acc + p.iuran, 0);
  const totalTerkumpulWarga = safePelanggan.filter(p => p.status === 'Sudah Dibayar').reduce((acc, p) => acc + p.iuran, 0);
  
  // Total cash verified into central treasury
  const totalSetoranPusatTerverifikasi = safePengurus
    .filter(p => p.statusSetoran === 'Terkonfirmasi')
    .reduce((acc, p) => acc + (p.nominalSetoran || 0), 0);

  const banjarMenungguVerifikasi = safePengurus.filter(p => p.statusSetoran === 'Menunggu Verifikasi').length;
  const banjarTerkonfirmasi = safePengurus.filter(p => p.statusSetoran === 'Terkonfirmasi').length;

  const handleEditPengurusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPengurus) return;
    onUpdatePengurus(editingPengurus);
    setEditingPengurus(null);
  };

  const handleSetoranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setorNominal <= 0) return;
    onSubmitSetoranBanjar(setorBanjar, setorNominal, setorMetode, setorCatatan);
    setSetorSuccessMsg(`Setoran kas dari ${setorBanjar} sebesar ${formatRupiah(setorNominal)} berhasil dikirimkan ke Admin Keuangan Utama.`);
    setSetorCatatan('');
    setTimeout(() => {
      setSetorSuccessMsg(null);
      setActiveTab('monitoring');
    }, 1500);
  };

  const handlePrintKonsolidasi = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* 1. Modal Header with Role Identity */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/40">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  Pusat Monitoring & Keuangan Banjar
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[11px]">
                  Periode {periode}
                </span>
                {isAdminKeuanganUtama && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-[10px] flex items-center space-x-1">
                    <span>👑 Admin Keuangan Utama</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Konsolidasi data update real-time dan verifikasi setoran kas dari para Petugas Iuran / Bendahara 9 Banjar
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center">
            <button
              onClick={handlePrintKonsolidasi}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold text-slate-200 transition cursor-pointer"
              title="Cetak Laporan Konsolidasi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak Rekap</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Consolidated Top Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-50 border-b border-slate-200">
          
          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Iuran RW</span>
              <Building2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
              {formatRupiah(totalTargetSeLingkungan)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Dari {totalWargaSeLingkungan} Kepala Keluarga di 9 Banjar
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Kas Masuk Warga</span>
              <Wallet className="w-4 h-4 text-teal-600" />
            </div>
            <p className="text-base sm:text-lg font-black text-teal-700 mt-1">
              {formatRupiah(totalTerkumpulWarga)}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Terkumpul di Bendahara Banjar ({Math.round((totalTerkumpulWarga / (totalTargetSeLingkungan || 1)) * 100)}%)
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/40 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Setoran Masuk Pusat</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-base sm:text-lg font-black text-emerald-800 mt-1">
              {formatRupiah(totalSetoranPusatTerverifikasi)}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
              {banjarTerkonfirmasi} dari 9 Banjar Terverifikasi
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/40 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Status Setoran</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-base sm:text-lg font-black text-amber-800">
                {banjarMenungguVerifikasi} Banjar
              </span>
              {banjarMenungguVerifikasi > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900 font-bold animate-pulse">
                  Perlu Verifikasi
                </span>
              )}
            </div>
            <p className="text-[10px] text-amber-800 font-medium mt-0.5">
              Menunggu validasi Admin Keuangan
            </p>
          </div>

        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center space-x-1 px-6 pt-3 border-b border-slate-200 bg-white text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('monitoring')}
            className={`px-4 py-2.5 font-bold border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'monitoring'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Monitoring 9 Banjar ({banjarMetrics.length})</span>
            {banjarMenungguVerifikasi > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                {banjarMenungguVerifikasi}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2.5 font-bold border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'logs'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Log Aktivitas Pengurus ({logsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pengurus')}
            className={`px-4 py-2.5 font-bold border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'pengurus'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kelola Pengurus Banjar</span>
          </button>

          <button
            onClick={() => setActiveTab('setor')}
            className={`px-4 py-2.5 font-bold border-b-2 transition flex items-center space-x-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'setor'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Kirim / Setor Kas Banjar</span>
          </button>
        </div>

        {/* 4. Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ===================== TAB 1: MONITORING PER-BANJAR ===================== */}
          {activeTab === 'monitoring' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Status Pembayaran & Rekapitulasi Setoran Kas per Banjar
                  </h3>
                  <p className="text-slate-500">
                    Admin Keuangan Utama dapat memonitor kepatuhan iuran dan mengonfirmasi setoran kas dari bendahara banjar.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-500">Keterangan:</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">Terkonfirmasi</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">Menunggu Verifikasi</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">Belum Disetor</span>
                </div>
              </div>

              {/* Banjar Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banjarMetrics.map((item) => {
                  const statusBg = {
                    'Terkonfirmasi': 'bg-emerald-50 border-emerald-300 text-emerald-900',
                    'Menunggu Verifikasi': 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-400/40',
                    'Belum Disetor': 'bg-slate-50 border-slate-300 text-slate-800',
                  }[item.statusSetoran];

                  const badgeClass = {
                    'Terkonfirmasi': 'bg-emerald-100 text-emerald-800 border-emerald-300',
                    'Menunggu Verifikasi': 'bg-amber-200 text-amber-900 border-amber-400 animate-pulse',
                    'Belum Disetor': 'bg-slate-200 text-slate-700 border-slate-300',
                  }[item.statusSetoran];

                  return (
                    <div 
                      key={item.banjarName}
                      className={`p-5 rounded-2xl border transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${statusBg}`}
                    >
                      <div>
                        {/* Header card */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-black/5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-lg">
                              {item.pengurus.avatar || '👨‍💼'}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-bold text-slate-900 text-sm">
                                  {item.banjarName}
                                </h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${badgeClass}`}>
                                  {item.statusSetoran}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">
                                PIC: <strong>{item.pengurus.namaPengurus}</strong> ({item.pengurus.jabatan})
                              </p>
                            </div>
                          </div>

                          <a
                            href={`https://wa.me/${item.pengurus.telepon.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(item.pengurus.namaPengurus)},%20mohon%20konfirmasi%20rekap%20iuran%20dan%20setoran%20kas%20${encodeURIComponent(item.banjarName)}%20periode%20${encodeURIComponent(periode)}.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition shadow-2xs"
                            title="Hubungi via WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="hidden sm:inline text-[10px]">WA</span>
                          </a>
                        </div>

                        {/* Financial and Progress Details */}
                        <div className="grid grid-cols-2 gap-3 my-3.5 text-xs">
                          <div className="bg-white/90 p-2.5 rounded-xl border border-black/5">
                            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Kas Warga Terkumpul</span>
                            <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                              {formatRupiah(item.totalKasTerkumpul)}
                            </span>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                              <div 
                                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" 
                                style={{ width: `${item.persentase}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1 block">
                              {item.persentase}% dari target {formatRupiah(item.totalTarget)}
                            </span>
                          </div>

                          <div className="bg-white/90 p-2.5 rounded-xl border border-black/5">
                            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Setoran ke Pusat</span>
                            <span className="text-sm font-bold text-emerald-700 mt-0.5 block">
                              {formatRupiah(item.nominalSetoran)}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-2 block truncate" title={item.tanggalSetorTerakhir}>
                              Tgl Setor: {item.tanggalSetorTerakhir}
                            </span>
                            <span className="text-[10px] text-slate-600 font-medium block truncate">
                              Metode: {item.pengurus.metodeSetoran || 'Transfer BCA'}
                            </span>
                          </div>
                        </div>

                        {/* Warga Status Summary */}
                        <div className="bg-white/80 p-2.5 rounded-xl border border-black/5 text-[11px] flex items-center justify-between text-slate-600 mb-3">
                          <div>
                            <span>Total Warga: <strong>{item.totalWarga} KK</strong></span>
                            <span className="mx-1.5">•</span>
                            <span className="text-emerald-700 font-semibold">{item.lunasCount} Lunas</span>
                            <span className="mx-1.5">•</span>
                            <span className="text-rose-600 font-semibold">{item.belumLunasCount} Belum Lunas</span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Update: {item.terakhirUpdateData}
                          </span>
                        </div>

                        {item.catatanSetoran && (
                          <div className="p-2 bg-white/70 rounded-lg text-[11px] text-slate-700 italic border border-black/5 mb-3">
                            "{item.catatanSetoran}"
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            onSelectBanjarFilter(item.banjarName);
                            onClose();
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center space-x-1"
                        >
                          <Search className="w-3 h-3 text-slate-500" />
                          <span>Filter Warga</span>
                        </button>

                        <div className="flex items-center space-x-2">
                          {item.statusSetoran === 'Menunggu Verifikasi' && (
                            <button
                              onClick={() => onVerifikasiSetoran(item.pengurus.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verifikasi Setoran</span>
                            </button>
                          )}

                          {item.statusSetoran === 'Belum Disetor' && (
                            <a
                              href={`https://wa.me/${item.pengurus.telepon.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(item.pengurus.namaPengurus)},%20mohon%20segera%20setorkan%20iuran%20sampah%20terkumpul%20${encodeURIComponent(item.banjarName)}%20ke%20Admin%20Keuangan%20Pusat.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                            >
                              <Send className="w-3 h-3" />
                              <span>Kirim Pengingat</span>
                            </a>
                          )}

                          <button
                            onClick={() => {
                              setEditingPengurus(item.pengurus);
                              setActiveTab('pengurus');
                            }}
                            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 rounded-lg transition"
                            title="Edit Pengurus"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ===================== TAB 2: LOG AKTIVITAS MASUK ===================== */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Log Real-Time Data Masuk dari Pengurus & Bendahara Banjar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Semua aktivitas pencatatan iuran, pendaftaran warga baru, dan setoran kas yang masuk dipantau di sini.
                  </p>
                </div>

                {/* Filter Banjar */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={logFilterBanjar}
                    onChange={(e) => setLogFilterBanjar(e.target.value)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="ALL">Semua Petugas / 9 Banjar</option>
                    {DAFTAR_BANJAR_PETUGAS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Log Timeline List */}
              <div className="space-y-2.5">
                {safeLogs
                  .filter((log) => {
                    if (logFilterBanjar === 'ALL') return true;
                    return (
                      log.banjar === logFilterBanjar ||
                      log.banjar.includes(logFilterBanjar) ||
                      logFilterBanjar.includes(log.banjar)
                    );
                  })
                  .map((log) => {
                    const iconColor = {
                      'Setoran Kas ke Pusat': 'bg-emerald-100 text-emerald-800 border-emerald-300',
                      'Update Pembayaran Warga': 'bg-blue-100 text-blue-800 border-blue-300',
                      'Tambah Warga Baru': 'bg-purple-100 text-purple-800 border-purple-300',
                      'Koreksi Data Iuran': 'bg-amber-100 text-amber-800 border-amber-300',
                    }[log.jenisAktivitas] || 'bg-slate-100 text-slate-800 border-slate-300';

                    return (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/80 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`px-2 py-1 rounded-lg border text-[10px] font-bold shrink-0 mt-0.5 ${iconColor}`}>
                            {log.jenisAktivitas}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 flex-wrap">
                              <span className="font-bold text-slate-900">{log.namaPengurus}</span>
                              <span className="text-slate-400">•</span>
                              <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px]">
                                {log.banjar}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-500 text-[11px]">{log.waktu}</span>
                            </div>
                            <p className="text-slate-700 mt-1">
                              {log.rincian}
                            </p>
                            {log.nominal && log.nominal > 0 && (
                              <span className="inline-block mt-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                                Nominal: {formatRupiah(log.nominal)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            log.statusVerifikasi === 'Terverifikasi'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          }`}>
                            {log.statusVerifikasi}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>

            </div>
          )}

          {/* ===================== TAB 3: KELOLA PENGURUS BANJAR ===================== */}
          {activeTab === 'pengurus' && (
            <div className="space-y-6">
              
              {/* Form Edit Pengurus if Selected */}
              {editingPengurus && (
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-emerald-950 text-sm flex items-center space-x-2">
                      <Edit3 className="w-4 h-4 text-emerald-700" />
                      <span>Edit Data Pengurus: {editingPengurus.banjar}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setEditingPengurus(null)}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleEditPengurusSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nama Pengurus / Bendahara</label>
                      <input
                        type="text"
                        required
                        value={editingPengurus.namaPengurus}
                        onChange={(e) => setEditingPengurus({ ...editingPengurus, namaPengurus: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jabatan</label>
                      <input
                        type="text"
                        required
                        value={editingPengurus.jabatan}
                        onChange={(e) => setEditingPengurus({ ...editingPengurus, jabatan: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Nomor Telepon / WA</label>
                      <input
                        type="text"
                        required
                        value={editingPengurus.telepon}
                        onChange={(e) => setEditingPengurus({ ...editingPengurus, telepon: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editingPengurus.email}
                        onChange={(e) => setEditingPengurus({ ...editingPengurus, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Keaktifan</label>
                      <select
                        value={editingPengurus.statusAktif ? 'aktif' : 'nonaktif'}
                        onChange={(e) => setEditingPengurus({ ...editingPengurus, statusAktif: e.target.value === 'aktif' })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 font-semibold"
                      >
                        <option value="aktif">Aktif Bertugas</option>
                        <option value="nonaktif">Non-Aktif / Cuti</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table of Pengurus */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-bold text-slate-900 text-xs">Daftar Pengurus & Bendahara Banjar Aktif</h4>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {pengurusList.length} Banjar Terdata
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50/50 text-slate-600 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Wilayah Banjar</th>
                        <th className="px-4 py-3">Nama Pengurus & Jabatan</th>
                        <th className="px-4 py-3">Kontak / WA</th>
                        <th className="px-4 py-3">Username Login</th>
                        <th className="px-4 py-3">Status Setoran</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pengurusList.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/70 transition">
                          <td className="px-4 py-3 font-bold text-slate-900">
                            <div className="flex items-center space-x-2">
                              <span className="text-base">{p.avatar || '👨‍💼'}</span>
                              <span>{p.banjar}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-bold text-slate-900">{p.namaPengurus}</p>
                            <p className="text-[11px] text-slate-500">{p.jabatan}</p>
                          </td>
                          <td className="px-4 py-3 text-slate-700">
                            <a 
                              href={`https://wa.me/${p.telepon.replace(/[^0-9]/g, '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-emerald-700 font-semibold hover:underline flex items-center space-x-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{p.telepon}</span>
                            </a>
                            <p className="text-[10px] text-slate-400">{p.email}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-700">
                              @{p.username}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.statusSetoran === 'Terkonfirmasi'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                : p.statusSetoran === 'Menunggu Verifikasi'
                                ? 'bg-amber-100 text-amber-800 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}>
                              {p.statusSetoran}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setEditingPengurus(p)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg font-semibold transition text-[11px] cursor-pointer"
                            >
                              Edit Data
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ===================== TAB 4: SETOR KAS BANJAR ===================== */}
          {activeTab === 'setor' && (
            <div className="max-w-2xl mx-auto space-y-4">
              
              <div className="text-center space-y-1">
                <h3 className="font-bold text-slate-900 text-base">
                  Formulir Pengiriman / Setoran Kas Iuran Banjar
                </h3>
                <p className="text-xs text-slate-500">
                  Digunakan oleh Bendahara Banjar untuk menyetorkan akumulasi iuran sampah warga ke Kas Pusat Admin Keuangan Utama.
                </p>
              </div>

              {setorSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center space-x-2 text-xs text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{setorSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSetoranSubmit} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Pilih Wilayah Banjar Penyetor <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={setorBanjar}
                    onChange={(e) => setSetorBanjar(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-emerald-500"
                  >
                    {DAFTAR_BANJAR_PETUGAS.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.petugasName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nominal Dana yang Disetor (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={5000}
                    required
                    value={setorNominal}
                    onChange={(e) => setSetorNominal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Terbilang: <strong>{formatRupiah(setorNominal)}</strong>
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Metode Penyetoran <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={setorMetode}
                    onChange={(e) => setSetorMetode(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Transfer Rekening Kas Pusat">Transfer Rekening Kas Pusat (Bank BCA No. 782-990-1122 a.n. Kas RW 05)</option>
                    <option value="Setor Tunai Langsung">Setor Tunai Langsung ke Kantor Sekretariat / Admin Keuangan</option>
                    <option value="QRIS Kas">QRIS Kas Pusat Lingkungan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catatan / Rincian Setoran
                  </label>
                  <textarea
                    rows={3}
                    value={setorCatatan}
                    onChange={(e) => setSetorCatatan(e.target.value)}
                    placeholder="Contoh: Setoran termin 1 iuran warga Banjar 01 sebanyak 10 KK via transfer."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Setoran ke Admin Keuangan Utama</span>
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

        {/* 5. Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Terhubung langsung ke Kasir & Rekapitulasi 4 Banjar RW 05</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
            >
              Tutup Modal
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
