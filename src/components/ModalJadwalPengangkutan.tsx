import React from 'react';
import { 
  X, 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { JadwalPengangkutan } from '../types';

interface ModalJadwalPengangkutanProps {
  isOpen: boolean;
  onClose: () => void;
  jadwalList: JadwalPengangkutan[];
  onToggleStatusJadwal: (id: string) => void;
}

export const ModalJadwalPengangkutan: React.FC<ModalJadwalPengangkutanProps> = ({
  isOpen,
  onClose,
  jadwalList,
  onToggleStatusJadwal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Truck className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Jadwal & Armada Pengangkutan Sampah</h3>
              <p className="text-xs text-emerald-200">Operasional Pengangkutan Wilayah RW 05</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Info Pemilahan Sampah:</p>
              <p className="text-emerald-800 mt-0.5">
                Pastikan sampah organik (sisa makanan/daun) dan sampah daur ulang dipisahkan ke dalam kantong terpisah sebelum jam operasional penjemputan.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {jadwalList.map((item) => {
              const isOperating = item.statusArmada === 'Sedang Beroperasi';
              const isSelesai = item.statusArmada === 'Selesai';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isOperating
                      ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-300'
                      : isSelesai
                      ? 'border-slate-200 bg-slate-50/50'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">{item.hari}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {item.jam}
                        </span>
                      </div>
                      <p className="font-semibold text-emerald-800 text-xs mt-1">
                        {item.jenisSampah}
                      </p>
                    </div>

                    {/* Status Armada Button (Interactive) */}
                    <button
                      onClick={() => onToggleStatusJadwal(item.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 self-start transition cursor-pointer ${
                        isOperating
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs animate-pulse'
                          : isSelesai
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                      title="Klik untuk mengubah status armada"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{item.statusArmada}</span>
                    </button>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Wilayah:</strong> {item.area}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Petugas:</strong> {item.petugas}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Kendaraan:</strong> {item.platNomor}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span><strong>Kontak:</strong> {item.kontakPetugas}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
