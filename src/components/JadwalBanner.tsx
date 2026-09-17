import React from 'react';
import { 
  Truck, 
  Clock, 
  MapPin, 
  ChevronRight, 
  AlertCircle,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { JadwalPengangkutan } from '../types';

interface JadwalBannerProps {
  jadwalList: JadwalPengangkutan[];
  onOpenJadwalModal: () => void;
  onOpenLaporModal: () => void;
}

export const JadwalBanner: React.FC<JadwalBannerProps> = ({
  jadwalList,
  onOpenJadwalModal,
  onOpenLaporModal,
}) => {
  const activeJadwal = jadwalList.find(j => j.statusArmada === 'Sedang Beroperasi') || jadwalList[0];

  return (
    <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl border border-emerald-200/90 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 no-print">
      
      {/* Left side: Schedule indicator */}
      <div className="flex items-start space-x-3.5">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              📅 Jadwal Pengambilan Hari Ini
            </span>
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{activeJadwal.statusArmada}</span>
            </span>
          </div>

          <p className="font-bold text-slate-900 text-sm mt-0.5">
            {activeJadwal.jenisSampah} • <span className="text-emerald-700 font-semibold">{activeJadwal.area}</span>
          </p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeJadwal.jam}</span>
            </span>
            <span>•</span>
            <span>Petugas: <strong>{activeJadwal.petugas}</strong> ({activeJadwal.platNomor})</span>
          </div>
        </div>
      </div>

      {/* Right side: Quick Action Buttons */}
      <div className="flex items-center space-x-2 shrink-0 self-start md:self-center">
        <button
          onClick={onOpenJadwalModal}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200 shadow-2xs transition flex items-center space-x-1"
        >
          <span>Semua Jadwal</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onOpenLaporModal}
          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-2xs transition flex items-center space-x-1"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Lapor Sampah</span>
        </button>
      </div>

    </div>
  );
};
