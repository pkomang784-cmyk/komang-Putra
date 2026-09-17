import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Download, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Banknote,
  QrCode,
  Building2
} from 'lucide-react';
import { 
  Pelanggan, 
  JadwalPengangkutan, 
  LaporanSampah, 
  AppNotification, 
  FilterState, 
  ViewMode, 
  StatusPembayaran,
  AppUser,
  PengurusBanjar,
  LogUpdateBanjar
} from './types';
import { 
  INITIAL_PELANGGAN, 
  INITIAL_JADWAL, 
  INITIAL_LAPORAN, 
  INITIAL_NOTIFIKASI, 
  INITIAL_PENGURUS_BANJAR,
  INITIAL_LOG_UPDATE_BANJAR,
  DAFTAR_BANJAR_PETUGAS,
  PERIODE_DEFAULT 
} from './data/defaultData';
import { DEFAULT_USERS, CURRENT_USER_STORAGE_KEY, USERS_STORAGE_KEY } from './data/defaultUsers';
import { 
  formatRupiah, 
  exportPelangganToCSV, 
  getCurrentFormattedDateTime, 
  generateResiNumber 
} from './utils/formatters';

import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { JadwalBanner } from './components/JadwalBanner';
import { SearchBarAndFilters } from './components/SearchBarAndFilters';
import { WargaTable } from './components/WargaTable';
import { WargaCardGrid } from './components/WargaCardGrid';
import { ModalTambahEditWarga } from './components/ModalTambahEditWarga';
import { ModalKuitansi } from './components/ModalKuitansi';
import { ModalJadwalPengangkutan } from './components/ModalJadwalPengangkutan';
import { ModalLaporSampah } from './components/ModalLaporSampah';
import { ModalRekapCetak } from './components/ModalRekapCetak';
import { ModalLogin } from './components/ModalLogin';
import { LoginPage } from './components/LoginPage';
import { ModalMonitoringBanjar } from './components/ModalMonitoringBanjar';
import { ModalResetStatusPembayaran } from './components/ModalResetStatusPembayaran';

import { 
  subscribeToPelanggan,
  syncPelangganToCloud,
  deletePelangganFromCloud,
  batchSyncPelanggan,
  subscribeToUsers,
  syncUserToCloud,
  deleteUserFromCloud,
  subscribeToJadwal,
  syncJadwalToCloud,
  subscribeToLaporan,
  syncLaporanToCloud,
  subscribeToNotifikasi,
  syncNotifikasiToCloud,
  subscribeToLogsBanjar,
  syncLogBanjarToCloud,
  testConnection
} from './lib/firebase';

