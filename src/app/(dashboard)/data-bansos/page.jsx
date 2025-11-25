"use client";
import { useEffect, useState } from 'react';
import { formatRupiah } from '../../../lib/utils'; // Jalur manual
import { Search, UserCheck } from 'lucide-react';

export default function DataBansosPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/warga').then(r => r.json()).then(r => setData(r.data || []));
  }, []);

  const filtered = data.filter(w => 
    w.nama.toLowerCase().includes(search.toLowerCase()) || 
    w.nik.includes(search)
  );

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-extrabold text-slate-800">Data Penerima Bansos</h1>
            <p className="text-slate-500 mt-2">Master data seluruh warga yang terdaftar dalam sistem.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-3 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Cari Nama / NIK..." 
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none w-64"
                onChange={e => setSearch(e.target.value)}
            />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-sm text-left text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs border-b">
                <tr>
                    <th className="px-6 py-4">Nama / NIK</th>
                    <th className="px-6 py-4">Alamat</th>
                    <th className="px-6 py-4">Pekerjaan</th>
                    <th className="px-6 py-4">Ekonomi</th>
                    <th className="px-6 py-4 text-center">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {filtered.map((warga) => (
                    <tr key={warga._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{warga.nama}</div>
                            <div className="text-xs text-slate-400">{warga.nik}</div>
                        </td>
                        <td className="px-6 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold">RT {warga.alamat_rt}</span></td>
                        <td className="px-6 py-4">{warga.nama_pekerjaan}</td>
                        <td className="px-6 py-4">
                            <div className="text-xs">Gaji: {formatRupiah(warga.penghasilan)}</div>
                            <div className="text-xs">Tanggungan: {warga.tanggungan}</div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                ${warga.status_kelayakan === 'LAYAK' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {warga.status_kelayakan}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filtered.length === 0 && <div className="p-10 text-center text-slate-400">Data tidak ditemukan</div>}
      </div>
    </div>
  );
}