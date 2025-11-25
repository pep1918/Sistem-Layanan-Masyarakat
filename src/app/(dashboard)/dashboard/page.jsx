"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Wallet, CheckCircle, Activity, Megaphone, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRupiah } from '../../../lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, layak: 0, pending: 0, kas: 0, aduan: 0 });
  const [chartData, setChartData] = useState([]);
  const [user, setUser] = useState('Petugas');

  useEffect(() => {
    // 1. Ambil Nama User dari LocalStorage
    const session = localStorage.getItem('user_session');
    if (session) setUser(JSON.parse(session).name);

    // 2. Ambil Data Statistik Real-time dari API
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
          setStats({
              total: data.total || 0,
              layak: data.layak || 0,
              pending: data.pending || 0,
              kas: data.kas || 0,
              aduan: data.aduan || 0
          });

          // Set Data Grafik (Jika API mengirim data chart, gunakan. Jika tidak, pakai dummy agar tidak error)
          if (data.chart && data.chart.length > 0) {
             setChartData(data.chart);
          } else {
             // Fallback data jika database masih kosong
             setChartData([
                { name: 'RT 01', total: 0, layak: 0 },
                { name: 'RT 02', total: 0, layak: 0 },
                { name: 'RT 03', total: 0, layak: 0 }
             ]);
          }
      })
      .catch(err => console.error("Gagal mengambil data dashboard:", err));
  }, []);

  const currentDate = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-10">
      
      {/* 1. HERO WELCOME HEADER (Lebih Besar & Elegan) */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative overflow-hidden flex flex-col md:flex-row justify-between items-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        {/* Dekorasi Background Halus */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-50"></div>

        <div className="relative z-10">
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">Halo, {user} 👋</h1>
            <p className="text-slate-500 mt-3 text-lg font-medium">{currentDate} &bull; Pantau data desa secara real-time.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0">
            <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600 font-bold text-sm uppercase tracking-wider">System Online</span>
            </div>
        </div>
      </div>

      {/* 2. STATS CARDS (Grid Responsif Besar - Big & Bold) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        
        <BigCard 
            title="Total Warga" 
            value={stats.total} 
            icon={<Users size={32} className="text-white"/>} 
            color="bg-blue-600" 
            desc="Terdata dalam sistem"
        />
        
        <BigCard 
            title="Saldo Kas RT" 
            value={formatRupiah(stats.kas)} 
            icon={<Wallet size={32} className="text-white"/>} 
            color="bg-emerald-600" 
            desc="Dana operasional aktif"
            isMoney
        />
        
        <BigCard 
            title="Layak Bansos" 
            value={stats.layak} 
            icon={<CheckCircle size={32} className="text-white"/>} 
            color="bg-violet-600" 
            desc="Rekomendasi sistem SAW"
        />

        <BigCard 
            title="Menunggu Validasi" 
            value={stats.pending} 
            icon={<Activity size={32} className="text-white"/>} 
            color="bg-orange-500" 
            desc="Data warga belum dicek RW"
        />

        <BigCard 
            title="Aspirasi Baru" 
            value={stats.aduan} 
            icon={<Megaphone size={32} className="text-white"/>} 
            color="bg-pink-500" 
            desc="Pesan masuk belum dibaca"
        />
        
        {/* Kartu Pintasan Cepat (Shortcut Card) */}
        <Link href="/input-bansos" className="bg-white p-8 rounded-[2rem] shadow-lg border border-slate-100 flex flex-col justify-center items-start hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors relative z-10">Input Data Baru</h3>
            <p className="text-slate-400 mb-4 relative z-10">Tambahkan data warga...</p>
            <div className="p-4 bg-blue-50 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                <ArrowRight size={24}/>
            </div>
        </Link>
      </div>

      {/* 3. CHART & INFO SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* GRAFIK (Lebih Lebar & Jelas) */}
        <div className="xl:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800">Statistik Sebaran</h3>
                    <p className="text-slate-400 mt-1">Perbandingan total warga vs penerima layak per wilayah</p>
                </div>
            </div>
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 14, fontWeight: 600}} dy={10}/>
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}}
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0,0,0,0.1)', padding: '12px'}}
                        />
                        <Bar dataKey="total" name="Total Populasi" fill="#cbd5e1" radius={[6, 6, 6, 6]} barSize={40} />
                        <Bar dataKey="layak" name="Layak Terima" fill="#4f46e5" radius={[6, 6, 6, 6]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* PANEL INFORMASI SAW (Lebih Tinggi & Informatif) */}
        <div className="bg-[#1e293b] p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
            
            <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 border-b border-slate-700 pb-4">Algoritma SAW</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                    Sistem menggunakan metode *Simple Additive Weighting* untuk menentukan prioritas penerima bantuan secara otomatis.
                </p>
                
                <div className="space-y-5">
                    <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="p-3 bg-indigo-500/20 text-indigo-300 rounded-xl font-bold text-lg">50%</div>
                        <div>
                            <h4 className="font-bold text-lg text-indigo-200">Penghasilan</h4>
                            <p className="text-slate-400 text-xs">Prioritas pada penghasilan terendah (Cost).</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl font-bold text-lg">30%</div>
                        <div>
                            <h4 className="font-bold text-lg text-emerald-200">Tanggungan</h4>
                            <p className="text-slate-400 text-xs">Semakin banyak tanggungan, skor naik (Benefit).</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                        <div className="p-3 bg-orange-500/20 text-orange-300 rounded-xl font-bold text-lg">20%</div>
                        <div>
                            <h4 className="font-bold text-lg text-orange-200">Pekerjaan</h4>
                            <p className="text-slate-400 text-xs">Pekerjaan tidak tetap diprioritaskan (Benefit).</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Component Kartu Besar (Big Card)
const BigCard = ({ title, value, icon, color, desc, isMoney }) => (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-lg border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-slate-50 rounded-full group-hover:bg-slate-100 transition-colors duration-500"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl shadow-lg ${color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    <TrendingUp size={14} className="text-emerald-500"/>
                    <span className="text-xs font-bold text-emerald-600">+Live</span>
                </div>
            </div>
            <div>
                <h3 className={`font-black text-slate-800 mb-1 tracking-tight ${isMoney ? 'text-3xl' : 'text-5xl'}`}>
                    {value}
                </h3>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-wide mb-2">{title}</p>
                <p className="text-xs text-slate-400 font-medium bg-slate-50 inline-block px-2 py-1 rounded-lg">{desc}</p>
            </div>
        </div>
    </div>
);