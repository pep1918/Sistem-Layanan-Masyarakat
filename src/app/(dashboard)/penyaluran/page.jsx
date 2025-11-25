"use client";
import { useState, useEffect } from 'react';
import { formatRupiah } from '../../../lib/utils'; // Jalur manual 3 tingkat
import { Gift, CheckCircle, Calendar, DollarSign, User, AlertCircle, Send } from 'lucide-react';

export default function DistribusiPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Setting Batch Penyaluran (Agar tidak input ulang terus menerus)
  const [batchInfo, setBatchInfo] = useState({
    jenis: 'BLT Dana Desa',
    periode: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    nominal: 300000,
    keterangan: 'Penyaluran Reguler'
  });

  // 1. Ambil Data Warga yang Statusnya LAYAK
  const fetchCandidates = () => {
    setLoading(true);
    fetch('/api/warga')
      .then(res => res.json())
      .then(res => {
        // Filter hanya yang LAYAK dan sudah Disetujui RW (Verified)
        // Atau minimal status kelayakan LAYAK
        const eligible = (res.data || []).filter(w => w.status_kelayakan === 'LAYAK');
        setCandidates(eligible);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  };

  useEffect(() => { fetchCandidates(); }, []);

  // 2. Fungsi Eksekusi Penyaluran
  const handleDistribute = async (warga) => {
    const confirmMsg = `Salurkan ${batchInfo.jenis} sebesar ${formatRupiah(batchInfo.nominal)} kepada ${warga.nama}?`;
    if (!confirm(confirmMsg)) return;

    const payload = {
        nama_penerima: warga.nama,
        nik_penerima: warga.nik,
        alamat_rt: warga.alamat_rt,
        jenis_bantuan: batchInfo.jenis,
        nominal: parseInt(batchInfo.nominal),
        petugas: "Admin Distribusi",
        keterangan: `${batchInfo.keterangan} - ${batchInfo.periode}`
    };

    try {
        // Simpan ke Riwayat Penyaluran
        const res = await fetch('/api/penyaluran', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });

        if(res.ok) {
            alert(`SUKSES! Bantuan telah diserahkan ke ${warga.nama}.`);
            // Opsional: Hilangkan warga dari list atau beri tanda sudah menerima
            // Disini kita refresh data saja
            fetchCandidates();
        } else {
            alert("Gagal mencatat transaksi.");
        }
    } catch (error) {
        alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* HEADER & CONFIGURATION CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Header Text */}
        <div className="lg:col-span-1">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Distribusi Bantuan</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
                Halaman eksekusi penyaluran. Atur parameter bantuan di samping, lalu salurkan kepada warga yang berhak (Status: LAYAK).
            </p>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                <AlertCircle className="text-blue-600 shrink-0" size={20}/>
                <div className="text-xs text-blue-800">
                    <strong>Info:</strong> Data yang muncul di sini adalah hasil filter otomatis metode SAW yang berstatus <b>LAYAK</b>.
                </div>
            </div>
        </div>

        {/* Configuration Form (Batch Setting) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <h3 className="font-bold text-slate-800 border-b pb-3 mb-4 flex items-center gap-2">
                <Gift size={20} className="text-emerald-600"/> Konfigurasi Penyaluran Hari Ini
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Jenis Bantuan</label>
                    <select className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                        value={batchInfo.jenis} onChange={e => setBatchInfo({...batchInfo, jenis: e.target.value})}>
                        <option>BLT Dana Desa</option>
                        <option>Bantuan Sembako</option>
                        <option>Subsidi Listrik</option>
                        <option>Bantuan Bencana</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Periode</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-slate-400" size={16}/>
                        <input type="text" className="w-full mt-1 pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                            value={batchInfo.periode} onChange={e => setBatchInfo({...batchInfo, periode: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Nominal (Rp)</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3 text-slate-400" size={16}/>
                        <input type="number" className="w-full mt-1 pl-10 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                            value={batchInfo.nominal} onChange={e => setBatchInfo({...batchInfo, nominal: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">Keterangan</label>
                    <input type="text" className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                        value={batchInfo.keterangan} onChange={e => setBatchInfo({...batchInfo, keterangan: e.target.value})} />
                </div>
            </div>
        </div>
      </div>

      {/* RECIPIENT LIST */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Daftar Penerima Prioritas (Wajib Salur)</h3>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">{candidates.length} Warga</span>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-500 uppercase text-xs font-bold">
                    <tr>
                        <th className="p-4 text-center">Rank SAW</th>
                        <th className="p-4">Identitas Warga</th>
                        <th className="p-4">Alamat</th>
                        <th className="p-4 text-center">Skor Kelayakan</th>
                        <th className="p-4 text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {loading ? <tr><td colSpan="5" className="p-8 text-center">Memuat data...</td></tr> : 
                     candidates.length === 0 ? <tr><td colSpan="5" className="p-8 text-center">Tidak ada warga berstatus LAYAK. Harap lakukan verifikasi SAW dulu.</td></tr> :
                     candidates.map((warga, index) => (
                        <tr key={warga._id} className="hover:bg-emerald-50/30 transition">
                            <td className="p-4 text-center font-bold text-slate-400">#{index + 1}</td>
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-100 rounded-full"><User size={18}/></div>
                                    <div>
                                        <p className="font-bold text-slate-800">{warga.nama}</p>
                                        <p className="text-xs text-slate-400">{warga.nik}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4"><span className="font-mono bg-slate-100 px-2 py-1 rounded">RT {warga.alamat_rt}</span></td>
                            <td className="p-4 text-center">
                                <span className="text-emerald-600 font-extrabold text-lg">{warga.skor_saw ? warga.skor_saw.toFixed(3) : '0'}</span>
                            </td>
                            <td className="p-4 text-center">
                                <button 
                                    onClick={() => handleDistribute(warga)}
                                    className="group relative inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 shadow-lg hover:shadow-emerald-300 hover:-translate-y-0.5"
                                >
                                    <Send size={14} className="transition-transform group-hover:translate-x-1"/>
                                    Salurkan Sekarang
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
}