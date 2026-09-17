import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, CheckCircle2, Users, Calendar, ShieldAlert, ShieldCheck, Lock } from 'lucide-react';
import { AppUser } from '../types';

interface ModalResetStatusPembayaranProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  isAuthorizedAdmin: boolean;
  totalWarga: number;
  sudahBayarCount: number;
  belumBayarCount: number;
  periode: string;
  isFiltered: boolean;
  filteredCount: number;
  activeFilterName?: string;
  onConfirmResetAll: () => void;
  onConfirmResetFiltered: () => void;
  onOpenLogin?: () => void;
}

export const ModalResetStatusPembayaran: React.FC<ModalResetStatusPembayaranProps> = ({
  isOpen,
  onClose,
  currentUser,
  isAuthorizedAdmin,
  totalWarga,
  sudahBayarCount,
  belumBayarCount,
  periode,
  isFiltered,
  filteredCount,
  activeFilterName,
  onConfirmResetAll,
  onConfirmResetFiltered,
  onOpenLogin,
}) => {
  const [resetTarget, setResetTarget] = useState<'all' | 'filtered'>('all');
  const [confirmedCheck, setConfirmedCheck] = useState(false);

  if (!isOpen) return null;

  const targetCount = resetTarget === 'all' ? totalWarga : filteredCount;

  const handleExecuteReset = () => {
    if (!isAuthorizedAdmin) return;
    if (resetTarget === 'all') {
      onConfirmResetAll();
    } else {
      onConfirmResetFiltered();
    }
    setConfirmedCheck(false);
    onClose();
  };

  return (
    <div 
      id="modal-reset-status-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div 
        id="modal-reset-status-card"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 text-white flex items-center justify-between border-b border-rose-800/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Reset Status Pembayaran
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-200 text-[10px] font-bold">
                  Khusus Admin
                </span>
              </div>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Pengaturan ulang status iuran warga untuk periode {periode}
              </p>
            </div>
          </div>
          <button
            id="btn-close-modal-reset"
            onClick={onClose}
            className="p-1.5 rounded-xl text-rose-200/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Admin Role Verification Badge */}
          {isAuthorizedAdmin ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-slate-700">Otorisasi:</span>
                <strong className="text-emerald-900">
                  {currentUser?.name} ({currentUser?.roleTitle})
                </strong>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 font-extrabold text-[10px]">
                ADMIN
              </span>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-900 text-xs">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-rose-950">Akses Ditolak: Khusus Administrator</p>
                <p className="text-rose-800 leading-relaxed">
                  Fitur reset status pembayaran hanya dapat dilakukan oleh pengguna dengan peran <strong>Admin</strong> (Admin Keuangan Utama atau Bendahara Banjar).
                </p>
                <p className="text-[11px] text-rose-700 font-semibold pt-1">
                  Akun Anda saat ini: {currentUser ? `${currentUser.name} (${currentUser.roleTitle})` : 'Mode Tamu (Belum Login)'}
                </p>
              </div>
            </div>
          )}

          {/* Warning Banner */}
          <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start space-x-3 text-amber-900 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950 mb-1">Perhatian Tindakan Massal</p>
              <p>
                Tindakan ini akan mengembalikan status pembayaran warga menjadi{' '}
                <strong className="text-rose-700">"Belum Dibayar"</strong> serta mengosongkan tanggal bayar dan nomor resi. Gunakan fungsi ini saat pergantian bulan/periode baru atau penagihan ulang.
              </p>
            </div>
          </div>

          {/* Real-time Status Metric Summary */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-500 block">Total Warga</span>
              <span className="text-lg font-black text-slate-800">{totalWarga}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Pelanggan</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[11px] font-semibold text-emerald-700 block">Sudah Lunas</span>
              <span className="text-lg font-black text-emerald-800">{sudahBayarCount}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Akan di-reset</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[11px] font-semibold text-rose-700 block">Belum Bayar</span>
              <span className="text-lg font-black text-rose-800">{belumBayarCount}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">Sudah sesuai</span>
            </div>
          </div>

          {/* Scope Selector (If filtered) */}
          {isFiltered && filteredCount < totalWarga ? (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Pilih Cakupan Reset:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!isAuthorizedAdmin}
                  onClick={() => setResetTarget('all')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    resetTarget === 'all'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-300'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  } ${!isAuthorizedAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">Semua Pelanggan</span>
                    <span className="text-xs font-black px-1.5 py-0.5 bg-rose-200/70 text-rose-900 rounded-md">
                      {totalWarga} Warga
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Reset seluruh warga di semua 9 Banjar
                  </p>
                </button>

                <button
                  type="button"
                  disabled={!isAuthorizedAdmin}
                  onClick={() => setResetTarget('filtered')}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    resetTarget === 'filtered'
                      ? 'border-rose-500 bg-rose-50/70 text-rose-950 ring-2 ring-rose-300'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  } ${!isAuthorizedAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs">Hanya Yang Terfilter</span>
                    <span className="text-xs font-black px-1.5 py-0.5 bg-rose-200/70 text-rose-900 rounded-md">
                      {filteredCount} Warga
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">
                    {activeFilterName || 'Sesuai filter pencarian/wilayah'}
                  </p>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">Target Reset:</span>
                <span className="font-bold text-slate-900">Seluruh Pelanggan ({totalWarga} Warga)</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{periode}</span>
              </div>
            </div>
          )}

          {/* Confirmation Checkbox */}
          {isAuthorizedAdmin && (
            <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer hover:bg-slate-100/70 transition">
              <input
                type="checkbox"
                id="checkbox-confirm-reset"
                checked={confirmedCheck}
                onChange={(e) => setConfirmedCheck(e.target.checked)}
                className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 h-4 w-4 border-slate-300"
              />
              <span className="text-xs text-slate-700 leading-snug">
                Saya memahami bahwa status pembayaran{' '}
                <strong className="text-slate-900">{targetCount} pelanggan</strong> akan diubah menjadi{' '}
                <strong className="text-rose-700">"Belum Dibayar"</strong> dan data pelunasan periode ini akan di-reset.
              </span>
            </label>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            id="btn-cancel-reset"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
          >
            {isAuthorizedAdmin ? 'Batal' : 'Tutup'}
          </button>
          
          {isAuthorizedAdmin ? (
            <button
              type="button"
              id="btn-execute-reset"
              disabled={!confirmedCheck}
              onClick={handleExecuteReset}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition cursor-pointer shadow-sm ${
                confirmedCheck
                  ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-98'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {resetTarget === 'all'
                  ? `Reset Status Semua Pelanggan (${totalWarga})`
                  : `Reset Status ${filteredCount} Pelanggan Terfilter`}
              </span>
            </button>
          ) : onOpenLogin ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Login sebagai Admin</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
