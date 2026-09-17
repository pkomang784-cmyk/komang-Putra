import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  Sparkles
} from 'lucide-react';
import { AppUser, UserRole } from '../types';

interface ModalLoginProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onLogin: (user: AppUser) => void;
  usersList: AppUser[];
  onCreateUser: (newUser: AppUser) => void;
  onDeleteUser?: (userId: string) => void;
  initialTab?: 'login' | 'register';
}

const AVATAR_CHOICES = ['👤', '👨‍💼', '👩‍💼', '🚛', '🏠', '🌿', '🌾', '👨‍🌾', '🛡️', '🧹'];

export const ModalLogin: React.FC<ModalLoginProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  usersList,
  onCreateUser,
  onDeleteUser,
  initialTab = 'login',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Register (Create User) form state
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

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setLoginError(null);
      setRegError(null);
      setRegSuccess(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Handle submit login
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
        onClose();
      } else {
        setIsLoading(false);
        setLoginError('Username/email atau kata sandi tidak cocok. Silakan periksa kembali.');
      }
    }, 300);
  };

  // Handle select account for login
  const handleSelectAccount = (user: AppUser) => {
    setLoginIdentifier(user.username);
    setLoginError(null);
  };

  // Handle register / create new user
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    // Validation
    const cleanUsername = regUsername.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanUsername || cleanUsername.length < 3) {
      setRegError('Username minimal 3 karakter tanpa spasi.');
      return;
    }

    // Check unique username
    const exists = usersList.some(
      u => u.username.toLowerCase() === cleanUsername || (regEmail && u.email.toLowerCase() === regEmail.trim().toLowerCase())
    );
    if (exists) {
      setRegError(`Username "${cleanUsername}" atau email sudah digunakan oleh akun lain.`);
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

    // Format role title
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
    setRegSuccess(`User baru "${newUser.name}" (${newUser.roleTitle}) berhasil dibuat!`);

    // Reset register form
    setRegName('');
    setRegUsername('');
    setRegEmail('');
    setRegPhone('');
    setRegPassword('');
    setRegConfirmPassword('');

    // Automatically login as newly created user
    setTimeout(() => {
      onLogin(newUser);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-auth-title"
      >
        {/* Header with Emerald Gradient */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 border border-emerald-300/40 flex items-center justify-center shadow-lg shrink-0">
              {activeTab === 'login' ? (
                <LogIn className="w-6 h-6 text-white" />
              ) : (
                <UserPlus className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="modal-auth-title" className="text-xl font-bold tracking-tight text-white">
                  {activeTab === 'login' ? 'Menu Masuk Akun' : 'Buat Pengguna Baru'}
                </h2>
                <span className="bg-emerald-600/80 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  SI-UPS
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {activeTab === 'login' 
                  ? 'Pilih profil atau masukkan username & sandi' 
                  : 'Daftarkan warga, petugas, atau pengurus banjar baru'}
              </p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-emerald-950/40 p-1 rounded-xl mt-5 border border-emerald-600/40 text-xs">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setLoginError(null); }}
              className={`flex-1 py-2 rounded-lg font-bold transition text-center flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-emerald-950 shadow-sm'
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
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-200 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Buat User Baru</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-5">
              {loginError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Form Login Sandi */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
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

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span>Ingat sesi login</span>
                  </label>
                  <button 
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Belum punya akun? Buat User Baru →
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Aplikasi'}</span>
                </button>
              </form>

              {/* Divider & Registered Accounts */}
              <div className="pt-2 border-t border-slate-100">
                {usersList.length === 0 ? (
                  <div className="py-4 px-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <UserPlus className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Belum Ada Akun Terdaftar</p>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto mt-0.5">
                        Semua akun demo telah dibersihkan. Buat akun baru Anda pada tab Buat User Baru.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Buat User Baru</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Akun Terdaftar ({usersList.length} Akun):</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <UserPlus className="w-3 h-3" />
                        <span>+ Tambah Akun</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {usersList.map((user) => {
                        const isCurrent = currentUser?.id === user.id;
                        
                        const roleBadgeColor = {
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
                            className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-3 group ${
                              isCurrent
                                ? 'border-emerald-500 bg-emerald-50/70 ring-1 ring-emerald-400'
                                : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50'
                            }`}
                          >
                            <div 
                              onClick={() => handleSelectAccount(user)}
                              className="flex items-center space-x-2.5 flex-1 min-w-0 cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0">
                                {user.avatar || icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs font-bold text-slate-800 truncate">
                                    {user.name}
                                  </p>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border shrink-0 ${roleBadgeColor}`}>
                                    {user.roleTitle}
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-400 truncate">
                                  username: <strong className="text-slate-600">{user.username}</strong> {user.email ? `• ${user.email}` : `• ${user.rtRw}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleSelectAccount(user)}
                                className="px-2.5 py-1 text-[11px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg transition cursor-pointer"
                                title="Pilih username ini untuk formulir login"
                              >
                                {isCurrent ? 'Aktif' : 'Pilih'}
                              </button>

                              {onDeleteUser && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`Hapus akun user "${user.name}"?`)) {
                                      onDeleteUser(user.id);
                                    }
                                  }}
                                  title="Hapus user ini"
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

          {/* TAB 2: BUAT USER BARU (REGISTER) */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Pembuatan Pengguna Baru</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    User yang dibuat akan otomatis tersimpan di memori sistem dan dapat langsung digunakan untuk login.
                  </p>
                </div>
              </div>

              {/* Form Fields Grid */}
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
                      placeholder="Contoh: I Gede Wibawa"
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
                      placeholder="gede_wibawa"
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition font-medium"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Gunakan huruf kecil & tanpa spasi</p>
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
                    <option value="petugas">🚛 Petugas Kebersihan / Armada</option>
                    <option value="admin">👨‍💼 Pengurus / Bendahara Banjar</option>
                    <option value="admin_keuangan">👑 Admin Keuangan Utama (Pusat)</option>
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {regRole === 'admin_keuangan' && 'Akses penuh monitoring 4 banjar, verifikasi setoran kas pusat'}
                    {regRole === 'admin' && 'Akses rekap iuran banjar & setor kas ke pusat'}
                    {regRole === 'petugas' && 'Akses armada truk & keluhan'}
                    {regRole === 'warga' && 'Akses kuitansi & lapor sampah'}
                  </p>
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

                {/* Avatar / Ikon Profil */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Avatar Profil
                  </label>
                  <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
                    {AVATAR_CHOICES.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setRegAvatar(emoji)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition shrink-0 ${
                          regAvatar === emoji
                            ? 'bg-emerald-500 text-white ring-2 ring-emerald-600 scale-110'
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

                {/* No Telepon / WA */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
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
                    Kata Sandi (Password) <span className="text-rose-500">*</span>
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
                    Ulangi Kata Sandi <span className="text-rose-500">*</span>
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
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan & Masuk Sebagai User Ini</span>
                </button>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-xs text-slate-500 hover:text-emerald-700 font-semibold"
                >
                  Sudah memiliki akun? <span className="text-emerald-700 underline">Masuk di sini</span>
                </button>
              </div>
            </form>
          )}

          {/* Current Session Indicator */}
          {currentUser && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Sesi aktif saat ini: <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.roleTitle})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
