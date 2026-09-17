import { Pelanggan, JadwalPengangkutan, LaporanSampah, AppNotification, PengurusBanjar, LogUpdateBanjar } from '../types';

export const PERIODE_DEFAULT = 'September 2026';

export const DAFTAR_PERIODE = [
  'Juli 2026',
  'Agustus 2026',
  'September 2026',
  'Oktober 2026',
  'November 2026',
  'Desember 2026'
];

export interface BanjarPetugasInfo {
  id: string;
  code: string; // e.g. "Banjar 01"
  name: string; // e.g. "Banjar 01"
  petugasName: string; // e.g. "I Made Wirawan, S.E."
  phone: string;
  username: string;
}

export const DAFTAR_BANJAR: string[] = [
  'Banjar 01',
  'Banjar 02',
  'Banjar 03',
  'Banjar 04',
  'Banjar 05',
  'Banjar 06',
  'Banjar 07',
  'Banjar 08',
  'Banjar 09'
];

export const DAFTAR_BANJAR_PETUGAS: BanjarPetugasInfo[] = [
  { id: 'B-01', code: 'Banjar 01', name: 'Banjar 01', petugasName: 'I Made Wirawan, S.E.', phone: '0812-8899-0011', username: 'bendahara_b1' },
  { id: 'B-02', code: 'Banjar 02', name: 'Banjar 02', petugasName: 'Ni Ketut Suryani', phone: '0813-7788-9900', username: 'bendahara_b2' },
  { id: 'B-03', code: 'Banjar 03', name: 'Banjar 03', petugasName: 'I Wayan Sudarta', phone: '0821-4455-6677', username: 'bendahara_b3' },
  { id: 'B-04', code: 'Banjar 04', name: 'Banjar 04', petugasName: 'I Gede Agus Pratama', phone: '0852-1122-3344', username: 'bendahara_b4' },
  { id: 'B-05', code: 'Banjar 05', name: 'Banjar 05', petugasName: 'Ni Putu Ayu Pratiwi', phone: '0878-3344-5566', username: 'bendahara_b5' },
  { id: 'B-06', code: 'Banjar 06', name: 'Banjar 06', petugasName: 'I Nyoman Sukadana', phone: '0819-2233-4455', username: 'bendahara_b6' },
  { id: 'B-07', code: 'Banjar 07', name: 'Banjar 07', petugasName: 'I Ketut Darmayasa', phone: '0857-4455-6677', username: 'bendahara_b7' },
  { id: 'B-08', code: 'Banjar 08', name: 'Banjar 08', petugasName: 'Ni Made Rai Wahyuni', phone: '0822-6677-8899', username: 'bendahara_b8' },
  { id: 'B-09', code: 'Banjar 09', name: 'Banjar 09', petugasName: 'I Wayan Budiarta', phone: '0813-9900-1122', username: 'bendahara_b9' },
];

// Data demo pelanggan telah dihapus. Data pelanggan dikelola secara mandiri.
export const INITIAL_PELANGGAN: Pelanggan[] = [];

export const INITIAL_JADWAL: JadwalPengangkutan[] = [
  {
    id: 'JDW-01',
    hari: 'Senin & Kamis',
    jam: '07:30 - 09:30 WIB',
    jenisSampah: 'Sampah Organik (Dapur & Daun)',
    area: 'Banjar 01, Banjar 02 & Banjar 03',
    petugas: 'Pak Karto & Kang Asep',
    kontakPetugas: '081234000111',
    platNomor: 'B 9123 SQP (Truk Pick-up)',
    statusArmada: 'Sedang Beroperasi'
  },
  {
    id: 'JDW-02',
    hari: 'Selasa & Jumat',
    jam: '08:00 - 10:00 WIB',
    jenisSampah: 'Sampah Anorganik & Daur Ulang',
    area: 'Banjar 04 & Area Pertokoan',
    petugas: 'Pak Slamet',
    kontakPetugas: '081234000222',
    platNomor: 'B 9482 SP (Gerobak Motor)',
    statusArmada: 'Menunggu Jadwal'
  },
  {
    id: 'JDW-03',
    hari: 'Sabtu',
    jam: '06:30 - 11:00 WIB',
    jenisSampah: 'Sampah Residu & Kebersihan Massal',
    area: 'Seluruh Wilayah Lingkungan',
    petugas: 'Tim Kebersihan Armada',
    kontakPetugas: '081234000333',
    platNomor: 'B 9001 KEL (Dump Truck)',
    statusArmada: 'Menunggu Jadwal'
  }
];

