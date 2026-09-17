import { Pelanggan } from '../types';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function generateResiNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `KUI-${dateStr}-${randomSuffix}`;
}

export function getCurrentFormattedDateTime(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());
  const hh = pad(now.getHours());
  const min = pad(now.getMinutes());
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export function generateWhatsAppMessage(pelanggan: Pelanggan, type: 'reminder' | 'receipt'): string {
  const cleanPhone = pelanggan.telepon.replace(/\D/g, '');
  let phoneFormatted = cleanPhone;
  if (cleanPhone.startsWith('0')) {
    phoneFormatted = '62' + cleanPhone.slice(1);
  } else if (!cleanPhone.startsWith('62')) {
    phoneFormatted = '62' + cleanPhone;
  }

  let text = '';
  if (type === 'receipt') {
    text = `*BUKTI PEMBAYARAN IURAN SAMPAH LINGKUNGAN*\n\n` +
      `Halo Bapak/Ibu *${pelanggan.nama}*,\n` +
      `Terima kasih! Iuran sampah Anda telah kami terima dengan rincian sbb:\n\n` +
      `📄 No. Resi: *${pelanggan.noResi || generateResiNumber()}*\n` +
      `🏠 Alamat: ${pelanggan.lokasi} (${pelanggan.rtRw})\n` +
      `📅 Periode: *${pelanggan.periodeBulan}*\n` +
      `💰 Nominal: *${formatRupiah(pelanggan.iuran)}*\n` +
      `💳 Metode: ${pelanggan.metode}\n` +
      `✅ Status: *LUNAS*\n` +
      `⏰ Tanggal: ${pelanggan.tanggalBayar || getCurrentFormattedDateTime()}\n\n` +
      `Semoga lingkungan kita senantiasa bersih, asri, dan sehat bersama. Salam Pengurus Kebersihan Lingkungan RW 05. 🌱`;
  } else {
    text = `*PENGINGAT IURAN KEBERSIHAN & SAMPAH*\n\n` +
      `Halo Bapak/Ibu *${pelanggan.nama}*,\n` +
      `Semoga dalam keadaan sehat selalu. Mengingatkan kembali untuk iuran pengelolaan sampah periode *${pelanggan.periodeBulan}*:\n\n` +
      `🏠 Alamat: ${pelanggan.lokasi} (${pelanggan.rtRw})\n` +
      `💰 Nominal: *${formatRupiah(pelanggan.iuran)}*\n` +
      `💳 Metode Tersedia: Tunai (Petugas/Pengurus Banjar) / Transfer Bank / QRIS\n` +
      `⚠️ Status: *Belum Terbayar*\n\n` +
      `Pembayaran dapat diserahkan langsung saat petugas keliling atau via transfer. Konfirmasi bukti pembayaran jika telah transfer. Terima kasih atas kerja samanya! 🙏🌱`;
  }

  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phoneFormatted}?text=${encoded}`;
}

export function exportPelangganToCSV(pelangganList: Pelanggan[], periode: string) {
  const headers = ['No Resi', 'Nama Warga', 'Alamat/Lokasi', 'Banjar', 'Telepon', 'Kategori', 'Nominal Iuran', 'Metode Bayar', 'Status Bayar', 'Tanggal Bayar', 'Catatan', 'Periode'];
  
  const rows = pelangganList.map(p => [
    p.noResi || '-',
    `"${p.nama.replace(/"/g, '""')}"`,
    `"${p.lokasi.replace(/"/g, '""')}"`,
    `"${p.rtRw}"`,
    `"${p.telepon}"`,
    `"${p.kategori}"`,
    p.iuran,
    `"${p.metode}"`,
    `"${p.status}"`,
    `"${p.tanggalBayar || '-'}"`,
    `"${(p.catatan || '-').replace(/"/g, '""')}"`,
    `"${p.periodeBulan}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  const safePeriode = periode.replace(/\s+/g, '_');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Laporan_Iuran_Sampah_${safePeriode}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
