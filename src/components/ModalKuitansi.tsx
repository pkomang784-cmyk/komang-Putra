import React from 'react';
import { 
  X, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  QrCode, 
  Trash2, 
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { Pelanggan } from '../types';
import { formatRupiah, generateWhatsAppMessage, generateResiNumber, getCurrentFormattedDateTime } from '../utils/formatters';

interface ModalKuitansiProps {
  isOpen: boolean;
  onClose: () => void;
  pelanggan: Pelanggan | null;
}

export const ModalKuitansi: React.FC<ModalKuitansiProps> = ({
  isOpen,
  onClose,
  pelanggan,
}) => {
  if (!isOpen || !pelanggan) return null;

  const noResi = pelanggan.noResi || generateResiNumber();
  const tanggalBayar = pelanggan.tanggalBayar || getCurrentFormattedDateTime();
  const waUrl = generateWhatsAppMessage(pelanggan, 'receipt');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="bg-emerald-800 text-white px-5 py-3 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-4 h-4 text-emerald-300" />
            <h3 className="font-bold text-sm">Bukti Pembayaran / Kuitansi Digital</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-200 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Receipt Content (Printable area) */}
        <div className="p-6 text-slate-800 space-y-4 printable-receipt">
          
          {/* Header Resi */}
          <div className="text-center border-b-2 border-dashed border-slate-200 pb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2 font-bold">
              🌱
            </div>
            <h2 className="font-extrabold text-base tracking-tight text-slate-900">
              PENGELOLA KEBERSIHAN RW 05
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sistem Informasi Pengelolaan Iuran Sampah Mandiri (SI-UPS)
            </p>
            <div className="inline-block mt-2 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-3 py-0.5 rounded-full">
              KUITANSI PEMBAYARAN RESMI
            </div>
          </div>

          {/* No Resi & Tanggal */}
          <div className="flex justify-between text-xs py-1">
            <span className="text-slate-500">No. Bukti / Resi:</span>
            <span className="font-mono font-bold text-slate-900">{noResi}</span>
          </div>
          <div className="flex justify-between text-xs py-1">
            <span className="text-slate-500">Waktu Pembayaran:</span>
            <span className="font-medium text-slate-700">{tanggalBayar}</span>
          </div>

          {/* Detail Warga Box */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Nama Warga:</span>
              <span className="font-bold text-slate-900">{pelanggan.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Alamat:</span>
              <span className="font-medium text-slate-800">{pelanggan.lokasi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Admin Penginput:</span>
              <span className="font-semibold text-emerald-700">{pelanggan.adminPenginput || pelanggan.rtRw}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kategori:</span>
              <span className="font-medium text-slate-700">{pelanggan.kategori}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Periode Iuran:</span>
              <span className="font-bold text-emerald-800">{pelanggan.periodeBulan}</span>
            </div>
          </div>

          {/* Rincian Tagihan */}
          <div className="space-y-2 text-xs pt-1">
            <div className="flex justify-between text-slate-600">
              <span>Iuran Pengangkutan Sampah Lingkungan</span>
              <span>{formatRupiah(pelanggan.iuran)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Metode Pembayaran</span>
              <span className="font-semibold text-slate-800">{pelanggan.metode}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t-2 border-slate-200">
              <span>TOTAL DIBAYAR:</span>
              <span className="text-emerald-700 text-base">{formatRupiah(pelanggan.iuran)}</span>
            </div>
          </div>

          {/* Cap & QR Code Stempel Lunas */}
          <div className="relative border-t-2 border-dashed border-slate-200 pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-14 h-14 bg-slate-100 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-[9px] text-slate-400">
                <QrCode className="w-8 h-8 text-slate-700" />
                <span>SCAN VERIFIKASI</span>
              </div>
              <div className="text-[10px] text-slate-500">
                <p className="font-bold text-slate-700">Validasi Digital RW 05</p>
                <p>Dokumen sah & terdata di sistem SI-UPS</p>
              </div>
            </div>

            {/* Stamp LUNAS */}
            <div className="border-2 border-emerald-600 text-emerald-600 font-extrabold text-xs px-3 py-1.5 rounded-lg rotate-[-8deg] uppercase tracking-wider text-center bg-emerald-50/50">
              <div className="text-[10px] font-medium leading-none">STATUS</div>
              <div className="text-sm font-black">LUNAS</div>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 italic pt-2">
            Terima kasih atas partisipasi aktif menjaga kebersihan lingkungan bersama! 🌱
          </p>

        </div>

        {/* Bottom Actions (Hidden on print) */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between gap-2 no-print">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Kirim WhatsApp</span>
          </a>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