export const INITIAL_LAPORAN: LaporanSampah[] = [
  {
    id: 'LAP-001',
    namaPelapor: 'Siti Rahmawati',
    telepon: '085712349988',
    lokasi: 'Depan Gang Mawar Banjar 02',
    jenisKeluhan: 'Sampah Menumpuk',
    deskripsi: 'Ada tumpukan dahan pohon dan sampah daun kering setelah kerja bakti kemarin sore.',
    tanggal: '2026-09-02 07:15',
    status: 'Diproses'
  },
  {
    id: 'LAP-002',
    namaPelapor: 'Ahmad Wijaya',
    telepon: '081398765432',
    lokasi: 'Tempat Sampah Blok C Banjar 01',
    jenisKeluhan: 'Kerusakan Tempat Sampah',
    deskripsi: 'Tutup tong sampah umum roda patah, mohon bantuan perbaikan/ganti baru.',
    tanggal: '2026-09-01 14:20',
    status: 'Menunggu'
  }
];

export const INITIAL_NOTIFIKASI: AppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Pengangkutan Sampah Berjalan',
    message: 'Armada Truk Banjar 01 - Banjar 03 sedang beroperasi keliling pagi ini (07:30 - 09:30).',
    time: '30 menit yang lalu',
    read: false,
    type: 'info'
  },
  {
    id: 'NOTIF-2',
    title: 'Pembayaran Dikonfirmasi',
    message: 'Iuran Dewi Lestari (Jl. Dahlia No. 08) via QRIS Rp 25.000 telah terverifikasi lunas.',
    time: '2 jam yang lalu',
    read: false,
    type: 'success'
  },
  {
    id: 'NOTIF-3',
    title: 'Setoran Kas Banjar 02 Masuk',
    message: 'Ni Ketut Suryani (Bendahara Banjar 02) mengirim setoran kas Rp 180.000 menunggu verifikasi Admin Keuangan Utama.',
    time: '3 jam yang lalu',
    read: false,
    type: 'warning'
  }
];

