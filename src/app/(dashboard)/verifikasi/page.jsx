"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatRupiah } from '../../../lib/utils'; 
import { Calculator, Trophy, FileDown, Printer, Filter, CheckCircle, XCircle, User, Layers } from 'lucide-react';
import * as XLSX from 'xlsx'; 

export default function VerifikasiPage() {
  const [dataWarga, setDataWarga] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [filterRT, setFilterRT] = useState('ALL');

  // 1. FETCH DATA
  const fetchData = () => {
    fetch('/api/warga')
      .then(res => res.json())
      .then(res => {
         // Urutkan berdasarkan SKOR tertinggi
         const sorted = (res.data || []).sort((a, b) => b.skor_saw - a.skor_saw);
         setDataWarga(sorted);
         setFilteredData(sorted);
         setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  // 2. FILTER RT
  useEffect(() => {
    if (filterRT === 'ALL') setFilteredData(dataWarga);
    else setFilteredData(dataWarga.filter(w => w.alamat_rt === filterRT));
  }, [filterRT, dataWarga]);

  // 3. LOGIKA BUTTON HITUNG SAW
  const hitungSAW = async () => {
    setCalculating(true);
    try {
        const res = await fetch('/api/hitung-saw', { method: 'POST' });
        if (res.ok) { 
            alert("✅ Perhitungan Selesai! Data telah diurutkan."); 
            fetchData(); // Refresh tabel otomatis
        } else {
            alert("❌ Gagal menghitung. Cek server.");
        }
    } catch (e) { alert("Error koneksi."); }
    setCalculating(false);
  };

  // 4. LOGIKA BUTTON PDF (PRINT LAPORAN)
  const exportPDF = () => {
    // Fungsi ini akan memicu tampilan cetak browser
    // CSS @media print akan mengatur tampilannya
    window.print();
  };

  // 5. LOGIKA BUTTON EXCEL
  const exportToExcel = () => {
    const dataToExport = filteredData.map((w, i) => ({
        "Rank": i + 1, 
        "Nama": w.nama, 
        "NIK": `'${w.nik}`, 
        "RT": w.alamat_rt, 
        "Penghasilan": w.penghasilan,
        "Skor SAW": w.skor_saw, 
        "Status": w.status_kelayakan
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Bansos");
    XLSX.writeFile(workbook, "Laporan_SPK_SAW.xlsx");
  };

  return (
    <div>
      {/* --- HEADER & TOMBOL (AKAN HILANG SAAT PRINT) --- */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-8 print:hidden">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Verifikasi & Ranking SAW</h1>
            <p className="text-slate-500 mt-2 text-sm">Sistem Pendukung Keputusan prioritas penerima bantuan.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
             {/* Filter Dropdown */}
             <div className="flex items-center px-4 border-r border-slate-200">
                <Filter size={16} className="text-slate-400 mr-3"/>
                <select className="bg-transparent outline-none text-sm font-semibold text-slate-700 min-w-[100px] cursor-pointer" 
                    value={filterRT} onChange={(e) => setFilterRT(e.target.value)}>
                    <option value="ALL">Semua Wilayah</option>
                    <option value="01">RT 01</option>
                    <option value="02">RT 02</option>
                    <option value="03">RT 03</option>
                </select>
             </div>
             
             {/* Buttons */}
             <button onClick={exportToExcel} className="btn-action bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"><FileDown size={16}/> Excel</button>
             <button onClick={exportPDF} className="btn-action bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"><Printer size={16}/> PDF</button>
             <button onClick={hitungSAW} disabled={calculating} className="btn-action bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 animate-pulse-once">
                {calculating ? 'Menghitung...' : <><Calculator size={16}/> Hitung SAW</>}
             </button>
          </div>
      </div>
      
      {/* --- CONTAINER UTAMA --- */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
        
        {/* --- KOP SURAT (KHUSUS PDF/PRINT) --- */}
        <div className="hidden print:block text-center mb-4 pt-4 pb-4 border-b-2 border-black">
            <h2 className="text-2xl font-bold uppercase text-black">PEMERINTAH DESA MAJU JAYA</h2>
            <p className="text-sm text-black">Jl. Merdeka No. 45, Kecamatan Sejahtera, Kabupaten Makmur</p>
            <h3 className="text-xl font-bold uppercase mt-4 underline text-black">LAPORAN HASIL PERANGKINGAN BANSOS (SAW)</h3>
            <p className="text-sm text-black mt-1">Filter Wilayah: {filterRT === 'ALL' ? 'Semua RT' : `RT ${filterRT}`} | Tanggal Cetak: {new Date().toLocaleDateString()}</p>
        </div>

        {/* --- TABEL DATA --- */}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200 print:bg-gray-200 print:text-black print:border-black">
                    <th className="p-6 font-bold text-center w-20 print:border print:border-black">Rank</th>
                    <th className="p-6 font-bold print:border print:border-black">Identitas Penerima</th>
                    <th className="p-6 font-bold print:border print:border-black">Kriteria Penilaian</th>
                    <th className="p-6 font-bold text-center print:border print:border-black">Skor Akhir (V)</th>
                    <th className="p-6 font-bold text-center print:border print:border-black">Status</th>
                    <th className="p-6 font-bold text-center print:hidden">Aksi</th>
                </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 print:divide-black">
                {loading ? <tr><td colSpan="6" className="p-10 text-center">Loading data...</td></tr> :
                 filteredData.length === 0 ? <tr><td colSpan="6" className="p-10 text-center text-slate-400">Data kosong.</td></tr> :
                 filteredData.map((warga, index) => (
                    <tr key={warga._id} className={`group hover:bg-slate-50/80 transition duration-200 ${index < 3 ? 'bg-amber-50/40 print:bg-white' : ''}`}>
                        
                        {/* RANKING */}
                        <td className="p-6 text-center print:border print:border-black print:text-black">
                            {index < 3 ? 
                                <div className="w-8 h-8 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold shadow-sm border border-amber-200 print:border-none print:bg-transparent print:text-black">{index+1}</div> 
                                : <span className="font-semibold text-slate-400 print:text-black">#{index+1}</span>}
                        </td>

                        {/* IDENTITAS */}
                        <td className="p-6 print:border print:border-black">
                            <div className="font-bold text-slate-800 text-base uppercase print:text-black">{warga.nama}</div>
                            <div className="text-xs text-slate-400 mt-0.5 print:text-black">
                                NIK: {warga.nik} &bull; <span className="font-bold">RT {warga.alamat_rt}</span>
                            </div>
                        </td>
                        
                        {/* KRITERIA */}
                        <td className="p-6 text-xs text-slate-600 print:text-black print:border print:border-black">
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                <div className="flex justify-between"><span>Gaji:</span> <b>{formatRupiah(warga.penghasilan)}</b></div>
                                <div className="flex justify-between"><span>Tanggungan:</span> <b>{warga.tanggungan} Org</b></div>
                                <div className="col-span-2 mt-1 pt-1 border-t border-slate-100 print:border-black">
                                    <span>Kerja: {warga.nama_pekerjaan || '-'} (Nilai: {warga.status_pekerjaan})</span>
                                </div>
                            </div>
                        </td>

                        {/* SKOR */}
                        <td className="p-6 text-center print:border print:border-black">
                            <span className="text-xl font-extrabold text-indigo-600 print:text-black">
                                {warga.skor_saw ? Number(warga.skor_saw).toFixed(4) : '0.000'}
                            </span>
                        </td>

                        {/* STATUS */}
                        <td className="p-6 text-center print:border print:border-black">
                            <BadgeStatus status={warga.status_kelayakan} />
                        </td>

                        {/* AKSI (HILANG SAAT PRINT) */}
                        <td className="p-6 text-center print:hidden">
                             <Link href={`/warga/${warga._id}`} className="text-blue-600 hover:underline font-bold text-xs">Detail</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* --- FOOTER TANDA TANGAN (KHUSUS PDF/PRINT) --- */}
        <div className="hidden print:flex justify-end mt-10 mr-10 text-black">
            <div className="text-center">
                <p className="mb-20">Mengetahui,<br/>Kepala Desa Maju Jaya</p>
                <p className="font-bold underline">BAPAK KEPALA DESA</p>
                <p>NIP. 19871212 201001 1 003</p>
            </div>
        </div>

      </div>
    </div>
  );
}

const BadgeStatus = ({ status }) => {
    let color = "bg-slate-100 text-slate-500 border-slate-200";
    if (status === 'LAYAK') color = "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === 'TIDAK_LAYAK') color = "bg-red-50 text-red-600 border-red-100";

    // Tampilan Print Friendly (Clean)
    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${color} print:bg-transparent print:text-black print:border-black`}>
            {status.replace('_', ' ')}
        </span>
    );
}