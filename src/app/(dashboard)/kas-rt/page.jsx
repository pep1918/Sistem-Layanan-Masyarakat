"use client";
import { useState, useEffect } from 'react';
import { formatRupiah } from '../../../lib/utils';
import { Trash2, Loader2, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'; 

export default function KasRTPage() {
    const [kas, setKas] = useState([]);
    const [form, setForm] = useState({ tipe: 'MASUK', nominal: '', keterangan: '' });
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const fetchKas = () => fetch('/api/kas').then(r => r.json()).then(r => setKas(r.data || []));
    useEffect(() => { fetchKas() }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await fetch('/api/kas', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(form) });
        setForm({ tipe: 'MASUK', nominal: '', keterangan: '' }); fetchKas(); setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus data ini?")) return;
        setDeletingId(id);
        const res = await fetch(`/api/kas?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchKas();
        setDeletingId(null);
    };

    const saldo = kas.reduce((acc, curr) => curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                {/* SALDO CARD */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-3xl p-8 text-white shadow-xl flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest mb-2">Total Saldo Kas</p>
                        <h2 className="text-4xl font-extrabold">{formatRupiah(saldo)}</h2>
                        <p className="text-emerald-200 text-sm mt-2 opacity-80">Dana operasional RT yang tersedia</p>
                    </div>
                    <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm relative z-10">
                        <Wallet size={40} className="text-white" />
                    </div>
                    {/* Background Pattern */}
                    <div className="absolute -right-10 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                </div>

                {/* TRANSAKSI LIST */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg">Riwayat Transaksi</h3>
                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{kas.length} Data</span>
                    </div>
                    <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                        {kas.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">Belum ada transaksi.</div>
                        ) : (
                            kas.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-5 border-b border-slate-50 hover:bg-slate-50 transition group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${item.tipe === 'MASUK' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            {item.tipe === 'MASUK' ? <ArrowUpCircle size={20}/> : <ArrowDownCircle size={20}/>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm md:text-base">{item.keterangan}</p>
                                            <p className="text-xs text-slate-400 mt-1">{new Date(item.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`font-bold ${item.tipe === 'MASUK' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {item.tipe === 'MASUK' ? '+' : '-'} {formatRupiah(item.nominal)}
                                        </span>
                                        <button onClick={() => handleDelete(item._id)} disabled={deletingId === item._id} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100">
                                            {deletingId === item._id ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16}/>}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* FORM INPUT */}
            <div>
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 sticky top-8">
                    <h3 className="font-bold text-xl text-slate-800 mb-6">Catat Transaksi</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jenis</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" onClick={() => setForm({...form, tipe: 'MASUK'})} 
                                    className={`py-3 rounded-xl text-sm font-bold transition ${form.tipe === 'MASUK' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                                    Pemasukan
                                </button>
                                <button type="button" onClick={() => setForm({...form, tipe: 'KELUAR'})}
                                    className={`py-3 rounded-xl text-sm font-bold transition ${form.tipe === 'KELUAR' ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-500'}`}>
                                    Pengeluaran
                                </button>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nominal</label>
                            <input type="number" placeholder="0" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50" 
                                value={form.nominal} onChange={e=>setForm({...form, nominal: e.target.value})} required />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Keterangan</label>
                            <textarea placeholder="" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50" rows="3"
                                value={form.keterangan} onChange={e=>setForm({...form, keterangan: e.target.value})} required />
                        </div>

                        <button disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
                            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}