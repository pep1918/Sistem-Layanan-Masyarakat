"use client";
import { useState, useEffect } from 'react';

// ============================================================
// PERBAIKAN JALUR IMPORT (MANUAL 3 TINGKAT):
// Dari: src/app/(dashboard)/riwayat-penyaluran
// Ke:   src/lib/utils
// ============================================================
import { formatRupiah } from '../../../lib/utils'; 

import { History, Search, Download, Calendar, UserCheck } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function RiwayatPenyaluranPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    fetch('/api/penyaluran')
      .then(r => r.json())
      .then(res => {
        setData(res.data || []);
        setLoading(false);
      });
  }, []);

  // Filter Pencarian
  const filtered = data.filter(item => 
    item.nama_penerima.toLowerCase().includes(search.toLowerCase()) || 
    item.nik_penerima.includes(search)
  );

  // Export Excel
  const exportExcel = () => {
    const dataToExport = filtered.map((item, i) => ({
        "No": i + 1,
        "Tanggal": new Date(item.tanggal_salur).toLocaleDateString('id-ID'),
        "Nama Penerima": item.nama_penerima,
        "NIK": `'${item.nik_penerima}`, 
        "Alamat": `RT ${item.alamat_rt}`,
        "Bantuan": item.jenis_bantuan,
        "Nominal": item.nominal,
        "Petugas": item.petugas
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Penyaluran");
    XLSX.writeFile(wb, `Transparansi_Penyaluran_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
                <History className="text-blue-600"/> Riwayat Penyaluran Bantuan
            </h1>
            <p className="text-slate-500 mt-2">
                Rekam jejak digital penyaluran dana desa demi transparansi mutlak.
            </p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Cari Penerima..." 
                    className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-64 bg-white"
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <button onClick={exportExcel} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-lg shadow-emerald-200">
                <Download size={18}/> Unduh Laporan
            </button>
        </div>
      </div>

      {/* TABEL RIWAYAT */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b">
                <tr>
                    <th className="px-6 py-4">Waktu Penyaluran</th>
                    <th className="px-6 py-4">Penerima</th>
                    <th className="px-6 py-4">Detail Bantuan</th>
                    <th className="px-6 py-4 text-right">Nominal</th>
                    <th className="px-6 py-4">Petugas</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {loading ? (
                    <tr><td colSpan="5" className="text-center p-10">Memuat data...</td></tr>
                ) : filtered.length === 0 ? (
                    <tr><td colSpan="5" className="text-center p-10 italic text-slate-400">Belum ada riwayat penyaluran.</td></tr>
                ) : (
                    filtered.map((item) => (
                        <tr key={item._id} className="hover:bg-blue-50/50 transition group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-slate-700 font-medium">
                                    <Calendar size={16} className="text-blue-400"/>
                                    {new Date(item.tanggal_salur).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </div>
                                <div className="text-xs text-slate-400 pl-6">
                                    Pukul {new Date(item.tanggal_salur).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{item.nama_penerima}</div>
                                <div className="text-xs text-slate-400 mt-0.5">NIK: {item.nik_penerima} • <span className="text-blue-600 font-bold">RT {item.alamat_rt}</span></div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                    {item.jenis_bantuan}
                                </span>
                                {item.keterangan && <div className="text-xs text-slate-400 mt-1 italic">"{item.keterangan}"</div>}
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 text-base">
                                {formatRupiah(item.nominal)}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit">
                                    <UserCheck size={14}/> {item.petugas}
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}