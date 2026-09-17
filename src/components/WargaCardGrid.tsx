import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Printer, 
  Edit3, 
  Trash2,
  Banknote,
  CreditCard,
  QrCode,
  Store,
  Building2,
  Home,
  Users
} from 'lucide-react';
import { Pelanggan } from '../types';
import { formatRupiah, generateWhatsAppMessage } from '../utils/formatters';

interface WargaCardGridProps {
  pelangganList: Pelanggan[];
  onToggleStatus: (id: string) => void;
  onEdit: (pelanggan: Pelanggan) => void;
  onDelete: (id: string, nama: string) => void;
  onPrintKuitansi: (pelanggan: Pelanggan) => void;
}

export const WargaCardGrid: React.FC<WargaCardGridProps> = ({
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {safeList.map((item) => {
        const isLunas = item.status === 'Sudah Dibayar';
        const waUrl = generateWhatsAppMessage(item, isLunas ? 'receipt' : 'reminder');

        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border p-5 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
              isLunas 
                ? 'border-slate-200/80' 
                : 'border-amber-200/90 bg-amber-50/10'
            }`}
          >
            <div>
              {/* Header card: Name & Category */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-bold text-slate-900 text-base">{item.nama}</h3>
                    <span 
                      title={item.kategori}
                      className="p-1 rounded-md bg-slate-100 shrink-0"
                    >
                      {getKategoriIcon(item.kategori)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3 h-3 text-slate-400" />
                    <span>{item.telepon}</span>
                  </div>
                </div>

                {/* Metode Pill */}
                <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                  item.metode === 'Transfer'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : item.metode === 'QRIS'
                    ? 'bg-purple-50 text-purple-700 border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {item.metode}
                </span>
              </div>

              {/* Location details */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium text-slate-800">{item.lokasi}</p>
                  <p className="text-emerald-700 font-semibold">
                    {item.adminPenginput ? `Admin: ${item.adminPenginput}` : item.rtRw} • {item.kategori}
                  </p>
                </div>
              </div>

              {/* Catatan if available */}
              {item.catatan && (
                <p className="text-xs text-slate-500 italic mt-2 px-1">
                  "{item.catatan}"
                </p>
              )}
            </div>

            {/* Bottom: Fee amount, status toggle & actions */}
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-[11px] text-slate-400 block">Besar Iuran</span>
                  <span className="text-lg font-extrabold text-slate-900">
                    {formatRupiah(item.iuran)}
                  </span>
                </div>

                {/* Status Toggle Button */}
                <button
                  onClick={() => onToggleStatus(item.id)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                    isLunas
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                  }`}
                >
                  {isLunas ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Lunas</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-rose-700" />
                      <span>Belum Lunas</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg border font-medium ${
                    isLunas 
                      ? 'text-emerald-700 bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100' 
                      : 'text-amber-700 bg-amber-50/60 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isLunas ? 'Kuitansi WA' : 'Ingatkan WA'}</span>
                </a>

                <div className="flex items-center space-x-1">
                  {isLunas && (
                    <button
                      onClick={() => onPrintKuitansi(item)}
                      className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
                      title="Cetak Kuitansi"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition"
                    title="Edit"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id, item.nama)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
