import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock,
  Building2
} from 'lucide-react';
import { Pelanggan } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ModalRekapCetakProps {
  isOpen: boolean;
  onClose: () => void;
  pelangganList: Pelanggan[];
  periode: string;
}

export const ModalRekapCetak: React.FC<ModalRekapCetakProps> = ({
  isOpen,
  onClose,
  pelangganList = [],
  periode,
}) => {
  if (!isOpen) return null;

  const safeList = pelangganList || [];
  const totalWarga = safeList.length;
  const lunasList = safeList.filter((p) => p.status === 'Sudah Dibayar');
  const belumList = safeList.filter((p) => p.status === 'Belum Dibayar');

  const totalTerkumpul = lunasList.reduce((acc, curr) => acc + curr.iuran, 0);
  const totalTertunggak = belumList.reduce((acc, curr) => acc + curr.iuran, 0);
  const totalPotensi = totalTerkumpul + totalTertunggak;

  const tunaiTotal = lunasList.filter(p => p.metode === 'Tunai').reduce((acc, curr) => acc + curr.iuran, 0);
  const transferTotal = lunasList.filter(p => p.metode === 'Transfer').reduce((acc, curr) => acc + curr.iuran, 0);
  const qrisTotal = lunasList.filter(p => p.metode === 'QRIS').reduce((acc, curr) => acc + curr.iuran, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Pratinjau Laporan Rekapitulasi Iuran</h3>
              <p className="text-xs text-emerald-200">Format Cetak Laporan Keuangan RW 05</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-xl text-xs transition"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-200 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800 printable-rekap">
          
          {/* Header Kop Laporan */}
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h2 className="text-xl font-extrabold tracking-wide uppercase text-slate-900">
              RUKUN WARGA 05 KELURAHAN SEJAHTERA
            </h2>
            <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
              PANITIA PENGELOLAAN KEBERSIHAN & PERSAMPAHAN LINGKUNGAN
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sekretariat: Balai Warga RW 05 • Kontak: 0812-3456-7890 • Email: kebersihan.rw05@warga.id
            </p>
            <div className="mt-3 inline-block bg-slate-100 text-slate-800 font-bold text-xs px-4 py-1 rounded-full border border-slate-300">
              LAPORAN REKAPITULASI IURAN SAMPAH PERIODE: {periode.toUpperCase()}
            </div>
          </div>

          {/* Ringkasan Keuangan Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Total Warga:</span>
              <span className="text-base font-bold text-slate-900">{totalWarga} KK</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {lunasList.length} Lunas ({Math.round((lunasList.length / totalWarga) * 100)}%)
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="text-emerald-800 font-medium block">Total Terkumpul:</span>
              <span className="text-base font-extrabold text-emerald-700">{formatRupiah(totalTerkumpul)}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Sudah Diterima</span>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
              <span className="text-rose-800 font-medium block">Total Tertunggak:</span>
              <span className="text-base font-extrabold text-rose-700">{formatRupiah(totalTertunggak)}</span>
              <span className="text-[10px] text-rose-600 block mt-0.5">{belumList.length} Warga Belum</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block">Metode Pembayaran:</span>
              <span className="text-[11px] font-semibold text-slate-700 block">Tunai: {formatRupiah(tunaiTotal)}</span>
              <span className="text-[11px] font-semibold text-slate-700 block">Trf/QRIS: {formatRupiah(transferTotal + qrisTotal)}</span>
            </div>
          </div>

          {/* Detail Tabel Warga */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 font-bold text-slate-700">
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">Nama Warga</th>
                  <th className="py-2.5 px-3">Alamat / Admin Penginput</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Iuran (Rp)</th>
                  <th className="py-2.5 px-3">Metode</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Tanggal Bayar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pelangganList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                      Belum ada data pelanggan untuk dicetak. Silakan tambahkan data pelanggan terlebih dahulu.
                    </td>
                  </tr>
                ) : (
                  pelangganList.map((p, idx) => (
                    <tr key={p.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="py-2 px-3 text-slate-500">{idx + 1}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{p.nama}</td>
                      <td className="py-2 px-3 text-slate-700">{p.lokasi} ({p.adminPenginput || p.rtRw})</td>
                      <td className="py-2 px-3 text-slate-600">{p.kategori}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{formatRupiah(p.iuran)}</td>
                      <td className="py-2 px-3 text-slate-700">{p.metode}</td>
                      <td className="py-2 px-3">
                        <span className={`font-bold ${p.status === 'Sudah Dibayar' ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-500">{p.tanggalBayar || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer (Hidden on print) */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between no-print">
          <span className="text-xs text-slate-500">
            *Laporan siap dicetak langsung atau disimpan ke format PDF
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