export const INITIAL_PENGURUS_BANJAR: PengurusBanjar[] = [
  {
    id: 'PGB-01',
    banjar: 'Banjar 01',
    namaPengurus: 'I Made Wirawan, S.E.',
    jabatan: 'Bendahara & Petugas Iuran Banjar 01',
    telepon: '0812-8899-0011',
    email: 'bendahara.b1@siups.id',
    username: 'bendahara_b1',
    avatar: '👨‍💼',
    statusAktif: true,
    statusSetoran: 'Terkonfirmasi',
    nominalSetoran: 250000,
    tanggalSetorTerakhir: '05 Sep 2026, 14:30',
    terakhirUpdateData: 'Hari ini, 09:15',
    catatanSetoran: 'Setoran termin 1 iuran warga Banjar 01 telah diserahkan & diverifikasi.',
    metodeSetoran: 'Transfer Rekening Kas Pusat'
  },
  {
    id: 'PGB-02',
    banjar: 'Banjar 02',
    namaPengurus: 'Ni Ketut Suryani',
    jabatan: 'Bendahara & Petugas Iuran Banjar 02',
    telepon: '0813-7788-9900',
    email: 'bendahara.b2@siups.id',
    username: 'bendahara_b2',
    avatar: '👩‍💼',
    statusAktif: true,
    statusSetoran: 'Menunggu Verifikasi',
    nominalSetoran: 180000,
    tanggalSetorTerakhir: '07 Sep 2026, 10:20',
    terakhirUpdateData: 'Kemarin, 16:45',
    catatanSetoran: 'Setoran iuran 6 KK warga Banjar 02 via transfer Bank BCA Kas Pusat.',
    metodeSetoran: 'Transfer Rekening Kas Pusat'
  },
  {
    id: 'PGB-03',
    banjar: 'Banjar 03',
    namaPengurus: 'I Wayan Sudarta',
    jabatan: 'Bendahara & Petugas Iuran Banjar 03',
    telepon: '0821-4455-6677',
    email: 'bendahara.b3@siups.id',
    username: 'bendahara_b3',
    avatar: '👨‍💼',
    statusAktif: true,
    statusSetoran: 'Terkonfirmasi',
    nominalSetoran: 200000,
    tanggalSetorTerakhir: '04 Sep 2026, 11:00',
    terakhirUpdateData: '06 Sep 2026, 11:30',
    catatanSetoran: 'Setoran tunai diterima langsung di kantor sekretariat RW.',
    metodeSetoran: 'Setor Tunai Langsung'
  },
  {
    id: 'PGB-04',
    banjar: 'Banjar 04',
    namaPengurus: 'I Gede Agus Pratama',
    jabatan: 'Bendahara & Petugas Iuran Banjar 04',
    telepon: '0852-1122-3344',
    email: 'bendahara.b4@siups.id',
    username: 'bendahara_b4',
    avatar: '👨‍💼',
    statusAktif: true,
    statusSetoran: 'Belum Disetor',
    nominalSetoran: 0,
    tanggalSetorTerakhir: '-',
    terakhirUpdateData: '03 Sep 2026, 15:10',
    catatanSetoran: 'Penagihan iuran warga sedang berjalan hingga pertengahan bulan.',
    metodeSetoran: 'Transfer Rekening Kas Pusat'
  },
  {
    id: 'PGB-05',
    banjar: 'Banjar 05',
    namaPengurus: 'Ni Putu Ayu Pratiwi',
    jabatan: 'Bendahara & Petugas Iuran Banjar 05',
    telepon: '0878-3344-5566',
    email: 'bendahara.b5@siups.id',
    username: 'bendahara_b5',
    avatar: '👩‍💼',
    statusAktif: true,
    statusSetoran: 'Terkonfirmasi',
    nominalSetoran: 225000,
    tanggalSetorTerakhir: '06 Sep 2026, 13:00',
    terakhirUpdateData: '06 Sep 2026, 13:30',
    catatanSetoran: 'Setoran kas iuran warga Banjar 05 via QRIS Kas Pusat.',
    metodeSetoran: 'QRIS Kas'
  },
  {
    id: 'PGB-06',
    banjar: 'Banjar 06',
    namaPengurus: 'I Nyoman Sukadana',
    jabatan: 'Bendahara & Petugas Iuran Banjar 06',
    telepon: '0819-2233-4455',
    email: 'bendahara.b6@siups.id',
    username: 'bendahara_b6',
    avatar: '👨‍💼',
    statusAktif: true,
    statusSetoran: 'Menunggu Verifikasi',
    nominalSetoran: 150000,
    tanggalSetorTerakhir: '07 Sep 2026, 08:30',
    terakhirUpdateData: 'Hari ini, 08:45',
    catatanSetoran: 'Setor tunai ke rekening kas RW via Mandiri.',
    metodeSetoran: 'Transfer Rekening Kas Pusat'
  },
  {
    id: 'PGB-07',
    banjar: 'Banjar 07',
    namaPengurus: 'I Ketut Darmayasa',
    jabatan: 'Bendahara & Petugas Iuran Banjar 07',
    telepon: '0857-4455-6677',
    email: 'bendahara.b7@siups.id',
    username: 'bendahara_b7',
    avatar: '👨‍💼',
    statusAktif: true,
    statusSetoran: 'Terkonfirmasi',
    nominalSetoran: 175000,
    tanggalSetorTerakhir: '05 Sep 2026, 16:00',
    terakhirUpdateData: '05 Sep 2026, 16:15',
    catatanSetoran: 'Setoran termin 1 tunai di balai Banjar.',
    metodeSetoran: 'Setor Tunai Langsung'
  },
  {
    id: 'PGB-08',
    banjar: 'Banjar 08',
    namaPengurus: 'Ni Made Rai Wahyuni',
    jabatan: 'Bendahara & Petugas Iuran Banjar 08',
    telepon: '0822-6677-8899',
    email: 'bendahara.b8@siups.id',
    username: 'bendahara_b8',
    avatar: '👩‍💼',
    statusAktif: true,
    statusSetoran: 'Terkonfirmasi',
    nominalSetoran: 285000,
    tanggalSetorTerakhir: '06 Sep 2026, 09:40',
    terakhirUpdateData: '06 Sep 2026, 10:00',
    catatanSetoran: 'Setoran transfer Bank BNI Kas Lingkungan.',
    metodeSetoran: 'Transfer Rekening Kas Pusat'
  },
  {
    id: 'PGB-09',
    banjar: 'Banjar 09',
    namaPengurus: 'I Wayan Budiarta',
    jabatan: 'Bendahara & Petugas Iuran Banjar 09',
    telepon: '0813-9900-1122',
    email: 'bendahara.b9@siups.id',
    username: 'bendahara_b9',
    avatar: '👨‍💼',
    statusAktif: true,
    statusSetoran: 'Belum Disetor',
    nominalSetoran: 0,
    tanggalSetorTerakhir: '-',
    terakhirUpdateData: '04 Sep 2026, 17:00',
    catatanSetoran: 'Sedang proses verifikasi data warga baru dan penagihan.',
    metodeSetoran: 'Transfer Rekening Kas Pusat'
  }
];

