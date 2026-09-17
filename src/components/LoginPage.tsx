import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  LogIn,
  KeyRound,
  Trash2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Shield,
  HelpCircle,
  Clock
} from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface LoginPageProps {
  currentUser: AppUser | null;
  usersList: AppUser[];
  onLogin: (user: AppUser) => void;
  onCreateUser: (newUser: AppUser) => void;
  onDeleteUser?: (userId: string) => void;
  onNavigateToDashboard: () => void;
  initialTab?: 'login' | 'register';
}

const AVATAR_CHOICES = ['👤', '👨‍💼', '👩‍💼', '🚛', '🏠', '🌿', '🌾', '👨‍🌾', '🛡️', '🧹'];

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  usersList,
  onLogin,
  onCreateUser,
  onDeleteUser,
  onNavigateToDashboard,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() => {
    if (usersList.length === 0) return 'register';
    return initialTab;
  });
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBanjar, setRegBanjar] = useState('Banjar 01');
  const [regRole, setRegRole] = useState<UserRole>('warga');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('👤');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);

    setTimeout(() => {
      const trimmed = loginIdentifier.trim().toLowerCase();
      const matched = usersList.find(
        u => (u.username.toLowerCase() === trimmed || u.email.toLowerCase() === trimmed) &&
             u.password === loginPassword
      );

      if (matched) {
        onLogin(matched);
        setIsLoading(false);
        onNavigateToDashboard();
      } else {
        setIsLoading(false);
        setLoginError('Username/email atau kata sandi tidak cocok. Silakan periksa kembali.');
      }
    }, 350);
  };

  const handleSelectAccount = (user: AppUser) => {
    setLoginIdentifier(user.username);
    setLoginError(null);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    const cleanUsername = regUsername.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanUsername || cleanUsername.length < 3) {
      setRegError('Username minimal 3 karakter tanpa spasi.');
      return;
    }

    const exists = usersList.some(
      u => u.username.toLowerCase() === cleanUsername || (regEmail && u.email.toLowerCase() === regEmail.trim().toLowerCase())
    );
    if (exists) {
      setRegError(`Username "${cleanUsername}" atau email sudah terdaftar.`);
      return;
    }

    if (!regName.trim()) {
      setRegError('Nama lengkap wajib diisi.');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setRegError('Kata sandi minimal 4 karakter.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi kata sandi tidak sesuai.');
      return;
    }

    let roleTitle = 'Warga Lingkungan';
    if (regRole === 'admin_keuangan') {
      roleTitle = 'Admin Keuangan Utama (Pusat Lingkungan)';
    } else if (regRole === 'admin') {
      roleTitle = `Pengurus & Bendahara ${regBanjar}`;
    } else if (regRole === 'petugas') {
      roleTitle = 'Petugas Armada Kebersihan';
    } else {
      roleTitle = `Warga ${regBanjar}`;
    }

    const newUser: AppUser = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      username: cleanUsername,
      name: regName.trim(),
      role: regRole,
      roleTitle,
      email: regEmail.trim() || `${cleanUsername}@warga.id`,
      phone: regPhone.trim() || '0812-0000-0000',
      rtRw: regBanjar,
      avatar: regAvatar,
      password: regPassword
    };

    onCreateUser(newUser);
    setRegSuccess(`Akun "${newUser.name}" (${newUser.roleTitle}) berhasil dibuat! Mengalihkan...`);

    setTimeout(() => {
      onLogin(newUser);
      onNavigateToDashboard();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      
      {/* Top Navbar */}
      <header className="border-b border-emerald-800/40 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <span className="text-xl">🌱</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white">SI-UPS</span>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PDS
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 hidden sm:block">
                Sistem Informasi Iuran & Operasional Pengelolaan Sampah Banjar
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser ? (
              <button
                onClick={onNavigateToDashboard}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-800/50 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-200 text-xs font-semibold transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Dashboard</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/70 border border-amber-500/40 px-3.5 py-1.5 rounded-xl font-semibold shadow-xs">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Wajib Login Terlebih Dahulu</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* Left Hero & Feature Description */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portal Terpadu Pengelolaan Sampah Lingkungan</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Transparansi Iuran & Armada Kebersihan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Setiap Banjar</span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Akses aman untuk warga, petugas armada truk sampah, dan pengurus Banjar guna memastikan pencatatan pembayaran tepat waktu dan lingkungan selalu bersih.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-emerald-900/60 hover:border-emerald-700/50 transition">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-bold text-sm">
                  💵
                </div>
                <h3 className="text-xs font-bold text-white">Kuitansi & Bayar Digital</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mendukung Tunai, Transfer Bank & QRIS lengkap dengan nomor resi resmi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-emerald-900/60 hover:border-emerald-700/50 transition">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 font-bold text-sm">
                  🚛
                </div>
                <h3 className="text-xs font-bold text-white">Jadwal Truk Armada</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Cek rute dan jam operasional angkut sampah terpilah di Banjar 01-04.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-emerald-900/60 hover:border-emerald-700/50 transition">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 font-bold text-sm">
                  📢
                </div>
                <h3 className="text-xs font-bold text-white">Lapor Penumpukan</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Warga dapat mengirim keluhan sampah menumpuk langsung ke petugas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-emerald-900/60 hover:border-emerald-700/50 transition">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2 font-bold text-sm">
                  📊
                </div>
                <h3 className="text-xs font-bold text-white">Rekapitulasi Keuangan</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  Laporan kas iuran per periode bulanan dengan ekspor data CSV & cetak fisik.
                </p>
              </div>
            </div>

            {/* Quick stats counter */}
            <div className="pt-2 flex items-center space-x-6 text-xs text-slate-400 border-t border-slate-800">
              <div>
                <span className="block font-bold text-emerald-300 text-base">4 Banjar</span>
                <span>Cakupan Wilayah</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="block font-bold text-teal-300 text-base">3 Peran</span>
                <span>Admin, Petugas, Warga</span>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div>
                <span className="block font-bold text-white text-base">100% Real-Time</span>
                <span>Sinkronisasi Lokal</span>
              </div>
            </div>
          </div>

          {/* Right Login / Register Card */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl border border-emerald-800/20 overflow-hidden">
              
              {/* Card Header & Tabs */}
              <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      {activeTab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Pengguna Baru'}
                    </h2>
                    <p className="text-xs text-emerald-200 mt-1">
                      {activeTab === 'login' 
                        ? 'Gunakan kredensial akun terdaftar Anda untuk masuk' 
                        : 'Lengkapi formulir untuk membuat akun baru'}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shadow-inner shrink-0">
                    {activeTab === 'login' ? <LogIn className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
                  </div>
                </div>

                {/* Tab Pill Switcher */}
                <div className="flex items-center bg-emerald-950/50 p-1 rounded-xl mt-5 border border-emerald-600/40 text-xs">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setLoginError(null); }}
                    className={`flex-1 py-2 rounded-lg font-bold transition text-center flex items-center justify-center space-x-1.5 cursor-pointer ${
                      activeTab === 'login'
                        ? 'bg-white text-emerald-950 shadow-md'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Masuk (Login)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab('register'); setRegError(null); setRegSuccess(null); }}
                    className={`flex-1 py-2 rounded-lg font-bold transition text-center flex items-center justify-center space-x-1.5 cursor-pointer ${
                      activeTab === 'register'
                        ? 'bg-white text-emerald-950 shadow-md'
                        : 'text-emerald-200 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Buat User Baru</span>
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 space-y-6">
                
                {/* Notice: Wajib Login Terlebih Dahulu */}
                {!currentUser && (
                  <div className="p-3 bg-amber-50/90 border border-amber-300/80 rounded-2xl flex items-start space-x-2.5 text-xs text-amber-900 shadow-2xs">
                    <Lock className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-extrabold text-amber-950">Wajib Login Terlebih Dahulu</p>
                      <p className="text-[11px] text-amber-800/90 mt-0.5 leading-relaxed">
                        Sistem diproteksi. Masukkan username dan kata sandi akun Anda, atau buat akun baru pada tab '+ Buat User Baru'.
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 1: LOGIN */}
                {activeTab === 'login' && (
                  <div className="space-y-5">
                    {loginError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700 animate-in fade-in duration-150">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Username atau Email
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={loginIdentifier}
                            onChange={(e) => setLoginIdentifier(e.target.value)}
                            placeholder="Contoh: admin / petugas / warga / username baru"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Kata Sandi (Password)
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type={showLoginPassword ? 'text' : 'password'}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="Masukkan kata sandi akun"
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                            title={showLoginPassword ? 'Sembunyikan' : 'Tampilkan'}
                          >
                            {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                          <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                          <span>Ingat sesi masuk</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setActiveTab('register')}
                          className="text-emerald-700 font-bold hover:underline"
                        >
                          Belum punya akun? Buat di sini
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}</span>
                      </button>
                    </form>

                    {/* Registered Accounts or First Account Prompt */}
                    <div className="pt-3 border-t border-slate-100">
                      {usersList.length === 0 ? (
                        <div className="py-4 px-3 bg-slate-50/70 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                            <UserPlus className="w-5 h-5 text-emerald-700" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">Belum Ada Akun Terdaftar</p>
                            <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                              Semua akun demo telah dibersihkan. Daftarkan akun Administrator pertama Anda untuk mengelola sistem.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => { setActiveTab('register'); setRegError(null); setRegSuccess(null); }}
                            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>+ Buat Akun Pengguna / Admin</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                              <UserCheck className="w-4 h-4 text-emerald-600" />
                              <span>Akun Terdaftar ({usersList.length} Akun)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setActiveTab('register'); setRegError(null); setRegSuccess(null); }}
                              className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <UserPlus className="w-3 h-3" />
                              <span>+ Tambah Akun</span>
                            </button>
                          </div>

                          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                            {usersList.map((user) => {
                              const roleBadge = {
                                admin_keuangan: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
                                admin: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                                petugas: 'bg-blue-100 text-blue-800 border-blue-200',
                                warga: 'bg-slate-100 text-slate-800 border-slate-200',
                              }[user.role] || 'bg-slate-100 text-slate-800 border-slate-200';

                              const icon = {
                                admin_keuangan: <ShieldCheck className="w-4 h-4 text-amber-600" />,
                                admin: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
                                petugas: <Truck className="w-4 h-4 text-blue-600" />,
                                warga: <User className="w-4 h-4 text-slate-600" />,
                              }[user.role] || <User className="w-4 h-4 text-slate-600" />;

                              return (
                                <div
                                  key={user.id}
                                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition flex items-center justify-between gap-3 group"
                                >
                                  <div 
                                    onClick={() => handleSelectAccount(user)}
                                    className="flex items-center space-x-2.5 flex-1 min-w-0 cursor-pointer"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-base shrink-0">
                                      {user.avatar || icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center space-x-2">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                          {user.name}
                                        </p>
                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${roleBadge}`}>
                                          {user.roleTitle}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-slate-500 truncate">
                                        username: <strong className="text-slate-700">{user.username}</strong> {user.email ? `• ${user.email}` : `• ${user.rtRw}`}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center space-x-1 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => handleSelectAccount(user)}
                                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition cursor-pointer"
                                      title="Pilih username ini untuk formulir login"
                                    >
                                      Pilih
                                    </button>
                                    {onDeleteUser && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (window.confirm(`Hapus akun user "${user.name}"?`)) {
                                            onDeleteUser(user.id);
                                          }
                                        }}
                                        title="Hapus user"
                                        className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: BUAT USER BARU */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {regError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700 animate-in fade-in duration-150">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                        <span>{regError}</span>
                      </div>
                    )}

                    {regSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800 animate-in fade-in duration-150">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        <span>{regSuccess}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Nama Lengkap */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nama Lengkap <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="text"
                            required
                            value={regName}
                            onChange={(e) => {
                              setRegName(e.target.value);
                              if (!regUsername && e.target.value) {
                                setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''));
                              }
                            }}
                            placeholder="Contoh: I Ketut Suardana"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium"
                          />
                        </div>
                      </div>

                      {/* Username */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Username Akun <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="text-slate-400 absolute left-3 top-2.5 text-xs font-bold">@</span>
                          <input
                            type="text"
                            required
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                            placeholder="ketut_suardana"
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium"
                          />
                        </div>
                      </div>

                      {/* Role / Hak Akses */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Peran / Hak Akses <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={regRole}
                          onChange={(e) => setRegRole(e.target.value as UserRole)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
                        >
                          <option value="warga">👤 Warga Lingkungan</option>
                          <option value="petugas">🚛 Petugas Armada Kebersihan</option>
                          <option value="admin">👨‍💼 Pengurus / Bendahara Banjar</option>
                          <option value="admin_keuangan">👑 Admin Keuangan Utama (Pusat)</option>
                        </select>
                      </div>

                      {/* Wilayah Banjar */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Wilayah Banjar <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <select
                            value={regBanjar}
                            onChange={(e) => setRegBanjar(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold cursor-pointer"
                          >
                            <option value="Banjar 01">Banjar 01</option>
                            <option value="Banjar 02">Banjar 02</option>
                            <option value="Banjar 03">Banjar 03</option>
                            <option value="Banjar 04">Banjar 04</option>
                            <option value="Seluruh Lingkungan">Seluruh Lingkungan (Umum)</option>
                          </select>
                        </div>
                      </div>

                      {/* Avatar Picker */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Pilih Avatar
                        </label>
                        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5">
                          {AVATAR_CHOICES.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => setRegAvatar(emoji)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition shrink-0 cursor-pointer ${
                                regAvatar === emoji
                                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-600 scale-105'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Alamat Email (Opsional)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="contoh@gmail.com"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* No HP / WA */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          No. WhatsApp / HP
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="08123456789"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Kata Sandi */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Kata Sandi <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="password"
                            required
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Minimal 4 karakter"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Konfirmasi Kata Sandi */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Ulangi Sandi <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <input
                            type="password"
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder="Ketik ulang kata sandi"
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>Daftarkan & Langsung Masuk</span>
                      </button>
                    </div>

                    <div className="text-center pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-xs text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer"
                      >
                        Sudah punya akun? <span className="text-emerald-700 underline font-bold">Masuk di sini</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Security Footer Notice */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Aplikasi Dilindungi — Wajib login sebelum masuk</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">SI-UPS v2.5</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-900/40 bg-slate-950/60 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 SI-UPS Lingkungan PDS / Seluruh 9 Banjar. Sistem Pengelolaan Iuran Sampah Mandiri.</p>
          <div className="flex items-center space-x-4 text-slate-400 text-[11px]">
            <span>Banjar 01 s/d 09</span>
            <span>•</span>
            <span className="text-emerald-400/80 font-medium">Autentikasi Terproteksi</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
