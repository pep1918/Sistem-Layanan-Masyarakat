"use client";
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, Trash2, AlertCircle } from 'lucide-react';

export default function AdminAgendaPage() {
  const [agendas, setAgendas] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', type: 'Rapat' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    try {
      const res = await fetch('/api/agenda');
      const data = await res.json();
      if (data.success) {
        setAgendas(data.data);
      } else {
        console.error("Gagal ambil data:", data);
      }
    } catch (err) {
      console.error("Error fetch:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const result = await res.json();

      if (!res.ok || !result.success) {
        // JIKA GAGAL: Tampilkan error dari server (misal: Timeout / Validasi)
        throw new Error(result.error || "Gagal menyimpan data ke database.");
      }

      // JIKA SUKSES: Reset form & refresh tabel
      alert("Agenda berhasil ditambahkan!");
      setForm({ title: '', date: '', time: '', location: '', type: 'Rapat' }); 
      fetchAgendas();

    } catch (err) {
      // Tampilkan pesan error ke user
      console.error(err);
      setErrorMsg(err.message);
      alert("TERJADI ERROR: " + err.message); 
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!confirm('Hapus agenda ini?')) return;
    try {
        const res = await fetch(`/api/agenda?id=${id}`, { method: 'DELETE' });
        if(res.ok) {
            fetchAgendas();
        } else {
            alert("Gagal menghapus data.");
        }
    } catch (err) {
        alert("Error saat menghapus: " + err.message);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Manajemen Agenda Desa</h1>

      {/* FORM INPUT */}
      <div className="bg-white p-6 rounded-xl shadow border border-slate-100">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus size={20}/> Tambah Agenda Baru</h2>
        
        {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center gap-2 text-sm font-bold">
                <AlertCircle size={18}/> {errorMsg}
            </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Nama Acara</label>
                <input required type="text" placeholder="Contoh: Rapat RT Bulanan" className="w-full border p-2 rounded mt-1" 
                    value={form.title} onChange={e=>setForm({...form, title: e.target.value})} />
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Tanggal</label>
                <input required type="date" className="w-full border p-2 rounded mt-1" 
                    value={form.date} onChange={e=>setForm({...form, date: e.target.value})} />
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Waktu</label>
                <input required type="time" className="w-full border p-2 rounded mt-1" 
                    value={form.time} onChange={e=>setForm({...form, time: e.target.value})} />
            </div>
            
            <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Lokasi</label>
                <input required type="text" placeholder="Contoh: Balai Desa" className="w-full border p-2 rounded mt-1" 
                    value={form.location} onChange={e=>setForm({...form, location: e.target.value})} />
            </div>
            
            <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Kategori</label>
                <select className="w-full border p-2 rounded mt-1" value={form.type} onChange={e=>setForm({...form, type: e.target.value})}>
                    <option value="Rapat">Rapat</option>
                    <option value="Sosial">Sosial / Kerja Bakti</option>
                    <option value="Kesehatan">Kesehatan / Posyandu</option>
                    <option value="Keagamaan">Keagamaan</option>
                </select>
            </div>

            <button disabled={loading} className="bg-slate-900 text-white py-3 rounded hover:bg-slate-800 transition md:col-span-2 font-bold flex justify-center items-center gap-2">
                {loading ? 'Menghubungkan ke Database...' : 'Simpan Agenda'}
            </button>
        </form>
      </div>

      {/* TABEL LIST */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b">
                <tr>
                    <th className="p-4 font-bold text-slate-600">Tanggal</th>
                    <th className="p-4 font-bold text-slate-600">Acara</th>
                    <th className="p-4 font-bold text-slate-600">Lokasi</th>
                    <th className="p-4 font-bold text-slate-600">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {agendas.length === 0 ? (
                    <tr>
                        <td colSpan="4" className="p-8 text-center text-slate-400">Belum ada agenda yang tersimpan.</td>
                    </tr>
                ) : (
                    agendas.map(item => (
                        <tr key={item._id} className="border-b hover:bg-slate-50">
                            <td className="p-4">
                                <div className="font-bold">{new Date(item.date).toLocaleDateString('id-ID')}</div>
                                <div className="text-xs text-slate-500">{item.time}</div>
                            </td>
                            <td className="p-4">
                                <div className="font-bold">{item.title}</div>
                                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{item.type}</span>
                            </td>
                            <td className="p-4 text-slate-500">{item.location}</td>
                            <td className="p-4">
                                <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18}/></button>
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