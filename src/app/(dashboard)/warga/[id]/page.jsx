"use client";
import { useState, useEffect, useRef } from 'react';
import { Printer, ArrowLeft, FileCheck, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { formatRupiah } from '../../../../lib/utils'; 

export default function DetailWargaPage({ params }) {
  const router = useRouter();
  const [warga, setWarga] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [jenisSurat, setJenisSurat] = useState('RT'); 
  const printRef = useRef();

  // 1. Ambil Data Warga berdasarkan ID dari URL
  useEffect(() => {
    // Pastikan ID ada sebelum fetch
    if (params.id) {
        fetch(`/api/warga/${params.id}`)
        .then(res => res.json())
        .then(data => {
            if(data.success) setWarga(data.data);
            setLoading(false);
        })
        .catch(err => setLoading(false));
    }
  }, [params.id]);

  // 2. Fungsi Cetak (Menggunakan Window Print)
  const handlePrint = (tipe) => {
    setJenisSurat(tipe);
    // Tunggu sebentar agar state jenisSurat berubah, baru print
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (!warga) return <div className="p-8 text-center text-red-500">Data tidak ditemukan.</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* --- TOMBOL KEMBALI --- */}
      <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-blue-600 mb-6 transition print:hidden">
        <ArrowLeft size={20} className="mr-2"/> Kembali ke Daftar
      </button>

      {/* --- CARD DETAIL BANTUAN --- */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden mb-8 print:hidden">
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <User size={28}/> Detail Penerima Bantuan
                </h1>
                <p className="text-slate-400 text-sm mt-1">NIK: {warga.nik}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-sm ${warga.status_kelayakan === 'LAYAK' ? 'bg-green-500' : 'bg-red-500'}`}>
                {warga.status_kelayakan}
            </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <DetailItem label="Nama Lengkap" value={warga.nama} />
                <DetailItem label="Alamat Wilayah" value={`RT ${warga.alamat_rt} / RW 05`} /> {/* Default RW 05 sesuai template */}
                <DetailItem label="Pekerjaan" value={warga.nama_pekerjaan || '-'} /> 
            </div>
            <div className="space-y-4">
                <DetailItem label="Penghasilan" value={formatRupiah(warga.penghasilan)} />
                <DetailItem label="Jumlah Tanggungan" value={`${warga.tanggungan} Orang`} />
                <DetailItem label="Status Verifikasi" value={warga.status_approval?.replace('_', ' ') || 'PENDING'} />
            </div>
        </div>

        {/* --- TOMBOL CETAK --- */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex gap-4 justify-end">
             <button 
                onClick={() => handlePrint('RT')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
             >
                <Printer size={20}/> Cetak Surat Kelayakan RT
             </button>
             <button 
                onClick={() => handlePrint('RW')}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
             >
                <FileCheck size={20}/> Cetak Rekomendasi RW
             </button>
        </div>
      </div>

      {/* ================================================================================== */}
      {/* TEMPLATE SURAT (HANYA MUNCUL SAAT DI-PRINT) */}
      {/* ================================================================================== */}
      <div className="hidden print:block bg-white p-10 text-black font-serif leading-relaxed">
        
        {/* KOP SURAT */}
        <div className="text-center border-b-4 border-double border-black pb-4 mb-8">
            <h2 className="text-xl font-bold uppercase">Pemerintah Kabupaten Maju Jaya</h2>
            <h3 className="text-2xl font-bold uppercase">Desa Sejahtera Kecamatan Makmur</h3>
            <p className="text-sm mt-1">Sekretariat: Jl. Raya Desa No. 123, Telp (021) 555-999</p>
        </div>

        {/* JUDUL SURAT */}
        <div className="text-center mb-8">
            <h1 className="text-xl font-bold underline uppercase">
                {jenisSurat === 'RT' ? 'SURAT KETERANGAN KELAYAKAN' : 'SURAT REKOMENDASI BANTUAN'}
            </h1>
            <p>Nomor: 470 / {Math.floor(Math.random() * 100)} / {jenisSurat === 'RT' ? `RT.${warga.alamat_rt}` : 'RW.05'} / {new Date().getFullYear()}</p>
        </div>

        {/* ISI SURAT */}
        <div className="mb-6">
            <p className="mb-4">Yang bertanda tangan di bawah ini, Ketua {jenisSurat === 'RT' ? `RT ${warga.alamat_rt}` : 'RW 05'} Desa Sejahtera, menerangkan bahwa:</p>
            
            <table className="w-full mb-4 ml-4">
                <tbody>
                    <tr><td className="w-40 py-1">Nama</td><td>: <b>{warga.nama}</b></td></tr>
                    <tr><td className="w-40 py-1">NIK</td><td>: {warga.nik}</td></tr>
                    <tr><td className="w-40 py-1">Pekerjaan</td><td>: {warga.nama_pekerjaan || '-'}</td></tr>
                    <tr><td className="w-40 py-1">Alamat</td><td>: RT {warga.alamat_rt} / RW 05, Desa Sejahtera</td></tr>
                    <tr><td className="w-40 py-1">Penghasilan</td><td>: {formatRupiah(warga.penghasilan)} / bulan</td></tr>
                    <tr><td className="w-40 py-1">Tanggungan</td><td>: {warga.tanggungan} Orang</td></tr>
                </tbody>
            </table>

            <p className="mb-4 text-justify">
                {jenisSurat === 'RT' 
                    ? "Berdasarkan pengamatan kami, warga tersebut tergolong KELUARGA KURANG MAMPU dan BERHAK untuk diajukan sebagai penerima Bantuan Sosial Desa periode tahun ini."
                    : "Mengingat kondisi ekonomi yang bersangkutan, maka kami selaku Pengurus RW memberikan REKOMENDASI PENUH agar warga tersebut mendapatkan prioritas penyaluran bantuan."
                }
            </p>
            
            <p>Demikian surat ini dibuat dengan sebenar-benarnya untuk dipergunakan sebagaimana mestinya.</p>
        </div>

        {/* TANDA TANGAN */}
        <div className="flex justify-end mt-16">
            <div className="text-center">
                <p className="mb-20">Maju Jaya, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p className="font-bold underline">BAPAK {jenisSurat === 'RT' ? `KETUA RT ${warga.alamat_rt}` : 'KETUA RW 05'}</p>
                <p>NIP. ...........................</p>
            </div>
        </div>

      </div>
    </div>
  );
}

const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{label}</p>
        <p className="text-lg font-medium text-slate-800">{value}</p>
    </div>
);