import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Send, 
  MapPin, 
  User, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Camera,
  Trash2
} from 'lucide-react';
import { LaporanSampah } from '../types';
import { getCurrentFormattedDateTime } from '../utils/formatters';

interface ModalLaporSampahProps {
  isOpen: boolean;
  onClose: () => void;
  laporanList: LaporanSampah[];
  onTambahLaporan: (laporan: LaporanSampah) => void;
  onUpdateStatusLaporan: (id: string, newStatus: 'Menunggu' | 'Diproses' | 'Selesai') => void;
}

export const ModalLaporSampah: React.FC<ModalLaporSampahProps> = ({
  isOpen,
  onClose,
  laporanList,
  onTambahLaporan,
  onUpdateStatusLaporan,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [namaPelapor, setNamaPelapor] = useState('');
  const [telepon, setTelepon] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [jenisKeluhan, setJenisKeluhan] = useState<LaporanSampah['jenisKeluhan']>('Sampah Menumpuk');
  const [deskripsi, setDeskripsi] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPelapor.trim() || !lokasi.trim() || !deskripsi.trim()) {
      alert('Mohon isi nama, lokasi, dan penjelasan keluhan.');
      return;
    }

    const newReport: LaporanSampah = {
      id: `LAP-${Date.now().toString().slice(-4)}`,
      namaPelapor: namaPelapor.trim(),
      telepon: telepon.trim() || '081234567890',
      lokasi: lokasi.trim(),
      jenisKeluhan,
      deskripsi: deskripsi.trim(),
      tanggal: getCurrentFormattedDateTime(),
      status: 'Menunggu'
    };

    onTambahLaporan(newReport);
    setNamaPelapor('');
    setTelepon('');
    setLokasi('');
    setDeskripsi('');
    setActiveTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-amber-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">Layanan Pengaduan & Lapor Sampah</h3>
              <p className="text-xs text-amber-100">Laporkan sampah belum diangkut atau kendala kebersihan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-amber-700 text-amber-100 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-2">
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition ${
              activeTab === 'form'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Buat Laporan Baru
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition flex items-center space-x-1.5 ${
              activeTab === 'list'
                ? 'border-amber-600 text-amber-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Daftar Aduan Warga</span>
            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {laporanList.length}
            </span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Nama Pelapor <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={namaPelapor}
                    onChange={(e) => setNamaPelapor(e.target.value)}
                    placeholder="Contoh: Pak Supri / Bu Ratna"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    No. WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      placeholder="081234567890"
                      className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Jenis Keluhan
                  </label>
                  <select
                    value={jenisKeluhan}
                    onChange={(e) => setJenisKeluhan(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium"
                  >
                    <option value="Sampah Menumpuk">Sampah Menumpuk</option>
                    <option value="Belum Diangkut">Belum Diangkut / Terlewat</option>
                    <option value="Kerusakan Tempat Sampah">Kerusakan Tong / Tempat Sampah</option>
                    <option value="Lainnya">Lainnya / Permintaan Khusus</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Titik Lokasi / Alamat <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Contoh: Depan Balai Banjar 03 / Jl. Anggrek No. 04"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Keterangan & Rincian Keluhan <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Jelaskan kondisi tumpukan sampah atau request penjemputan khusus..."
                  className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
                <Camera className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Petugas piket kebersihan akan segera memeriksa lokasi setelah laporan dikirim.</span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs flex items-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Laporan</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {laporanList.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Belum ada laporan keluhan yang masuk.
                </div>
              ) : (
                laporanList.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 text-xs">{item.namaPelapor}</span>
                          <span className="text-[11px] text-slate-400">• {item.telepon}</span>
                        </div>
                        <p className="font-semibold text-xs text-amber-800 mt-0.5">
                          {item.jenisKeluhan}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatusLaporan(item.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'Diproses'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="Menunggu">⏳ Menunggu</option>
                        <option value="Diproses">🔄 Diproses</option>
                        <option value="Selesai">✅ Selesai</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {item.deskripsi}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.lokasi}</span>
                      </span>
                      <span>{item.tanggal}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
