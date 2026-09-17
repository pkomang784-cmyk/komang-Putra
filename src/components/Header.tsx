import React, { useState } from 'react';
import { 
  Trash2, 
  Download, 
  Printer, 
  Calendar, 
  Bell, 
  Plus, 
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserPlus,
  Building2,
  RotateCcw,
  Cloud
} from 'lucide-react';
import { DAFTAR_PERIODE } from '../data/defaultData';
import { AppNotification, AppUser } from '../types';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  periode: string;
  onPeriodeChange: (p: string) => void;
  onExportCSV: () => void;
  onOpenPrintRekap: () => void;
  onOpenTambahModal: () => void;
  onOpenLaporModal: () => void;
  onOpenJadwalModal: () => void;
  onOpenMonitoringBanjar?: () => void;
  notifications: AppNotification[];
  onMarkNotificationsRead: () => void;
  currentUser: AppUser | null;
  onOpenLoginModal: (tab?: 'login' | 'register') => void;
  onNavigateToLoginPage?: () => void;
  onResetStatusBayar?: () => void;
  onLogout: () => void;
  isCloudSynced?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  periode,
  onPeriodeChange,
  onExportCSV,
  onOpenPrintRekap,
  onOpenTambahModal,
  onOpenLaporModal,
  onOpenJadwalModal,
  onOpenMonitoringBanjar,
  notifications = [],
  onMarkNotificationsRead,
  currentUser,
  onOpenLoginModal,
  onNavigateToLoginPage,
  onResetStatusBayar,
  onLogout,
  isCloudSynced = true,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = (notifications || []).filter(n => !n.read).length;

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-30 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          
          {/* Logo & Subtitle with Tooltip */}
          <div className="flex items-center justify-between">
            <Tooltip content="Sistem Pengelolaan Iuran Sampah" position="bottom" className="cursor-pointer group">
              <div className="flex items-center text-left">
                <div>
                  <div className="flex items-center space-x-2">
                    <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-white shadow-md border border-emerald-300/40 shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <Trash2 className="w-4 h-4 text-white" />
                      </span>
                      <span className="group-hover:text-emerald-100 transition-colors duration-200">SI-UPS</span>
                    </h1>
                    <span className="bg-emerald-600/80 text-emerald-100 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/40">
                      PDS
                    </span>
                    <span 
                      className={`inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full border shadow-2xs ${
                        isCloudSynced 
                          ? 'bg-emerald-950/70 border-emerald-400/50 text-emerald-200' 
                          : 'bg-amber-950/70 border-amber-400/50 text-amber-200'
                      }`}
                      title={isCloudSynced ? 'Data HP & Laptop tersinkronisasi otomatis via Cloud' : 'Menghubungkan ke Cloud...'}
                    >
                      <Cloud className={`w-3 h-3 ${isCloudSynced ? 'text-emerald-300' : 'text-amber-300 animate-pulse'}`} />
                      <span className="hidden sm:inline">{isCloudSynced ? 'Sinkron HP & Laptop' : 'Sinkronisasi...'}</span>
                      <span className="sm:hidden">{isCloudSynced ? 'Online' : 'Sync'}</span>
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200 mt-0.5">
                    Sistem Pengelolaan Iuran & Kebersihan Lingkungan
                  </p>
                </div>
              </div>
            </Tooltip>

            {/* Mobile notification & User & Quick Add */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu) onMarkNotificationsRead();
                }}
                className="relative p-2 rounded-lg bg-emerald-700/60 hover:bg-emerald-700 text-emerald-100 transition"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Mobile User Profile / Login */}
              {currentUser ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1.5 rounded-lg bg-emerald-900/60 border border-emerald-600/50 flex items-center text-xs text-white"
                  title={`Profil: ${currentUser.name}`}
                >
                  <span className="w-6 h-6 rounded-md bg-emerald-700 flex items-center justify-center text-xs">
                    {currentUser.avatar || '👤'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenLoginModal('login')}
                  className="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login / Buat</span>
                </button>
              )}

              <button
                onClick={onOpenTambahModal}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold rounded-lg transition"
                title="Tambah Warga"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center/Right Actions & Periode */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Periode selector */}
            <div className="flex items-center bg-emerald-900/60 border border-emerald-700/70 rounded-lg px-2.5 py-1.5 text-xs text-emerald-100">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-emerald-300 shrink-0" />
              <span className="text-emerald-300 font-medium mr-1.5">Periode:</span>
              <select
                value={periode}
                onChange={(e) => onPeriodeChange(e.target.value)}
                aria-label="Pilih Periode Iuran"
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer pr-1"
              >
                {DAFTAR_PERIODE.map((p) => (
                  <option key={p} value={p} className="text-slate-800 bg-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick buttons */}
            <button
              onClick={onOpenJadwalModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/70 hover:bg-emerald-700 text-emerald-100 hover:text-white text-xs font-medium border border-emerald-600/60 transition"
              title="Jadwal Truk Sampah"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden sm:inline">Jadwal Pengangkutan</span>
              <span className="sm:hidden">Jadwal</span>
            </button>

            <button
              onClick={onOpenMonitoringBanjar}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-teal-800/90 hover:bg-teal-700 text-teal-100 hover:text-white text-xs font-semibold border border-teal-600/70 transition shadow-xs cursor-pointer"
              title="Pusat Monitoring & Pengurus Banjar"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-300" />
              <span className="hidden sm:inline">Monitoring Banjar</span>
              <span className="sm:hidden">Banjar</span>
            </button>

            <button
              onClick={onOpenLaporModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-medium border border-amber-500/50 shadow-sm transition"
              title="Lapor Masalah Sampah"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lapor Sampah</span>
              <span className="sm:hidden">Lapor</span>
            </button>

            <button
              onClick={onOpenPrintRekap}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/70 hover:bg-emerald-700 text-emerald-100 text-xs font-medium border border-emerald-600/60 transition"
              title="Cetak Laporan Rekap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Rekap</span>
            </button>

            <button
              onClick={onExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-700/70 hover:bg-emerald-700 text-emerald-100 text-xs font-medium border border-emerald-600/60 transition"
              title="Unduh Data CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            {/* Desktop Notification Bell */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu) onMarkNotificationsRead();
                }}
                className="relative p-2 rounded-lg bg-emerald-700/70 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 transition"
                title="Notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Notifikasi</span>
                    <span className="text-[11px] text-emerald-600 font-medium">Update Lingkungan</span>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition">
                        <div className="flex items-start space-x-2.5">
                          {n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tambah Warga Button */}
            <button
              onClick={onOpenTambahModal}
              className="hidden md:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Warga</span>
            </button>

            {/* User Profile / Login Button & Dropdown */}
            <div className="relative">
              {currentUser ? (
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifMenu(false);
                  }}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-600/70 text-xs font-medium transition cursor-pointer"
                  title="Menu Pengguna"
                >
                  <span className="w-6 h-6 rounded-md bg-emerald-700/90 border border-emerald-500/50 flex items-center justify-center text-xs shrink-0">
                    {currentUser.avatar || '👤'}
                  </span>
                  <div className="text-left hidden lg:block">
                    <p className="text-[11px] font-bold text-white leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </p>
                    <p className="text-[9px] text-emerald-300 capitalize">
                      {currentUser.roleTitle}
                    </p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-emerald-300 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => (onNavigateToLoginPage ? onNavigateToLoginPage() : onOpenLoginModal('login'))}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold shadow-sm transition cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Halaman Login</span>
                </button>
              )}

              {/* User Menu Dropdown */}
              {showUserMenu && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-base border border-emerald-200 font-bold shrink-0">
                        {currentUser.avatar || '👤'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Hak Akses:</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        currentUser.role === 'admin_keuangan'
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold shadow-2xs'
                          : currentUser.role === 'admin' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                          : currentUser.role === 'petugas'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-slate-100 text-slate-800 border-slate-200'
                      }`}>
                        {currentUser.role === 'admin_keuangan' ? '👑 ' : ''}{currentUser.roleTitle}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 text-xs divide-y divide-slate-100">
                    {onOpenMonitoringBanjar && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenMonitoringBanjar();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-800 font-semibold flex items-center space-x-2 transition cursor-pointer"
                      >
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Pusat Monitoring Banjar</span>
                      </button>
                    )}

                    {onResetStatusBayar && (currentUser?.role === 'admin_keuangan' || currentUser?.role === 'admin') && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onResetStatusBayar();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center space-x-2 transition cursor-pointer"
                        title="Reset status pembayaran warga untuk periode ini"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                        <span>Reset Status Pembayaran</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenLoginModal('login');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Ganti Akun / Masuk</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenLoginModal('register');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center space-x-2 transition cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-emerald-600" />
                      <span>+ Buat User Baru</span>
                    </button>

                    {onNavigateToLoginPage && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onNavigateToLoginPage();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center space-x-2 transition cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-teal-600" />
                        <span>Halaman Login (Login Page)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600 flex items-center space-x-2 transition cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