export default function App() {
  // Local storage state persistence
  const DEMO_PELANGGAN_IDS = new Set([
    'PLG-101', 'PLG-102', 'PLG-103', 'PLG-104', 'PLG-105', 'PLG-106',
    'PLG-107', 'PLG-108', 'PLG-109', 'PLG-110', 'PLG-111', 'PLG-112',
    'PLG-113', 'PLG-114', 'PLG-115', 'PLG-116', 'PLG-117', 'PLG-118'
  ]);

  const [pelangganList, setPelangganList] = useState<Pelanggan[]>(() => {
    // Bersihkan storage dari data demo pelanggan lama
    const saved = localStorage.getItem('SI_ISAM_WARGA_V3') || localStorage.getItem('SI_ISAM_WARGA_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter keluar semua pelanggan demo bawaan
          const cleaned = parsed.filter((p: Pelanggan) => !DEMO_PELANGGAN_IDS.has(p.id));
          return cleaned;
        }
        return [];
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [jadwalList, setJadwalList] = useState<JadwalPengangkutan[]>(() => {
    const saved = localStorage.getItem('SI_ISAM_JADWAL_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return INITIAL_JADWAL;
      } catch (e) {
        return INITIAL_JADWAL;
      }
    }
    return INITIAL_JADWAL;
  });

  const [laporanList, setLaporanList] = useState<LaporanSampah[]>(() => {
    const saved = localStorage.getItem('SI_ISAM_LAPORAN_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return INITIAL_LAPORAN;
      } catch (e) {
        return INITIAL_LAPORAN;
      }
    }
    return INITIAL_LAPORAN;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('SI_ISAM_NOTIF_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return INITIAL_NOTIFIKASI;
      } catch (e) {
        return INITIAL_NOTIFIKASI;
      }
    }
    return INITIAL_NOTIFIKASI;
  });

  const [periode, setPeriode] = useState<string>(PERIODE_DEFAULT);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    status: 'ALL',
    metode: 'ALL',
    rtRw: 'ALL',
    sortBy: 'status-belum'
  });

  // Modals state
  const [isTambahEditOpen, setIsTambahEditOpen] = useState(false);
  const [selectedWargaForEdit, setSelectedWargaForEdit] = useState<Pelanggan | null>(null);

  const [isKuitansiOpen, setIsKuitansiOpen] = useState(false);
  const [selectedWargaForKuitansi, setSelectedWargaForKuitansi] = useState<Pelanggan | null>(null);

  const [isJadwalOpen, setIsJadwalOpen] = useState(false);
  const [isLaporOpen, setIsLaporOpen] = useState(false);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState(false);
  const [isMonitoringBanjarOpen, setIsMonitoringBanjarOpen] = useState(false);
  const [isResetStatusModalOpen, setIsResetStatusModalOpen] = useState(false);

  // Pengurus Banjar & Logs State
  const [pengurusList, setPengurusList] = useState<PengurusBanjar[]>(() => {
    const saved = localStorage.getItem('SI_UPS_PENGURUS_BANJAR_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PENGURUS_BANJAR.length) {
          return parsed;
        }
        return INITIAL_PENGURUS_BANJAR;
      } catch (e) {
        return INITIAL_PENGURUS_BANJAR;
      }
    }
    return INITIAL_PENGURUS_BANJAR;
  });

  const [logsBanjarList, setLogsBanjarList] = useState<LogUpdateBanjar[]>(() => {
    const saved = localStorage.getItem('SI_UPS_LOGS_BANJAR_V2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        return INITIAL_LOG_UPDATE_BANJAR;
      } catch (e) {
        return INITIAL_LOG_UPDATE_BANJAR;
      }
    }
    return INITIAL_LOG_UPDATE_BANJAR;
  });

  useEffect(() => {
    localStorage.setItem('SI_UPS_PENGURUS_BANJAR_V2', JSON.stringify(pengurusList));
  }, [pengurusList]);

  useEffect(() => {
    localStorage.setItem('SI_UPS_LOGS_BANJAR_V2', JSON.stringify(logsBanjarList));
  }, [logsBanjarList]);

  // User Auth & Users Management State
  // Kebijakan: Setiap membuka aplikasi wajib login terlebih dahulu
  const DEMO_USER_IDS = ['USR-000', 'USR-001', 'USR-002', 'USR-003', 'USR-004', 'USR-005'];

  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    // Sesi aktif per-tab browser (sessionStorage)
    const sessionUser = sessionStorage.getItem('SI_UPS_ACTIVE_SESSION_USER');
    if (sessionUser) {
      try {
        const parsed = JSON.parse(sessionUser);
        if (parsed && !DEMO_USER_IDS.includes(parsed.id)) {
          return parsed;
        }
        sessionStorage.removeItem('SI_UPS_ACTIVE_SESSION_USER');
      } catch (e) {
        return null;
      }
    }
    // Hapus sisa localStorage auto-login agar selalu wajib login saat aplikasi dibuka kembali
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    // Nilai awal null: mewajibkan pengguna login terlebih dahulu
    return null;
  });

  const [isLoginPageActive, setIsLoginPageActive] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'login' | 'register'>('login');

  const [usersList, setUsersList] = useState<AppUser[]>(() => {
    // Bersihkan legacy storage demo accounts
    try {
      localStorage.removeItem('SI_UPS_ALL_USERS_V4');
      localStorage.removeItem('SI_UPS_ALL_USERS_V3');
      localStorage.removeItem('SI_UPS_ALL_USERS_V2');
      localStorage.removeItem('SI_UPS_ALL_USERS');
    } catch (e) {
      // ignore
    }

    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Bersihkan jika ada akun demo terdahulu
          return parsed.filter(u => !DEMO_USER_IDS.includes(u.id));
        }
      } catch (e) {
        return [];
      }
    }
    return DEFAULT_USERS;
  });

  const handleOpenLoginModal = (tab: 'login' | 'register' = 'login') => {
    setLoginModalTab(tab);
    setIsLoginOpen(true);
  };

  const handleOpenLoginPage = (tab: 'login' | 'register' = 'login') => {
    setLoginModalTab(tab);
    setIsLoginPageActive(true);
  };

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    sessionStorage.setItem('SI_UPS_ACTIVE_SESSION_USER', JSON.stringify(user));
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    showToast(`Berhasil masuk sebagai ${user.name} (${user.roleTitle})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('SI_UPS_ACTIVE_SESSION_USER');
    try {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setIsLoginPageActive(true);
    showToast('Anda telah keluar dari akun. Silakan login kembali.');
  };

  const handleCreateUser = (newUser: AppUser) => {
    setUsersList(prev => {
      const updated = [...prev, newUser];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    syncUserToCloud(newUser).catch(err => console.error('Error syncing user to cloud:', err));
    showToast(`User baru "${newUser.name}" (${newUser.roleTitle}) berhasil dibuat!`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsersList(prev => {
      const updated = prev.filter(u => u.id !== userId);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    deleteUserFromCloud(userId).catch(err => console.error('Error deleting user from cloud:', err));
    showToast('Akun pengguna telah dihapus.');
  };

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
  }, [usersList]);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('SI_ISAM_WARGA_V3', JSON.stringify(pelangganList));
    localStorage.setItem('SI_ISAM_WARGA_V2', JSON.stringify(pelangganList));
  }, [pelangganList]);

  useEffect(() => {
    localStorage.setItem('SI_ISAM_JADWAL_V2', JSON.stringify(jadwalList));
  }, [jadwalList]);

  useEffect(() => {
    localStorage.setItem('SI_ISAM_LAPORAN_V2', JSON.stringify(laporanList));
  }, [laporanList]);

  useEffect(() => {
    localStorage.setItem('SI_ISAM_NOTIF_V2', JSON.stringify(notifications));
  }, [notifications]);

  // Toast auto dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Cloud Sync Connection State
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(true);

  // Real-time synchronization across devices (HP & Laptop) via Firebase Firestore
  useEffect(() => {
    // 1. Check connection
    testConnection().then((connected) => {
      setIsCloudConnected(connected);
    });

    // 2. Real-time Pelanggan subscription
    let isInitialPelangganRun = true;
    const unsubPelanggan = subscribeToPelanggan(
      (cloudPelanggan) => {
        setIsCloudConnected(true);
        if (cloudPelanggan.length > 0) {
          setPelangganList(cloudPelanggan);
        } else if (isInitialPelangganRun) {
          // If cloud is empty on initial setup, check if local storage had any residents
          const localSaved = localStorage.getItem('SI_ISAM_WARGA_V3') || localStorage.getItem('SI_ISAM_WARGA_V2');
          if (localSaved) {
            try {
              const parsed = JSON.parse(localSaved);
              if (Array.isArray(parsed) && parsed.length > 0) {
                const cleaned = parsed.filter((p: Pelanggan) => !DEMO_PELANGGAN_IDS.has(p.id));
                if (cleaned.length > 0) {
                  batchSyncPelanggan(cleaned).catch(console.error);
                }
              }
            } catch (e) {
              // ignore
            }
          }
        }
        isInitialPelangganRun = false;
      },
      (err) => {
        console.warn('Pelanggan sync listener warning:', err);
      }
    );

    // 3. Real-time App Users (Admin & Petugas) subscription
    let isInitialUsersRun = true;
    const unsubUsers = subscribeToUsers(
      (cloudUsers) => {
        setIsCloudConnected(true);
        if (cloudUsers.length > 0) {
          setUsersList(cloudUsers);
        } else if (isInitialUsersRun) {
          // Seed DEFAULT_USERS to cloud so accounts are available on both laptop and phone
          DEFAULT_USERS.forEach(u => syncUserToCloud(u).catch(console.error));
        }
        isInitialUsersRun = false;
      },
      (err) => {
        console.warn('Users sync listener warning:', err);
      }
    );

    // 4. Real-time Jadwal subscription
    const unsubJadwal = subscribeToJadwal(
      (cloudJadwal) => {
        if (cloudJadwal.length > 0) {
          setJadwalList(cloudJadwal);
        } else {
          INITIAL_JADWAL.forEach(j => syncJadwalToCloud(j).catch(console.error));
        }
      },
      (err) => console.warn('Jadwal sync warning:', err)
    );

    // 5. Real-time Laporan subscription
    const unsubLaporan = subscribeToLaporan(
      (cloudLaporan) => {
        if (cloudLaporan.length > 0) {
          setLaporanList(cloudLaporan);
        }
      },
      (err) => console.warn('Laporan sync warning:', err)
    );

    // 6. Real-time Notifikasi subscription
    const unsubNotifikasi = subscribeToNotifikasi(
      (cloudNotif) => {
        if (cloudNotif.length > 0) {
          setNotifications(cloudNotif);
        }
      },
      (err) => console.warn('Notifikasi sync warning:', err)
    );

    // 7. Real-time Logs Banjar subscription
    const unsubLogs = subscribeToLogsBanjar(
      (cloudLogs) => {
        if (cloudLogs.length > 0) {
          setLogsBanjarList(cloudLogs);
        }
      },
      (err) => console.warn('Logs sync warning:', err)
    );

    return () => {
      unsubPelanggan();
      unsubUsers();
      unsubJadwal();
      unsubLaporan();
      unsubNotifikasi();
      unsubLogs();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Helper to check admin privileges (Admin Keuangan Utama or Pengurus Banjar)
  const isAuthorizedAdmin = currentUser?.role === 'admin_keuangan' || currentUser?.role === 'admin';

  // Handler: Toggle Status Pembayaran 1-Klik
  const handleToggleStatus = (id: string) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (currentUser.role === 'warga') {
      showToast('Warga hanya dapat melihat kuitansi. Konfirmasi pelunasan dilakukan oleh Bendahara Banjar.');
      return;
    }

    setPelangganList(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextStatus = item.status === 'Sudah Dibayar' ? 'Belum Dibayar' : 'Sudah Dibayar';
          const isLunasNow = nextStatus === 'Sudah Dibayar';
          
          showToast(
            isLunasNow
              ? `Status ${item.nama} diperbarui: Iuran LUNAS! 🎉`
              : `Status ${item.nama} diubah menjadi Belum Lunas.`
          );

          // Record live update log for Admin Keuangan Utama monitoring
          const newLog: LogUpdateBanjar = {
            id: `LOG-${Date.now()}`,
            banjar: item.rtRw || 'Banjar 01',
            namaPengurus: currentUser.name,
            jenisAktivitas: 'Update Pembayaran Warga',
            rincian: `${currentUser.name} mengubah status iuran ${item.nama} (${formatRupiah(item.iuran)}) menjadi ${isLunasNow ? 'LUNAS' : 'BELUM DIBAYAR'}.`,
            nominal: item.iuran,
            waktu: 'Baru saja',
            statusVerifikasi: 'Terverifikasi'
          };
          setLogsBanjarList(prevLogs => [newLog, ...prevLogs]);
          syncLogBanjarToCloud(newLog).catch(err => console.error('Error syncing log to cloud:', err));

          const updatedItem = {
            ...item,
            status: nextStatus,
            tanggalBayar: isLunasNow ? getCurrentFormattedDateTime() : undefined,
            noResi: isLunasNow ? (item.noResi || generateResiNumber()) : undefined
          };

          syncPelangganToCloud(updatedItem).catch(err => console.error('Error syncing warga status to cloud:', err));

          return updatedItem;
        }
        return item;
      })
    );
  };

  // Handler: Save / Add Warga
  const handleSaveWarga = (formData: Partial<Pelanggan>) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (!isAuthorizedAdmin) {
      showToast('Akses dibatasi: Hanya Bendahara Banjar atau Admin Keuangan Utama yang dapat menambah atau mengubah data warga.');
      return;
    }

    if (formData.id) {
      // Edit existing
      const existing = pelangganList.find(p => p.id === formData.id);
      const updatedWarga = existing ? ({ ...existing, ...formData } as Pelanggan) : (formData as Pelanggan);

      setPelangganList(prev =>
        prev.map(p => (p.id === formData.id ? updatedWarga : p))
      );
      syncPelangganToCloud(updatedWarga).catch(err => console.error('Error syncing updated warga:', err));
      showToast(`Data warga ${formData.nama} berhasil diperbarui.`);

      // Log update
      const newLog: LogUpdateBanjar = {
        id: `LOG-${Date.now()}`,
        banjar: formData.rtRw || formData.adminPenginput || 'Umum',
        namaPengurus: currentUser.name,
        jenisAktivitas: 'Koreksi Data Iuran',
        rincian: `${currentUser.name} memperbarui data warga ${formData.nama}.`,
        nominal: formData.iuran,
        waktu: 'Baru saja',
        statusVerifikasi: 'Terverifikasi'
      };
      setLogsBanjarList(prevLogs => [newLog, ...prevLogs]);
      syncLogBanjarToCloud(newLog).catch(err => console.error('Error syncing log to cloud:', err));
    } else {
      // Add new
      const newWarga: Pelanggan = {
        id: `PLG-${Date.now().toString().slice(-4)}`,
        nama: formData.nama || '',
        lokasi: formData.lokasi || '',
        rtRw: formData.rtRw || formData.adminPenginput || currentUser?.name || 'Admin Keuangan',
        adminPenginput: formData.adminPenginput || formData.rtRw || currentUser?.name || 'Admin Keuangan',
        telepon: formData.telepon || '081234567890',
        kategori: formData.kategori || 'Rumah Tangga',
        iuran: Number(formData.iuran) || 25000,
        metode: formData.metode || 'Tunai',
        status: formData.status || 'Belum Dibayar',
        catatan: formData.catatan,
        periodeBulan: periode,
        tanggalBayar: formData.status === 'Sudah Dibayar' ? getCurrentFormattedDateTime() : undefined,
        noResi: formData.status === 'Sudah Dibayar' ? generateResiNumber() : undefined
      };

      setPelangganList(prev => [newWarga, ...prev]);
      syncPelangganToCloud(newWarga).catch(err => console.error('Error syncing new warga to cloud:', err));
      showToast(`Pelanggan baru ${newWarga.nama} berhasil didaftarkan.`);

      // Add to notification
      const newNotif: AppNotification = {
        id: `NOTIF-${Date.now()}`,
        title: 'Warga Baru Ditambahkan',
        message: `${newWarga.nama} (${newWarga.lokasi}) terdaftar oleh admin ${newWarga.adminPenginput || currentUser.name}.`,
        time: 'Baru saja',
        read: false,
        type: 'info'
      };
      setNotifications(prev => [newNotif, ...prev]);
      syncNotifikasiToCloud(newNotif).catch(err => console.error('Error syncing notif to cloud:', err));

      // Log update for monitoring
      const newLog: LogUpdateBanjar = {
        id: `LOG-${Date.now()}`,
        banjar: newWarga.rtRw,
        namaPengurus: newWarga.adminPenginput || currentUser.name,
        jenisAktivitas: 'Tambah Warga Baru',
        rincian: `${newWarga.adminPenginput || currentUser.name} mendaftarkan pelanggan baru ${newWarga.nama} (${newWarga.kategori}).`,
        nominal: newWarga.iuran,
        waktu: 'Baru saja',
        statusVerifikasi: 'Terverifikasi'
      };
      setLogsBanjarList(prevLogs => [newLog, ...prevLogs]);
      syncLogBanjarToCloud(newLog).catch(err => console.error('Error syncing log to cloud:', err));
    }
  };

  // Handler: Delete Warga
  const handleDeleteWarga = (id: string, nama: string) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (!isAuthorizedAdmin) {
      showToast('Akses dibatasi: Hanya Bendahara Banjar atau Admin Keuangan Utama yang dapat menghapus data warga.');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus data warga "${nama}"?`)) {
      setPelangganList(prev => prev.filter(p => p.id !== id));
      deletePelangganFromCloud(id).catch(err => console.error('Error deleting warga from cloud:', err));
      showToast(`Data warga ${nama} telah dihapus.`);
    }
  };

  // Handler: Open Edit Modal
  const handleOpenEdit = (pelanggan: Pelanggan) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (!isAuthorizedAdmin) {
      showToast('Akses dibatasi: Hanya Bendahara Banjar atau Admin Keuangan Utama yang berhak mengedit data warga.');
      return;
    }
    setSelectedWargaForEdit(pelanggan);
    setIsTambahEditOpen(true);
  };

  // Handler: Verifikasi Setoran Kas dari Pengurus Banjar (Admin Keuangan Utama)
  const handleVerifikasiSetoran = (pengurusId: string) => {
    const target = pengurusList.find(p => p.id === pengurusId);
    if (!target) return;

    setPengurusList(prev => prev.map(p => {
      if (p.id === pengurusId) {
        return {
          ...p,
          statusSetoran: 'Terkonfirmasi' as const,
          terakhirUpdateData: 'Baru saja'
        };
      }
      return p;
    }));

    const newLog: LogUpdateBanjar = {
      id: `LOG-${Date.now()}`,
      banjar: target.banjar,
      namaPengurus: currentUser?.name || 'Admin Keuangan Utama',
      jenisAktivitas: 'Setoran Kas ke Pusat',
      rincian: `Setoran kas iuran ${target.banjar} sebesar ${formatRupiah(target.nominalSetoran)} telah DIVERIFIKASI & DITERIMA oleh Admin Keuangan Utama.`,
      nominal: target.nominalSetoran,
      waktu: 'Baru saja',
      statusVerifikasi: 'Terverifikasi'
    };
    setLogsBanjarList(prev => [newLog, ...prev]);

    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Setoran Kas Terverifikasi',
        message: `Setoran kas dari ${target.banjar} (${formatRupiah(target.nominalSetoran)}) telah disetujui & masuk kas pusat.`,
        time: 'Baru saja',
        read: false,
        type: 'success'
      },
      ...prev
    ]);

    showToast(`Setoran kas dari ${target.banjar} (${formatRupiah(target.nominalSetoran)}) berhasil diverifikasi!`);
  };

  // Handler: Update Data Pengurus Banjar
  const handleUpdatePengurus = (updated: PengurusBanjar) => {
    setPengurusList(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`Data pengurus untuk ${updated.banjar} berhasil diperbarui.`);
  };

  // Handler: Submit Setoran Kas oleh Bendahara Banjar
  const handleSubmitSetoranBanjar = (
    banjar: string, 
    nominal: number, 
    metode: 'Transfer Rekening Kas Pusat' | 'Setor Tunai Langsung' | 'QRIS Kas', 
    catatan: string
  ) => {
    const pengurus = pengurusList.find(p => p.banjar === banjar);
    const namaPengurus = currentUser?.name || pengurus?.namaPengurus || 'Bendahara Banjar';

    setPengurusList(prev => prev.map(p => {
      if (p.banjar === banjar) {
        return {
          ...p,
          statusSetoran: 'Menunggu Verifikasi' as const,
          nominalSetoran: nominal,
          metodeSetoran: metode,
          tanggalSetorTerakhir: getCurrentFormattedDateTime(),
          catatanSetoran: catatan || `Setoran via ${metode}`,
          terakhirUpdateData: 'Baru saja'
        };
      }
      return p;
    }));

    const newLog: LogUpdateBanjar = {
      id: `LOG-${Date.now()}`,
      banjar,
      namaPengurus,
      jenisAktivitas: 'Setoran Kas ke Pusat',
      rincian: `${namaPengurus} mengajukan setoran kas sebesar ${formatRupiah(nominal)} via ${metode}. Menunggu verifikasi Admin Keuangan Utama.`,
      nominal,
      waktu: 'Baru saja',
      statusVerifikasi: 'Menunggu Verifikasi'
    };
    setLogsBanjarList(prev => [newLog, ...prev]);

    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: `Setoran Kas Masuk: ${banjar}`,
        message: `${namaPengurus} menyetorkan kas ${formatRupiah(nominal)} via ${metode}.`,
        time: 'Baru saja',
        read: false,
        type: 'warning'
      },
      ...prev
    ]);

    showToast(`Setoran kas dari ${banjar} sebesar ${formatRupiah(nominal)} telah terkirim!`);
  };

  // Handler: Open Print Kuitansi
  const handleOpenPrintKuitansi = (pelanggan: Pelanggan) => {
    setSelectedWargaForKuitansi(pelanggan);
    setIsKuitansiOpen(true);
  };

  // Handler: Export CSV
  const handleExportCSV = () => {
    exportPelangganToCSV(filteredAndSortedPelanggan, periode);
    showToast('Laporan Iuran Sampah berhasil diunduh (CSV).');
  };

  // Handler: Reset Default Data
  const handleResetDefaultData = () => {
    if (window.confirm('Reset data operasional (jadwal & laporan) ke pengaturan awal? Data demo pelanggan telah dinonaktifkan sehingga daftar pelanggan akan tetap kosong atau bersih.')) {
      setPelangganList([]);
      setJadwalList(INITIAL_JADWAL);
      setLaporanList(INITIAL_LAPORAN);
      setNotifications(INITIAL_NOTIFIKASI);
      setPengurusList(INITIAL_PENGURUS_BANJAR);
      setLogsBanjarList(INITIAL_LOG_UPDATE_BANJAR);
      localStorage.removeItem('SI_ISAM_WARGA_V3');
      localStorage.removeItem('SI_ISAM_WARGA_V2');
      localStorage.removeItem('SI_UPS_PENGURUS_BANJAR_V2');
      localStorage.removeItem('SI_UPS_LOGS_BANJAR_V2');
      showToast('Data berhasil di-reset.');
    }
  };

  // Handler: Batch mark all as Lunas
  const handleBatchMarkAllLunas = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (!isAuthorizedAdmin) {
      showToast('Akses dibatasi: Hanya Pengurus Banjar atau Admin Keuangan Utama yang dapat menandai semua warga lunas.');
      return;
    }

    if (window.confirm(`Tandai semua ${filteredAndSortedPelanggan.length} warga yang tampil sebagai LUNAS?`)) {
      const idsToMark = new Set(filteredAndSortedPelanggan.map(p => p.id));
      const updatedList = pelangganList.map(p => {
        if (idsToMark.has(p.id)) {
          return {
            ...p,
            status: 'Sudah Dibayar' as const,
            tanggalBayar: p.tanggalBayar || getCurrentFormattedDateTime(),
            noResi: p.noResi || generateResiNumber()
          };
        }
        return p;
      });
      setPelangganList(updatedList);
      batchSyncPelanggan(updatedList).catch(err => console.error('Error syncing batch lunas to cloud:', err));
      showToast('Semua data warga berhasil ditandai Lunas & disinkronkan ke Cloud.');
    }
  };

  // Handler: Reset status pembayaran SEMUA pelanggan menjadi 'Belum Dibayar' (Hanya Admin)
  const handleResetStatusPembayaranSemua = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (!isAuthorizedAdmin) {
      showToast('Akses ditolak: Hanya Admin (Admin Keuangan Utama atau Bendahara Banjar) yang dapat me-reset status pembayaran.');
      return;
    }

    const resetList = pelangganList.map(p => ({
      ...p,
      status: 'Belum Dibayar' as const,
      tanggalBayar: undefined,
      noResi: undefined
    }));
    setPelangganList(resetList);
    batchSyncPelanggan(resetList).catch(err => console.error('Error syncing reset to cloud:', err));

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Status Pembayaran Di-reset oleh Admin',
      message: `Status pembayaran seluruh ${pelangganList.length} pelanggan telah di-reset menjadi Belum Dibayar oleh Admin ${currentUser.name}.`,
      time: 'Baru saja',
      read: false,
      type: 'warning'
    };
    setNotifications(prev => [newNotif, ...prev]);
    syncNotifikasiToCloud(newNotif).catch(err => console.error('Error syncing notif to cloud:', err));

    showToast(`Status pembayaran seluruh ${pelangganList.length} pelanggan berhasil di-reset & tersinkron.`);
  };

  // Handler: Reset status pembayaran HANYA untuk pelanggan yang sedang terfilter (Hanya Admin)
  const handleResetStatusPembayaranFiltered = () => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (!isAuthorizedAdmin) {
      showToast('Akses ditolak: Hanya Admin (Admin Keuangan Utama atau Bendahara Banjar) yang dapat me-reset status pembayaran.');
      return;
    }

    const filteredIds = new Set(filteredAndSortedPelanggan.map(p => p.id));
    const updatedList = pelangganList.map(p => {
      if (filteredIds.has(p.id)) {
        return {
          ...p,
          status: 'Belum Dibayar' as const,
          tanggalBayar: undefined,
          noResi: undefined
        };
      }
      return p;
    });
    setPelangganList(updatedList);
    batchSyncPelanggan(updatedList).catch(err => console.error('Error syncing filtered reset to cloud:', err));

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}`,
      title: 'Status Pembayaran Terfilter Di-reset oleh Admin',
      message: `Status pembayaran ${filteredAndSortedPelanggan.length} pelanggan terpilih telah di-reset menjadi Belum Dibayar oleh Admin ${currentUser.name}.`,
      time: 'Baru saja',
      read: false,
      type: 'warning'
    };
    setNotifications(prev => [newNotif, ...prev]);
    syncNotifikasiToCloud(newNotif).catch(err => console.error('Error syncing notif to cloud:', err));

    showToast(`Status pembayaran ${filteredAndSortedPelanggan.length} pelanggan terpilih berhasil di-reset & tersinkron.`);
  };

  // Handler: Toggle Jadwal status
  const handleToggleStatusJadwal = (id: string) => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (currentUser.role === 'warga') {
      showToast('Status armada truk sampah hanya dapat dikelola oleh Petugas atau Pengurus RW.');
      return;
    }

    setJadwalList(prev =>
      prev.map(j => {
        if (j.id === id) {
          const next = 
            j.statusArmada === 'Menunggu Jadwal'
              ? 'Sedang Beroperasi'
              : j.statusArmada === 'Sedang Beroperasi'
              ? 'Selesai'
              : 'Menunggu Jadwal';
          const updated = { ...j, statusArmada: next as any };
          syncJadwalToCloud(updated).catch(err => console.error('Error syncing jadwal to cloud:', err));
          return updated;
        }
        return j;
      })
    );
    showToast('Status operasional armada diperbarui & tersinkron ke semua perangkat.');
  };

  // Handler: Tambah Laporan Sampah
  const handleTambahLaporan = (newLaporan: LaporanSampah) => {
    setLaporanList(prev => [newLaporan, ...prev]);
    syncLaporanToCloud(newLaporan).catch(err => console.error('Error syncing laporan to cloud:', err));
    showToast('Laporan keluhan sampah berhasil dikirim ke pengurus & tersinkron.');
  };

  // Handler: Update status laporan
  const handleUpdateStatusLaporan = (id: string, newStatus: 'Menunggu' | 'Diproses' | 'Selesai') => {
    if (!currentUser) {
      setIsLoginOpen(true);
      return;
    }
    if (currentUser.role === 'warga') {
      showToast('Status penanganan keluhan diperbarui oleh Petugas Kebersihan atau Pengurus RW.');
      return;
    }

    setLaporanList(prev =>
      prev.map(l => {
        if (l.id === id) {
          const updated = { ...l, status: newStatus };
          syncLaporanToCloud(updated).catch(err => console.error('Error syncing status laporan:', err));
          return updated;
        }
        return l;
      })
    );
    showToast(`Status laporan diubah menjadi "${newStatus}" & disinkronkan.`);
  };

  // Handler: Mark notifications read
  const handleMarkNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Filter & Sort computation
  const filteredAndSortedPelanggan = useMemo(() => {
    return (pelangganList || [])
      .filter(item => {
        const query = filterState.search.toLowerCase();
        const matchSearch =
          item.nama.toLowerCase().includes(query) ||
          item.lokasi.toLowerCase().includes(query) ||
          (item.adminPenginput && item.adminPenginput.toLowerCase().includes(query)) ||
          item.rtRw.toLowerCase().includes(query) ||
          item.telepon.includes(query) ||
          (item.catatan && item.catatan.toLowerCase().includes(query));

        const matchStatus =
          filterState.status === 'ALL' || item.status === filterState.status;

        const matchMetode =
          filterState.metode === 'ALL' || item.metode === filterState.metode;

        let matchRt = false;
        if (filterState.rtRw === 'ALL') {
          matchRt = true;
        } else {
          const selectedFilter = filterState.rtRw.toLowerCase();
          const itemRtRw = (item.rtRw || '').toLowerCase();
          const itemAdmin = (item.adminPenginput || '').toLowerCase();

          if (
            itemRtRw === selectedFilter || itemRtRw.includes(selectedFilter) || selectedFilter.includes(itemRtRw) ||
            itemAdmin === selectedFilter || itemAdmin.includes(selectedFilter) || selectedFilter.includes(itemAdmin)
          ) {
            matchRt = true;
          } else {
            // Check matching Banjar codes e.g. "Banjar 01" ... "Banjar 09"
            const filterMatch = selectedFilter.match(/banjar\s*0?(\d+)/i);
            const itemMatch = itemRtRw.match(/banjar\s*0?(\d+)/i);
            if (filterMatch && itemMatch && filterMatch[1] === itemMatch[1]) {
              matchRt = true;
            }
          }
        }

        return matchSearch && matchStatus && matchMetode && matchRt;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'status-belum':
            if (a.status === b.status) return a.nama.localeCompare(b.nama);
            return a.status === 'Belum Dibayar' ? -1 : 1;
          case 'status-lunas':
            if (a.status === b.status) return a.nama.localeCompare(b.nama);
            return a.status === 'Sudah Dibayar' ? -1 : 1;
          case 'nama-asc':
            return a.nama.localeCompare(b.nama);
          case 'nama-desc':
            return b.nama.localeCompare(a.nama);
          case 'iuran-desc':
            return b.iuran - a.iuran;
          case 'iuran-asc':
            return a.iuran - b.iuran;
          default:
            return 0;
        }
      });
  }, [pelangganList, filterState]);

  const availableAdminNames = useMemo(() => {
    const set = new Set<string>();
    if (currentUser?.name) set.add(currentUser.name);
    usersList.forEach(u => {
      if (u.name) set.add(u.name);
    });
    pelangganList.forEach(p => {
      if (p.adminPenginput) set.add(p.adminPenginput);
    });
    return Array.from(set);
  }, [currentUser, usersList, pelangganList]);

  // Proteksi Akses: Setiap membuka aplikasi WAJIB login terlebih dahulu sebelum masuk ke dashboard
  if (!currentUser || isLoginPageActive) {
    return (
      <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white text-xs ml-2"
            >
              ✕
            </button>
          </div>
        )}
        <LoginPage
          currentUser={currentUser}
          usersList={usersList}
          onLogin={(user) => {
            handleLogin(user);
            setIsLoginPageActive(false);
          }}
          onCreateUser={handleCreateUser}
          onDeleteUser={handleDeleteUser}
          onNavigateToDashboard={() => {
            if (currentUser) {
              setIsLoginPageActive(false);
            } else {
              showToast('Wajib login terlebih dahulu untuk mengakses dashboard!');
            }
          }}
          initialTab={loginModalTab}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 selection:bg-emerald-200">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white text-xs ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Header Navigation Bar */}
      <Header
        periode={periode}
        onPeriodeChange={setPeriode}
        onExportCSV={handleExportCSV}
        onOpenPrintRekap={() => setIsPrintRekapOpen(true)}
        onOpenTambahModal={() => {
          if (!currentUser) {
            setIsLoginOpen(true);
            return;
          }
          if (!isAuthorizedAdmin) {
            showToast('Hanya Bendahara Banjar atau Admin Keuangan Utama yang dapat menambah data warga.');
            return;
          }
          setSelectedWargaForEdit(null);
          setIsTambahEditOpen(true);
        }}
        onOpenLaporModal={() => setIsLaporOpen(true)}
        onOpenJadwalModal={() => setIsJadwalOpen(true)}
        onOpenMonitoringBanjar={() => setIsMonitoringBanjarOpen(true)}
        notifications={notifications}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        currentUser={currentUser}
        onOpenLoginModal={handleOpenLoginModal}
        onNavigateToLoginPage={() => handleOpenLoginPage('login')}
        onResetStatusBayar={() => setIsResetStatusModalOpen(true)}
        onLogout={handleLogout}
        isCloudSynced={isCloudConnected}
      />

      {/* 2. Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* User Role Banner / Notification */}
        {currentUser?.role === 'admin_keuangan' ? (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/10 border border-amber-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white shadow-xs flex items-center justify-center text-xl shrink-0 font-bold">
                👑
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-extrabold text-slate-900 text-sm">
                    {currentUser.name} — Admin Keuangan Utama (Pusat)
                  </p>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold border border-amber-300">
                    Terkoneksi 4 Banjar
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Anda memiliki otoritas penuh memonitor data masuk pengurus/bendahara banjar, verifikasi setoran kas pusat, dan kontrol mutasi iuran 4 banjar.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setIsMonitoringBanjarOpen(true)}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center space-x-1.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Pusat Monitoring Banjar</span>
              </button>
              <button
                onClick={() => handleOpenLoginPage('login')}
                className="px-2.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 font-semibold rounded-xl text-slate-700 transition cursor-pointer"
              >
                Ganti Akun
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
            !currentUser
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : currentUser.role === 'admin'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : currentUser.role === 'petugas'
              ? 'bg-blue-50 border-blue-200 text-blue-900'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center space-x-2.5">
              <span className="text-xl">
                {!currentUser ? '🔒' : currentUser.avatar || '👤'}
              </span>
              <div>
                <p className="font-bold">
                  {!currentUser ? (
                    'Anda sedang dalam mode Tamu (Belum Login)'
                  ) : (
                    <>Masuk sebagai <strong>{currentUser.name}</strong> ({currentUser.roleTitle})</>
                  )}
                </p>
                <p className="text-[11px] opacity-80 mt-0.5">
                  {!currentUser
                    ? 'Silakan login untuk menikmati akses penuh kelola data iuran, armada, dan pengaduan sampah.'
                    : currentUser.role === 'admin'
                    ? 'Terkoneksi ke Admin Keuangan Utama. Anda dapat merekap iuran warga banjar Anda dan menyetorkan akumulasi kas ke pusat.'
                    : currentUser.role === 'petugas'
                    ? 'Hak akses operasional: Anda dapat mengelola armada dan status keluhan sampah.'
                    : 'Hak akses warga: Anda dapat mengecek status iuran, mencetak kuitansi, dan lapor sampah.'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              {!currentUser ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenLoginPage('login')}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition text-xs shadow-xs cursor-pointer"
                  >
                    Buka Halaman Login
                  </button>
                  <button
                    onClick={() => handleOpenLoginPage('register')}
                    className="px-3 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold rounded-lg transition text-xs cursor-pointer"
                  >
                    + Buat User Baru
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => setIsMonitoringBanjarOpen(true)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition text-xs shadow-xs cursor-pointer flex items-center space-x-1"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Setor Kas & Banjar</span>
                    </button>
                  )}
                  {currentUser.role === 'warga' && (
                    <button
                      onClick={() => setFilterState(prev => ({ ...prev, search: currentUser.name }))}
                      className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-emerald-300 font-semibold rounded-lg text-emerald-800 transition cursor-pointer"
                    >
                      Lihat Iuran Saya
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenLoginPage('login')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 font-semibold rounded-lg text-slate-700 transition cursor-pointer"
                  >
                    Halaman Login
                  </button>
                  <button
                    onClick={() => handleOpenLoginModal('login')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 font-semibold rounded-lg text-slate-700 transition cursor-pointer"
                  >
                    Ganti Akun
                  </button>
                  <button
                    onClick={() => handleOpenLoginModal('register')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition text-xs cursor-pointer"
                  >
                    + Buat User
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistics Metric Cards */}
        <StatsCards
          pelangganList={pelangganList}
          activeFilterStatus={filterState.status}
          onFilterStatusClick={(status) => setFilterState(prev => ({ ...prev, status }))}
          onOpenResetStatusModal={isAuthorizedAdmin ? () => setIsResetStatusModalOpen(true) : undefined}
        />

        {/* Jadwal Pengambilan Quick Banner */}
        <JadwalBanner
          jadwalList={jadwalList}
          onOpenJadwalModal={() => setIsJadwalOpen(true)}
          onOpenLaporModal={() => setIsLaporOpen(true)}
        />

        {/* Search, Filters & View Mode */}
        <SearchBarAndFilters
          filterState={filterState}
          onFilterChange={(updates) => setFilterState(prev => ({ ...prev, ...updates }))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalFiltered={filteredAndSortedPelanggan.length}
          totalAll={pelangganList.length}
          adminList={availableAdminNames}
          onResetFilters={() =>
            setFilterState({
              search: '',
              status: 'ALL',
              metode: 'ALL',
              rtRw: 'ALL',
              sortBy: 'status-belum'
            })
          }
        />

        {/* Main Data Section: Table or Cards */}
        <section className="space-y-4">
          
          {/* Section Toolbar / Batch Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800">
                Daftar Pelanggan Iuran ({periode})
              </span>
              <span className="bg-slate-200 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {filteredAndSortedPelanggan.length} Terpilih
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {isAuthorizedAdmin && (
                <>
                  <button
                    id="btn-batch-mark-lunas"
                    onClick={handleBatchMarkAllLunas}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    title="Tandai semua yang tampil lunas"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tandai Semua Lunas</span>
                  </button>

                  <span>•</span>

                  <button
                    id="btn-reset-status-semua"
                    onClick={() => setIsResetStatusModalOpen(true)}
                    className="text-rose-600 hover:text-rose-700 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                    title="Reset status pembayaran semua pelanggan menjadi Belum Dibayar (Khusus Admin)"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reset Status Bayar</span>
                  </button>

                  <span>•</span>
                </>
              )}

              {isAuthorizedAdmin && (
                <button
                  id="btn-tambah-warga-toolbar"
                  onClick={() => {
                    setSelectedWargaForEdit(null);
                    setIsTambahEditOpen(true);
                  }}
                  className="text-slate-700 hover:text-emerald-700 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Warga</span>
                </button>
              )}
            </div>
          </div>

          {/* Table View vs Card View */}
          {viewMode === 'table' ? (
            <WargaTable
              pelangganList={filteredAndSortedPelanggan}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteWarga}
              onPrintKuitansi={handleOpenPrintKuitansi}
            />
          ) : (
            <WargaCardGrid
              pelangganList={filteredAndSortedPelanggan}
              onToggleStatus={handleToggleStatus}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteWarga}
              onPrintKuitansi={handleOpenPrintKuitansi}
            />
          )}

          {/* Bottom Table Utility Bar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 no-print">
            <div className="flex items-center space-x-2">
              <span>Status Pembayaran:</span>
              <span className="inline-flex items-center space-x-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Hijau: Lunas</span>
              </span>
              <span className="inline-flex items-center space-x-1 font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>Merah: Belum Bayar</span>
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleResetDefaultData}
                className="text-slate-400 hover:text-rose-600 underline transition flex items-center space-x-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Data Operasional</span>
              </button>
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-5 mt-auto text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">SI-UPS</span>
            <span>•</span>
            <span>Sistem Informasi Pengelolaan Iuran Sampah & Kebersihan PDS</span>
          </div>
          <p className="text-slate-400">
            Dikelola oleh Tim Kebersihan Lingkungan & Pengurus Rukun Warga
          </p>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Modal Tambah / Edit Data Warga */}
      <ModalTambahEditWarga
        isOpen={isTambahEditOpen}
        onClose={() => {
          setIsTambahEditOpen(false);
          setSelectedWargaForEdit(null);
        }}
        onSave={handleSaveWarga}
        editData={selectedWargaForEdit}
        activePeriode={periode}
        currentUser={currentUser}
        usersList={usersList}
      />

      {/* 2. Modal Cetak Kuitansi / Bukti Bayar */}
      <ModalKuitansi
        isOpen={isKuitansiOpen}
        onClose={() => {
          setIsKuitansiOpen(false);
          setSelectedWargaForKuitansi(null);
        }}
        pelanggan={selectedWargaForKuitansi}
      />

      {/* 3. Modal Jadwal Pengangkutan & Armada */}
      <ModalJadwalPengangkutan
        isOpen={isJadwalOpen}
        onClose={() => setIsJadwalOpen(false)}
        jadwalList={jadwalList}
        onToggleStatusJadwal={handleToggleStatusJadwal}
      />

      {/* 4. Modal Pengaduan & Lapor Sampah */}
      <ModalLaporSampah
        isOpen={isLaporOpen}
        onClose={() => setIsLaporOpen(false)}
        laporanList={laporanList}
        onTambahLaporan={handleTambahLaporan}
        onUpdateStatusLaporan={handleUpdateStatusLaporan}
      />

      {/* 5. Modal Cetak Rekap Bulanan */}
      <ModalRekapCetak
        isOpen={isPrintRekapOpen}
        onClose={() => setIsPrintRekapOpen(false)}
        pelangganList={filteredAndSortedPelanggan}
        periode={periode}
      />

      {/* 6. Modal Login Pengguna & Buat User Baru */}
      <ModalLogin
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        usersList={usersList}
        onCreateUser={handleCreateUser}
        onDeleteUser={handleDeleteUser}
        initialTab={loginModalTab}
      />

      {/* 7. Modal Pusat Monitoring Banjar & Admin Keuangan Utama */}
      <ModalMonitoringBanjar
        isOpen={isMonitoringBanjarOpen}
        onClose={() => setIsMonitoringBanjarOpen(false)}
        currentUser={currentUser}
        pelangganList={pelangganList || []}
        periode={periode}
        pengurusList={pengurusList || []}
        logsList={logsBanjarList || []}
        onVerifikasiSetoran={handleVerifikasiSetoran}
        onUpdatePengurus={handleUpdatePengurus}
        onSubmitSetoranBanjar={handleSubmitSetoranBanjar}
        onSelectBanjarFilter={(banjarName) => setFilterState(prev => ({ ...prev, rtRw: banjarName }))}
      />

      {/* 8. Modal Reset Status Pembayaran Pelanggan (Khusus Admin) */}
      <ModalResetStatusPembayaran
        isOpen={isResetStatusModalOpen}
        onClose={() => setIsResetStatusModalOpen(false)}
        currentUser={currentUser}
        isAuthorizedAdmin={isAuthorizedAdmin}
        totalWarga={pelangganList.length}
        sudahBayarCount={pelangganList.filter(p => p.status === 'Sudah Dibayar').length}
        belumBayarCount={pelangganList.filter(p => p.status === 'Belum Dibayar').length}
        periode={periode}
        isFiltered={filteredAndSortedPelanggan.length < pelangganList.length}
        filteredCount={filteredAndSortedPelanggan.length}
        activeFilterName={filterState.rtRw !== 'ALL' ? filterState.rtRw : undefined}
        onConfirmResetAll={handleResetStatusPembayaranSemua}
        onConfirmResetFiltered={handleResetStatusPembayaranFiltered}
        onOpenLogin={() => handleOpenLoginModal('login')}
      />

    </div>
  );
}
