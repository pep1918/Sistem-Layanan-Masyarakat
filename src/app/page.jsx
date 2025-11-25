"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Wallet, Megaphone, ArrowRight, Banknote, Users, X, Loader2, Calendar, Activity, MapPin, Clock } from 'lucide-react';

const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

export default function LandingPage() {
  // Tambahkan total_agenda di state default
  const [stats, setStats] = useState({ kas_rt: 0, dana_bansos: 0, total_penerima: 0, total_agenda: 0 });
  const [laporan, setLaporan] = useState({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
  const [loading, setLoading] = useState(false);

  // STATE UNTUK MODAL
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', type: '', data: [] });
  const [loadingModal, setLoadingModal] = useState(false);

  useEffect(() => {
    // Fetch Data Ringkasan Saat Halaman Dibuka
    fetch('/api/public').then(res => res.json()).then(data => {
        if(data.success) {
            setStats({ 
                kas_rt: data.kas_rt, 
                dana_bansos: data.dana_bansos, 
                total_penerima: data.total_penerima,
                total_agenda: data.total_agenda // Menangkap data jumlah agenda
            });
        }
      }).catch(err => console.error("Gagal load stats:", err));
  }, []);

  // Fungsi Buka Detail (Reused untuk Kas, Bansos, dan Agenda)
  const openDetail = async (type, title) => {
    setShowModal(true);
    setModalContent({ title, type, data: [] });
    setLoadingModal(true);

    try {
        const res = await fetch(`/api/public?type=${type}`);
        const result = await res.json();
        if(result.success) {
            setModalContent({ title, type, data: result.data });
        }
    } catch (error) {
        console.error("Gagal ambil detail", error);
    }
    setLoadingModal(false);
  };

  const handleKirimLaporan = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/public', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(laporan)
    });
    if(res.ok) {
      alert("Laporan terkirim!");
      setLaporan({ nama_pelapor: '', rt_tujuan: '01', isi_laporan: '' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden relative">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 top-0 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2 rounded-lg">
                 <ShieldCheck className="text-white" size={24} />
               </div>
               <span className="font-bold text-xl text-white tracking-tight">DESA MAJU JAYA</span>
            </div>
            <Link href="/login" className="group bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-all flex items-center gap-2 border border-white/10">
              Login Petugas <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
            </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-32 pb-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest mb-6 uppercase">
                Sistem Layanan Masyarakat
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Transparansi Dana & <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Pelayanan Warga Digital</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Pantau dana sosial, agenda kegiatan, dan sampaikan aspirasi secara *real-time*.
            </p>
        </div>
      </header>

      {/* STATS CARDS & AGENDA BOX */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10 mb-20 space-y-6">
        
        {/* ROW 1: 3 KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => openDetail('kas', 'Laporan Kas RT (10 Terakhir)')} className="cursor-pointer">
                <StatCard 
                    icon={<Wallet size={32} className="text-emerald-400"/>} 
                    label="Total Kas RT (Aktif)" value={formatRupiah(stats.kas_rt)} 
                    desc="Klik untuk detail transaksi" gradient="from-emerald-500/20 to-emerald-900/20" border="border-emerald-500/30"
                />
            </div>
            <div onClick={() => openDetail('penyaluran', 'Riwayat Penyaluran Bantuan')} className="cursor-pointer">
                <StatCard 
                    icon={<Banknote size={32} className="text-blue-400"/>} 
                    label="Dana Bansos Tersalurkan" value={formatRupiah(stats.dana_bansos)}  
                    desc="Klik untuk riwayat penyaluran" gradient="from-blue-500/20 to-blue-900/20" border="border-blue-500/30"
                />
            </div>
            <div onClick={() => openDetail('penyaluran', 'Daftar Penerima Bantuan')} className="cursor-pointer">
                <StatCard 
                    icon={<Users size={32} className="text-orange-400"/>} 
                    label="Penerima Bantuan" value={`${stats.total_penerima} Warga`} 
                    desc="Total warga penerima" gradient="from-orange-500/20 to-orange-900/20" border="border-orange-500/30"
                />
            </div>
        </div>

        {/* ROW 2: 1 BOX BESAR UNTUK AGENDA (HASIL PERMINTAAN) */}
        <div onClick={() => openDetail('agenda', 'Kalender Kegiatan Desa')} className="cursor-pointer group relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/40 to-slate-900/40 border border-purple-500/30 p-8 backdrop-blur-xl hover:bg-slate-800/50 transition-all duration-300">
             <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500 rotate-12">
                 <Calendar size={120} className="text-purple-500"/>
             </div>
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-6">
                     <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                         <Calendar size={32} />
                     </div>
                     <div>
                         <h3 className="text-2xl font-bold text-white mb-1">Agenda & Kegiatan Desa</h3>
                         <p className="text-slate-400 text-lg">
                             Terdapat <span className="text-purple-400 font-bold">{stats.total_agenda || 0} agenda</span> kegiatan mendatang.
                         </p>
                     </div>
                 </div>
                 <div className="flex items-center gap-2 bg-purple-500/10 text-purple-300 px-6 py-3 rounded-full border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors font-medium">
                     Lihat Jadwal Lengkap <ArrowRight size={18}/>
                 </div>
             </div>
        </div>

      </div>

      {/* MODAL / POPUP DETAIL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-2xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/80 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <span className="bg-slate-700 p-2 rounded-lg"><Activity size={20} className="text-blue-400"/></span>
                        {modalContent.title}
                    </h3>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-700 rounded-full transition text-slate-400 hover:text-white"><X size={24}/></button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                    {loadingModal ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
                             <Loader2 size={40} className="animate-spin text-blue-500"/>
                             <p>Mengambil data terbaru...</p>
                        </div>
                    ) : modalContent.data.length === 0 ? (
                        <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                             <p className="text-slate-400">Belum ada data tersedia saat ini.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {/* --- LOGIKA TAMPILAN AGENDA DITAMBAHKAN DI SINI --- */}
                            {modalContent.type === 'agenda' && modalContent.data.map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-purple-500/40 transition-colors">
                                     <div className="flex flex-col items-center justify-center bg-slate-800 rounded-lg p-3 w-16 h-16 border border-slate-700 text-center">
                                         <span className="text-xs text-slate-400 uppercase font-bold">{new Date(item.date).toLocaleDateString('id-ID', {month:'short'})}</span>
                                         <span className="text-xl font-bold text-white">{new Date(item.date).getDate()}</span>
                                     </div>
                                     <div className="flex-1">
                                         <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-white text-lg">{item.title}</h4>
                                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded border border-purple-500/20 uppercase tracking-wider">{item.type}</span>
                                         </div>
                                         <div className="mt-2 flex items-center gap-4 text-sm text-slate-400">
                                             <span className="flex items-center gap-1.5"><Clock size={14}/> {item.time}</span>
                                             <span className="flex items-center gap-1.5"><MapPin size={14}/> {item.location}</span>
                                         </div>
                                     </div>
                                </div>
                            ))}

                            {/* --- TAMPILAN MODAL KAS --- */}
                            {modalContent.type === 'kas' && modalContent.data.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                    <div>
                                        <p className="font-bold text-slate-200">{item.keterangan}</p>
                                        <p className="text-xs text-slate-500">{new Date(item.tanggal).toLocaleDateString('id-ID', {dateStyle:'full'})}</p>
                                    </div>
                                    <span className={`font-mono font-bold ${item.tipe === 'MASUK' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {item.tipe === 'MASUK' ? '+' : '-'} {formatRupiah(item.nominal)}
                                    </span>
                                </div>
                            ))}

                            {/* --- TAMPILAN MODAL BANSOS --- */}
                            {modalContent.type === 'penyaluran' && modalContent.data.map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">
                                            {item.nama_penerima.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">{item.nama_penerima}</p>
                                            <p className="text-xs text-slate-500">RT {item.alamat_rt} • {item.jenis_bantuan}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-mono font-bold text-emerald-400">{formatRupiah(item.nominal)}</span>
                                        <span className="text-[10px] text-slate-500">{new Date(item.tanggal_salur).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* FORM PENGADUAN */}
      <section className="py-20 bg-slate-900/50 border-t border-slate-800">
         <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <div className="mb-6 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <Megaphone size={24} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">Suara Anda Didengar</h2>
                <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                    Sampaikan keluhan lingkungan atau pertanyaan seputar bansos.
                </p>
            </div>
            <div className="bg-[#1e293b] p-8 rounded-3xl border border-slate-700 shadow-2xl relative">
                <form onSubmit={handleKirimLaporan} className="space-y-5">
                    <InputGroup label="Nama" placeholder="Nama Lengkap" onChange={e => setLaporan({...laporan, nama_pelapor: e.target.value})} />
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Isi Laporan</label>
                        <textarea rows="4" required className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Isi laporan..." onChange={e => setLaporan({...laporan, isi_laporan: e.target.value})} value={laporan.isi_laporan}></textarea>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition">
                        {loading ? 'Mengirim...' : 'Kirim Laporan'}
                    </button>
                </form>
            </div>
         </div>
      </section>

      <footer className="bg-[#0f172a] py-8 text-center border-t border-slate-800">
        <p className="text-slate-500 text-sm">&copy; 2025</p>
      </footer>
    </div>
  );
}

// COMPONENT CARD UTILITY
const StatCard = ({ icon, label, value, desc, gradient, border }) => (
    <div className={`relative p-8 rounded-3xl bg-gradient-to-br ${gradient} border ${border} backdrop-blur-xl overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 h-full flex flex-col justify-between`}>
        <div className="absolute top-0 right-0 p-6 opacity-50 group-hover:scale-110 transition-transform duration-500">{icon}</div>
        <div className="relative z-10">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{value}</h3>
            <p className="text-slate-300 font-medium mb-4">{label}</p>
            <div className="inline-flex items-center gap-1 text-xs text-white/60 bg-white/10 px-3 py-1 rounded-full group-hover:bg-white/20 transition-colors">
                <Activity size={12} /> {desc}
            </div>
        </div>
    </div>
);

const InputGroup = ({ label, placeholder, onChange }) => (
    <div>
        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">{label}</label>
        <input type="text" className="w-full bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder={placeholder} onChange={onChange} />
    </div>
);