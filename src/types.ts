export type MetodePembayaran = 'Tunai' | 'Transfer' | 'QRIS';
export type StatusPembayaran = 'Sudah Dibayar' | 'Belum Dibayar';
export type KategoriWarga = 'Rumah Tangga' | 'Usaha / Warung' | 'Kost / Kontrakan' | 'Fasilitas Umum';

export interface Pelanggan {
  id: string;
  nama: string;
  lokasi: string;
  rtRw: string;
  telepon: string;
  kategori: KategoriWarga;
  iuran: number;
  metode: MetodePembayaran;
  status: StatusPembayaran;
  tanggalBayar?: string;
  noResi?: string;
  catatan?: string;
  periodeBulan: string; // Format: "September 2026"
  adminPenginput?: string; // Nama admin yang menginput data tambahan pelanggan
}

export interface JadwalPengangkutan {
  id: string;
  hari: string;
  jam: string;
  jenisSampah: string;
  area: string;
  petugas: string;
  kontakPetugas: string;
  platNomor: string;
  statusArmada: 'Menunggu Jadwal' | 'Sedang Beroperasi' | 'Selesai';
}

export interface LaporanSampah {
  id: string;
  namaPelapor: string;
  telepon: string;
  lokasi: string;
  jenisKeluhan: 'Sampah Menumpuk' | 'Belum Diangkut' | 'Kerusakan Tempat Sampah' | 'Lainnya';
  deskripsi: string;
  tanggal: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai';
  fotoPlaceholder?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export type ViewMode = 'table' | 'cards';

export type UserRole = 'admin_keuangan' | 'admin' | 'petugas' | 'warga';

export type StatusSetoranBanjar = 'Terkonfirmasi' | 'Menunggu Verifikasi' | 'Belum Disetor';

export interface PengurusBanjar {
  id: string;
  banjar: string; // 'Banjar 01' | 'Banjar 02' | 'Banjar 03' | 'Banjar 04'
  namaPengurus: string;
  jabatan: string; // e.g. 'Bendahara Banjar' | 'Koordinator Keuangan Banjar'
  telepon: string;
  email: string;
  username: string;
  avatar?: string;
  statusAktif: boolean;
  statusSetoran: StatusSetoranBanjar;
  nominalSetoran: number;
  tanggalSetorTerakhir?: string;
  terakhirUpdateData: string;
  catatanSetoran?: string;
  metodeSetoran?: 'Transfer Rekening Kas Pusat' | 'Setor Tunai Langsung' | 'QRIS Kas';
  buktiSetoranRef?: string;
}

export interface LogUpdateBanjar {
  id: string;
  banjar: string;
  namaPengurus: string;
  jenisAktivitas: 'Update Pembayaran Warga' | 'Tambah Warga Baru' | 'Setoran Kas ke Pusat' | 'Koreksi Data Iuran';
  rincian: string;
  nominal?: number;
  waktu: string;
  statusVerifikasi: 'Terverifikasi' | 'Menunggu Verifikasi' | 'Ditinjau';
}

export interface AppUser {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  email: string;
  avatar?: string;
  phone?: string;
  rtRw?: string;
  password?: string;
}

export interface FilterState {
  search: string;
  status: 'ALL' | StatusPembayaran;
  metode: 'ALL' | MetodePembayaran;
  rtRw: string;
  sortBy: 'nama-asc' | 'nama-desc' | 'iuran-desc' | 'iuran-asc' | 'status-belum' | 'status-lunas';
}
