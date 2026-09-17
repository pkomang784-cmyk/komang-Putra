import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  UserPlus, 
  Edit3, 
  User, 
  MapPin, 
  Phone, 
  Banknote, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Tag, 
  FileText,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { Pelanggan, KategoriWarga, MetodePembayaran, StatusPembayaran, AppUser } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ModalTambahEditWargaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Pelanggan>) => void;
  editData: Pelanggan | null;
  activePeriode: string;
  currentUser?: AppUser | null;
  usersList?: AppUser[];
}

const NOMINAL_PRESETS = [25000, 30000, 35000, 50000, 75000, 100000];

export const ModalTambahEditWarga: React.FC<ModalTambahEditWargaProps> = ({
  isOpen,
  onClose,
  onSave,
  editData,
  activePeriode,
  currentUser,
  usersList = [],
}) => {
  // Pilihan nama admin penginput data pelanggan
  const adminOptions = useMemo(() => {
    const list: { name: string; roleDesc: string; isCurrent: boolean }[] = [];
    const seen = new Set<string>();

    // 1. Admin / Petugas yang sedang login saat ini (prioritas teratas)
    if (currentUser?.name) {
      list.push({
        name: currentUser.name,
        roleDesc: currentUser.roleTitle || 'Admin Aktif',
        isCurrent: true,
      });
      seen.add(currentUser.name.toLowerCase());
    }

    // 2. Daftar admin terdaftar di sistem (usersList)
    if (usersList && usersList.length > 0) {
      usersList.forEach((u) => {
        if (u.name && !seen.has(u.name.toLowerCase())) {
          list.push({
            name: u.name,
            roleDesc: u.roleTitle || (u.role === 'admin_keuangan' ? 'Admin Keuangan' : u.role === 'admin' ? 'Admin' : 'Petugas'),
            isCurrent: false,
          });
          seen.add(u.name.toLowerCase());
        }
      });
    }

    // 3. Fallback jika belum ada user tersimpan di sistem
    if (list.length === 0) {
      list.push(
        { name: 'Admin Keuangan & Input', roleDesc: 'Admin Utama', isCurrent: true },
        { name: 'Petugas Input Lapangan', roleDesc: 'Petugas Kebersihan', isCurrent: false }
      );
    }

    return list;
  }, [currentUser, usersList]);

  const defaultAdminName = currentUser?.name || adminOptions[0]?.name || 'Admin Keuangan';

  const [nama, setNama] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [adminPenginput, setAdminPenginput] = useState(defaultAdminName);
  const [isCustomAdmin, setIsCustomAdmin] = useState(false);
  const [customAdmin, setCustomAdmin] = useState('');
  const [telepon, setTelepon] = useState('');
  const [kategori, setKategori] = useState<KategoriWarga>('Rumah Tangga');
  const [iuran, setIuran] = useState<number>(25000);
  const [metode, setMetode] = useState<MetodePembayaran>('Tunai');
  const [status, setStatus] = useState<StatusPembayaran>('Belum Dibayar');
  const [catatan, setCatatan] = useState('');

  useEffect(() => {
    if (editData) {
      setNama(editData.nama);
      setLokasi(editData.lokasi);
      setTelepon(editData.telepon);
      setKategori(editData.kategori);
      setIuran(editData.iuran);
      setMetode(editData.metode);
      setStatus(editData.status);
      setCatatan(editData.catatan || '');

      const initialAdmin = editData.adminPenginput || editData.rtRw || defaultAdminName;
      const matched = adminOptions.find(a => a.name.toLowerCase() === initialAdmin.toLowerCase());
      if (matched) {
        setAdminPenginput(matched.name);
        setIsCustomAdmin(false);
        setCustomAdmin('');
      } else {
        setAdminPenginput('MANUAL');
        setIsCustomAdmin(true);
        setCustomAdmin(initialAdmin);
      }
    } else {
      setNama('');
      setLokasi('');
      setAdminPenginput(defaultAdminName);
      setIsCustomAdmin(false);
      setCustomAdmin('');
      setTelepon('08');
      setKategori('Rumah Tangga');
      setIuran(25000);
      setMetode('Tunai');
      setStatus('Belum Dibayar');
      setCatatan('');
    }
  }, [editData, isOpen, defaultAdminName, adminOptions]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !lokasi.trim()) {
      alert('Mohon lengkapi nama warga dan lokasi/alamat.');
      return;
    }

    const finalAdmin = isCustomAdmin ? (customAdmin.trim() || defaultAdminName) : adminPenginput;

    onSave({
      ...(editData ? { id: editData.id } : {}),
      nama: nama.trim(),
      lokasi: lokasi.trim(),
      rtRw: finalAdmin,
      adminPenginput: finalAdmin,
      telepon: telepon.trim() || '081200000000',
      kategori,
      iuran: Number(iuran) || 25000,
      metode,
      status,
      catatan: catatan.trim() || undefined,
      periodeBulan: editData ? editData.periodeBulan : activePeriode,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {editData ? (
              <Edit3 className="w-5 h-5 text-emerald-300" />
            ) : (
              <UserPlus className="w-5 h-5 text-emerald-300" />
            )}
            <h3 className="font-bold text-base">
              {editData ? 'Edit Data Pelanggan Iuran' : 'Tambah Pelanggan Iuran Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-700 text-emerald-200 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Nama Warga */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Nama Lengkap Pelanggan / Warga <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Contoh: Budi Santoso / Ibu Ratna"
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Lokasi & RT/RW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Lokasi / Alamat Rumah <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Jl. Mawar No. 05"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1 flex items-center justify-between">
                <span>Admin Penginput Data <span className="text-rose-500">*</span></span>
                {currentUser && (
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    Sesi: {currentUser.name}
                  </span>
                )}
              </label>
              <select
                value={isCustomAdmin ? 'MANUAL' : adminPenginput}
                onChange={(e) => {
                  if (e.target.value === 'MANUAL') {
                    setIsCustomAdmin(true);
                  } else {
                    setIsCustomAdmin(false);
                    setAdminPenginput(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 cursor-pointer"
              >
                {adminOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    👤 {opt.name} {opt.isCurrent ? '(Admin Login Saat Ini)' : `(${opt.roleDesc})`}
                  </option>
                ))}
                <option value="MANUAL">✍️ Tulis Manual Nama Admin Lain...</option>
              </select>

              {isCustomAdmin && (
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    value={customAdmin}
                    onChange={(e) => setCustomAdmin(e.target.value)}
                    placeholder="Ketik nama admin penginput data..."
                    className="w-full px-3 py-2 text-sm bg-white border border-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800 transition"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Telepon & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                No. Telepon / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Kategori Warga
              </label>
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value as KategoriWarga)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
              >
                <option value="Rumah Tangga">Rumah Tangga</option>
                <option value="Usaha / Warung">Usaha / Warung</option>
                <option value="Kost / Kontrakan">Kost / Kontrakan</option>
                <option value="Fasilitas Umum">Fasilitas Umum</option>
              </select>
            </div>
          </div>

          {/* Besar Iuran & Quick Nominal Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Besar Iuran Sampah (Rp) <span className="text-rose-500">*</span>
            </label>
            <div className="relative mb-2">
              <Banknote className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={iuran}
                onChange={(e) => setIuran(Number(e.target.value))}
                className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
              />
            </div>
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {NOMINAL_PRESETS.map((nominal) => (
                <button
                  type="button"
                  key={nominal}
                  onClick={() => setIuran(nominal)}
                  className={`text-[11px] font-semibold px-2 py-1 rounded-lg border transition ${
                    iuran === nominal
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {formatRupiah(nominal)}
                </button>
              ))}
            </div>
          </div>

          {/* Metode & Status Pembayaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Metode Pembayaran
              </label>
              <select
                value={metode}
                onChange={(e) => setMetode(e.target.value as MetodePembayaran)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
              >
                <option value="Tunai">💵 Tunai (Cash)</option>
                <option value="Transfer">🏦 Transfer Bank</option>
                <option value="QRIS">📱 QRIS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Status Pembayaran Awal
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusPembayaran)}
                className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 font-bold ${
                  status === 'Sudah Dibayar'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-500'
                    : 'bg-rose-50 text-rose-800 border-rose-300 focus:ring-rose-500'
                }`}
              >
                <option value="Belum Dibayar">⏳ Belum Dibayar</option>
                <option value="Sudah Dibayar">✅ Sudah Dibayar (Lunas)</option>
              </select>
            </div>
          </div>

          {/* Catatan Tambahan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Catatan / Keterangan (Opsional)
            </label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="Contoh: Titip di pos satpam / Bayar langsung 3 bulan"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
            >
              {editData ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