export const INITIAL_LOG_UPDATE_BANJAR: LogUpdateBanjar[] = [
  {
    id: 'LOG-101',
    banjar: 'Banjar 02 - Ketut Suryani',
    namaPengurus: 'Ni Ketut Suryani',
    jenisAktivitas: 'Setoran Kas ke Pusat',
    rincian: 'Mengirimkan setoran kas iuran Rp 180.000 ke rekening kas pusat RW. Menunggu validasi Admin Keuangan.',
    nominal: 180000,
    waktu: 'Hari ini, 10:20',
    statusVerifikasi: 'Menunggu Verifikasi'
  },
  {
    id: 'LOG-102',
    banjar: 'Banjar 01 - Made Wirawan',
    namaPengurus: 'I Made Wirawan, S.E.',
    jenisAktivitas: 'Update Pembayaran Warga',
    rincian: 'Memperbarui status pembayaran lunas warga Budi Santoso (Rp 25.000) dan Ahmad Wijaya.',
    nominal: 25000,
    waktu: 'Hari ini, 09:15',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'LOG-103',
    banjar: 'Banjar 05 - Putu Ayu',
    namaPengurus: 'Ni Putu Ayu Pratiwi',
    jenisAktivitas: 'Setoran Kas ke Pusat',
    rincian: 'Setoran kas iuran Rp 225.000 via QRIS Kas Lingkungan berhasil terverifikasi.',
    nominal: 225000,
    waktu: 'Kemarin, 13:00',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'LOG-104',
    banjar: 'Banjar 06 - Nyoman Sukadana',
    namaPengurus: 'I Nyoman Sukadana',
    jenisAktivitas: 'Setoran Kas ke Pusat',
    rincian: 'Setoran kas iuran Rp 150.000 masuk dan menunggu persetujuan Admin Keuangan Pusat.',
    nominal: 150000,
    waktu: 'Hari ini, 08:30',
    statusVerifikasi: 'Menunggu Verifikasi'
  },
  {
    id: 'LOG-105',
    banjar: 'Banjar 08 - Made Rai',
    namaPengurus: 'Ni Made Rai Wahyuni',
    jenisAktivitas: 'Setoran Kas ke Pusat',
    rincian: 'Setoran kas iuran 10 KK Rp 285.000 telah disetor dan diverifikasi Admin Keuangan Utama.',
    nominal: 285000,
    waktu: '06 Sep 2026, 09:40',
    statusVerifikasi: 'Terverifikasi'
  },
  {
    id: 'LOG-106',
    banjar: 'Banjar 03 - Wayan Sudarta',
    namaPengurus: 'I Wayan Sudarta',
    jenisAktivitas: 'Update Pembayaran Warga',
    rincian: 'Konfirmasi pembayaran QRIS Dewi Lestari Rp 25.000 masuk ke kas iuran.',
    nominal: 25000,
    waktu: '06 Sep 2026, 11:30',
    statusVerifikasi: 'Terverifikasi'
  }
];

