"use client";
import { useEffect, useState } from 'react';
import { MessageSquare, User, Clock, AlertTriangle, Construction, ShieldAlert, HeartHandshake, Trash2 } from 'lucide-react';

export default function AspirasiPage() {
  const [aspirasi, setAspirasi] = useState([]);
  const [stats, setStats] = useState({ infrastruktur: 0, keamanan: 0, sosial: 0, urgensi_tinggi: 0 });
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('/api/aspirasi').then(r => r.json()).then(res => {
        setAspirasi(res.data || []);
        setStats(res.stats || {});
    });
  };

  // --- FITUR BARU: FUNGSI HAPUS ---
  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus aspirasi ini? Data akan hilang permanen.")) return;

    try {
        const res = await fetch(`/api/aspirasi?id=${id}`, { method: 'DELETE' });
        const json = await res.json();
        
        if (json.success) {
            // Update state lokal langsung (hapus item dari layar) tanpa reload
            setAspirasi(prev => prev.filter(item => item._id !== id));
            // Opsional: Ambil ulang statistik agar angka di atas update
            fetchData(); 
            alert("Laporan berhasil dihapus.");
        } else {
            alert("Gagal menghapus data.");
        }
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan sistem.");
    }
  };
  // -------------------------------

  const filteredData = filter === 'ALL' ? aspirasi : aspirasi.filter(a => a.kategori === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER & STATISTIK */}
        <div>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Pusat Aspirasi & AI Filter</h1>
            <p className="text-slate-500 mb-6">Monitoring keluhan warga dengan pengelompokan otomatis.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Infrastruktur" value={stats.infrastruktur} icon={<Construction/>} color="bg-blue-500" />
                <StatBox label="Keamanan" value={stats.keamanan} icon={<ShieldAlert/>} color="bg-red-500" />
                <StatBox label="Sosial" value={stats.sosial} icon={<HeartHandshake/>} color="bg-emerald-500" />
                <StatBox label="Urgensi Tinggi" value={stats.urgensi_tinggi} icon={<AlertTriangle/>} color="bg-orange-500" isAlert />
            </div>
        </div>

        {/* FILTER TAB */}
        <div className="flex gap-2 overflow-x-auto pb-2">
            {['ALL', 'INFRASTRUKTUR', 'KEAMANAN', 'SOSIAL', 'ADMINISTRASI'].map((cat) => (
                <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                        filter === cat ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* DAFTAR PESAN */}
        <div className="space-y-4">
            {filteredData.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 text-slate-400">
                    Tidak ada aspirasi pada kategori ini.
                </div>
            ) : (
                filteredData.map((item) => (
                    <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition relative overflow-hidden group">
                        {/* Indicator Bar di kiri */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getUrgencyColor(item.urgensi)}`}></div>

                        <div className="flex justify-between items-start mb-3 pl-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                                    <User size={20}/>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{item.nama_pelapor || 'Anonim'}</h4>
                                    <p className="text-xs text-slate-400">Kepada: RT {item.rt_tujuan}</p>
                                </div>
                            </div>
                            
                            {/* Right Side: Badges & Delete Button */}
                            <div className="flex flex-col items-end gap-2">
                                {/* BADGES AI */}
                                <div className="flex gap-1">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold text-white ${getCategoryColor(item.kategori)}`}>
                                        {item.kategori}
                                    </span>
                                    {item.urgensi === 'TINGGI' && (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100 animate-pulse">
                                            <AlertTriangle size={10}/> URGENSI TINGGI
                                        </span>
                                    )}
                                </div>
                                
                                {/* TOMBOL HAPUS (Hanya muncul saat hover card atau selalu ada tergantung selera) */}
                                <button 
                                    onClick={() => handleDelete(item._id)}
                                    className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded transition"
                                >
                                    <Trash2 size={12} /> Hapus Laporan
                                </button>
                            </div>
                        </div>

                        <div className="pl-4">
                            <div className="bg-slate-50 p-4 rounded-xl text-slate-700 text-sm leading-relaxed italic">
                                "{item.isi_laporan}"
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                                <Clock size={14}/>
                                {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
  );
}

const StatBox = ({ label, value, icon, color, isAlert }) => (
    <div className={`p-4 rounded-2xl border shadow-sm flex items-center gap-3 ${isAlert ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
        <div className={`p-2 rounded-lg text-white ${color}`}>{icon}</div>
        <div>
            <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
            <p className="text-xs text-slate-500 uppercase font-bold">{label}</p>
        </div>
    </div>
);

// Helper Warna
const getCategoryColor = (cat) => {
    switch(cat) {
        case 'INFRASTRUKTUR': return 'bg-blue-500';
        case 'KEAMANAN': return 'bg-red-500';
        case 'SOSIAL': return 'bg-emerald-500';
        default: return 'bg-slate-400';
    }
}

const getUrgencyColor = (urg) => {
    switch(urg) {
        case 'TINGGI': return 'bg-red-500';
        case 'SEDANG': return 'bg-orange-400';
        default: return 'bg-slate-200';
    }
}