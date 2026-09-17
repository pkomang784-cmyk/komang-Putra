import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  TrendingUp, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { Pelanggan, StatusPembayaran } from '../types';

interface StatsCardsProps {
  pelangganList: Pelanggan[];
  activeFilterStatus: 'ALL' | StatusPembayaran;
  onFilterStatusClick: (status: 'ALL' | StatusPembayaran) => void;
  onOpenResetStatusModal?: () => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  pelangganList = [],
  activeFilterStatus,
  onFilterStatusClick,
  onOpenResetStatusModal,
}) => {
  const safeList = pelangganList || [];
  const totalWarga = safeList.length;
  const lunasList = safeList.filter((p) => p.status === 'Sudah Dibayar');
  const belumList = safeList.filter((p) => p.status === 'Belum Dibayar');

  const totalTerkumpul = lunasList.reduce((acc, curr) => acc + curr.iuran, 0);
  const totalTertunggak = belumList.reduce((acc, curr) => acc + curr.iuran, 0);
  const totalTargetIuran = totalTerkumpul + totalTertunggak;

  const persenLunas = totalWarga > 0 ? Math.round((lunasList.length / totalWarga) * 100) : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
      
      {/* 1. Total Pelanggan */}
      <div 
        onClick={() => onFilterStatusClick('ALL')}
        className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          activeFilterStatus === 'ALL' 
            ? 'border-slate-800 ring-2 ring-slate-800/20' 
            : 'border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Pelanggan
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {totalWarga} <span className="text-sm font-normal text-slate-500">KK/Warga</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Semua Terdaftar</span>
          <span className="font-semibold text-blue-600">Klik untuk tampilkan</span>
        </div>
      </div>

      {/* 2. Sudah Bayar (Lunas) */}
      <div 
        onClick={() => onFilterStatusClick('Sudah Dibayar')}
        className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          activeFilterStatus === 'Sudah Dibayar' 
            ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20' 
            : 'border-slate-200/80 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Sudah Lunas ({persenLunas}%)
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
              {lunasList.length} <span className="text-sm font-normal text-slate-500">Warga</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${persenLunas}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>Terkumpul: {formatRupiah(totalTerkumpul)}</span>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-emerald-700">Filter Lunas</span>
              {onOpenResetStatusModal && lunasList.length > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenResetStatusModal();
                    }}
                    className="text-rose-600 hover:text-rose-700 font-semibold hover:underline flex items-center space-x-0.5"
                    title="Reset status pembayaran semua pelanggan"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Belum Bayar */}
      <div 
        onClick={() => onFilterStatusClick('Belum Dibayar')}
        className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          activeFilterStatus === 'Belum Dibayar' 
            ? 'border-rose-600 ring-2 ring-rose-600/20 bg-rose-50/20' 
            : 'border-slate-200/80 hover:border-rose-300'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
              Belum Bayar
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
              {belumList.length} <span className="text-sm font-normal text-slate-500">Warga</span>
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Tertunggak:</span>
          <span className="font-bold text-rose-600">{formatRupiah(totalTertunggak)}</span>
        </div>
      </div>

      {/* 4. Total Dana Terkumpul */}
      <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 p-5 rounded-2xl border border-emerald-900 text-white shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
              Dana Iuran Terkumpul
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {formatRupiah(totalTerkumpul)}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-700/80 text-emerald-200 flex items-center justify-center border border-emerald-600/40">
            <Wallet className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-3.5 pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs text-emerald-200">
          <span>Target Total:</span>
          <span className="font-semibold text-white">{formatRupiah(totalTargetIuran)}</span>
        </div>
      </div>

    </section>
  );
};
