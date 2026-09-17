import React from 'react';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  SlidersHorizontal, 
  RotateCcw,
  Sparkles,
  MapPin
} from 'lucide-react';
import { FilterState, ViewMode, StatusPembayaran, MetodePembayaran } from '../types';
import { DAFTAR_BANJAR } from '../data/defaultData';

interface SearchBarAndFiltersProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalFiltered: number;
  totalAll: number;
  onResetFilters: () => void;
  onBatchMarkAllLunas?: () => void;
  adminList?: string[];
}

export const SearchBarAndFilters: React.FC<SearchBarAndFiltersProps> = ({
  filterState,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalFiltered,
  totalAll,
  onResetFilters,
  adminList = [],
}) => {
  const isFiltered = 
    filterState.search !== '' || 
    filterState.status !== 'ALL' || 
    filterState.metode !== 'ALL' || 
    filterState.rtRw !== 'ALL';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 no-print">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        
        {/* Search Input Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterState.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Cari nama warga/pelanggan, banjar, lokasi..."
            aria-label="Cari data warga"
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
          />
          {filterState.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Status Filter */}
          <div className="flex items-center">
            <select
              value={filterState.status}
              onChange={(e) => onFilterChange({ status: e.target.value as 'ALL' | StatusPembayaran })}
              aria-label="Filter Status Pembayaran"
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              <option value="ALL">Semua Status</option>
              <option value="Sudah Dibayar">Lunas (Sudah Bayar)</option>
              <option value="Belum Dibayar">Belum Bayar</option>
            </select>
          </div>

          {/* Metode Filter */}
          <div className="flex items-center">
            <select
              value={filterState.metode}
              onChange={(e) => onFilterChange({ metode: e.target.value as 'ALL' | MetodePembayaran })}
              aria-label="Filter Metode Pembayaran"
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              <option value="ALL">Semua Metode</option>
              <option value="Tunai">💵 Tunai</option>
              <option value="Transfer">🏦 Transfer Bank</option>
              <option value="QRIS">📱 QRIS</option>
            </select>
          </div>

          {/* Admin & Wilayah Filter */}
          <div className="flex items-center">
            <select
              value={filterState.rtRw}
              onChange={(e) => onFilterChange({ rtRw: e.target.value })}
              aria-label="Filter Berdasarkan Admin atau Wilayah"
              title="Filter Berdasarkan Admin atau Wilayah"
              className="px-3 py-2 text-xs font-bold bg-emerald-50/80 border border-emerald-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-950 cursor-pointer shadow-xs hover:border-emerald-500 transition"
            >
              <option value="ALL">📍 Semua Admin & Wilayah</option>
              {adminList && adminList.length > 0 && (
                <optgroup label="👤 Admin Penginput">
                  {adminList.map((adm) => (
                    <option key={adm} value={adm}>
                      👤 Admin: {adm}
                    </option>
                  ))}
                </optgroup>
              )}
              <optgroup label="📍 Wilayah / Banjar">
                {DAFTAR_BANJAR.map((banjar) => (
                  <option key={banjar} value={banjar}>
                    {banjar}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center">
            <select
              value={filterState.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              aria-label="Urutkan Data"
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 cursor-pointer"
            >
              <option value="status-belum">Prioritas: Belum Lunas</option>
              <option value="nama-asc">Nama (A - Z)</option>
              <option value="nama-desc">Nama (Z - A)</option>
              <option value="iuran-desc">Iuran Terbesar</option>
              <option value="iuran-asc">Iuran Terkecil</option>
              <option value="status-lunas">Prioritas: Sudah Lunas</option>
            </select>
          </div>

          {/* Reset Filter Button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition"
              title="Reset Filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* View Mode Toggle (Table / Card Grid) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200 ml-auto sm:ml-0">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Kartu"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Result Count Indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span>
            Menampilkan <strong className="text-slate-800 font-semibold">{totalFiltered}</strong> dari {totalAll} warga
          </span>
          {filterState.rtRw !== 'ALL' && (
            <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-emerald-300">
              <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>Wilayah: {filterState.rtRw}</span>
              <button
                onClick={() => onFilterChange({ rtRw: 'ALL' })}
                className="text-emerald-700 hover:text-emerald-950 hover:bg-emerald-200 rounded-full w-4 h-4 flex items-center justify-center font-black ml-0.5"
                title="Hapus filter wilayah ini"
              >
                ×
              </button>
            </span>
          )}
          {isFiltered && filterState.rtRw === 'ALL' && (
            <span className="bg-emerald-50 text-emerald-700 text-[11px] px-2 py-0.5 rounded-md border border-emerald-200">
              Filter aktif
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400 hidden sm:block">
          💡 Klik tombol status pada baris warga untuk ubah Lunas / Belum
        </div>
      </div>
    </div>
  );
};
