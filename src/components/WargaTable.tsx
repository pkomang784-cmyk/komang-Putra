import React from 'react';
import { 
  Check, 
  X, 
  Printer, 
  MessageCircle, 
  Edit3, 
  Trash2, 
  Banknote, 
  CreditCard, 
  QrCode,
  Building2,
  Home,
  Store,
  Clock,
  CheckCircle2,
  Users,
  UserCheck
} from 'lucide-react';
import { Pelanggan, StatusPembayaran } from '../types';
import { formatRupiah, generateWhatsAppMessage } from '../utils/formatters';

interface WargaTableProps {
  pelangganList: Pelanggan[];
  onToggleStatus: (id: string) => void;
  onEdit: (pelanggan: Pelanggan) => void;
  onDelete: (id: string, nama: string) => void;
  onPrintKuitansi: (pelanggan: Pelanggan) => void;
}

export const WargaTable: React.FC<WargaTableProps> = ({
  pelangganList = [],
  onToggleStatus,
  onEdit,
  onDelete,
  onPrintKuitansi,
}) => {
  const safeList = pelangganList || [];

  if (safeList.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-500 shadow-2xs">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Users className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Belum Ada Data Pelanggan</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          Seluruh data demo pelanggan telah dibersihkan. Anda dapat menambahkan data pelanggan baru melalui tombol <strong>+ Tambah Warga</strong> di bilah atas.
        </p>
      </div>
    );
  }

  const getKategoriIcon = (kategori: string) => {
    switch (kategori) {
      case 'Usaha / Warung':
        return <Store className="w-3.5 h-3.5 text-amber-600" />;
      case 'Kost / Kontrakan':
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return <Home className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  const getMetodeBadge = (metode: string) => {
    switch (metode) {
      case 'Transfer':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CreditCard className="w-3 h-3" />
            <span>Transfer Bank</span>
          </span>
        );
      case 'QRIS':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <QrCode className="w-3 h-3" />
            <span>QRIS</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Banknote className="w-3 h-3" />
            <span>Tunai</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <th className="py-3.5 px-4">No</th>
              <th className="py-3.5 px-4">Nama Pelanggan / Warga</th>
              <th className="py-3.5 px-4">Lokasi & Admin Penginput</th>
              <th className="py-3.5 px-4">Besar Iuran</th>
              <th className="py-3.5 px-4">Metode Bayar</th>
              <th className="py-3.5 px-4">Status Pembayaran</th>
              <th className="py-3.5 px-4 text-center">Aksi & Layanan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {safeList.map((item, idx) => {
              const isLunas = item.status === 'Sudah Dibayar';
              const waUrl = generateWhatsAppMessage(item, isLunas ? 'receipt' : 'reminder');

              return (
                <tr 
                  key={item.id} 
                  className={`hover:bg-slate-50/80 transition-colors group ${
                    !isLunas ? 'bg-amber-50/20' : ''
                  }`}
                >
                  {/* No */}
                  <td className="py-3.5 px-4 text-xs font-medium text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Nama Pelanggan */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-slate-900">{item.nama}</span>
                        <span 
                          title={item.kategori}
                          className="p-1 rounded-md bg-slate-100/80 shrink-0"
                        >
                          {getKategoriIcon(item.kategori)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <span>{item.telepon}</span>
                        {item.catatan && (
                          <span className="text-[11px] text-slate-400 italic truncate max-w-[150px]" title={item.catatan}>
                            • {item.catatan}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Lokasi / Alamat */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-slate-800 font-medium">{item.lokasi}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center space-x-1 mt-0.5">
                        <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Admin: {item.adminPenginput || item.rtRw}</span>
                      </span>
                    </div>
                  </td>

                  {/* Besar Iuran */}
                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-slate-900">
                      {formatRupiah(item.iuran)}
                    </span>
                    <span className="block text-[10px] text-slate-400">/ bulan</span>
                  </td>

                  {/* Metode */}
                  <td className="py-3.5 px-4">
                    {getMetodeBadge(item.metode)}
                  </td>

                  {/* Status Pembayaran (Click to toggle) */}
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => onToggleStatus(item.id)}
                      title="Klik untuk mengubah status pembayaran"
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer ${
                        isLunas
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300 animate-pulse-slow'
                      }`}
                    >
                      {isLunas ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Sudah Dibayar</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-rose-700" />
                          <span>Belum Dibayar</span>
                        </>
                      )}
                    </button>
                    {isLunas && item.tanggalBayar && (
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {item.tanggalBayar}
                      </span>
                    )}
                  </td>

                  {/* Aksi & Layanan */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      
                      {/* WhatsApp Reminder / Confirmation */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-1.5 rounded-lg border transition ${
                          isLunas
                            ? 'text-emerald-700 hover:bg-emerald-50 border-emerald-200 bg-white'
                            : 'text-amber-700 hover:bg-amber-50 border-amber-200 bg-white'
                        }`}
                        title={isLunas ? 'Kirim Kuitansi WhatsApp' : 'Kirim Pengingat Tagihan WhatsApp'}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {/* Kuitansi Cetak */}
                      {isLunas && (
                        <button
                          onClick={() => onPrintKuitansi(item)}
                          className="p-1.5 text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg border border-slate-200 bg-white transition"
                          title="Cetak Kuitansi Pembayaran"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      )}

                      {/* Edit */}
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 bg-white transition"
                        title="Edit Data Pelanggan"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(item.id, item.nama)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 bg-white transition"
                        title="Hapus Pelanggan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
