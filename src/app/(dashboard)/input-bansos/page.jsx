"use client";
import { useState } from 'react';
import { Briefcase, Save, User, DollarSign, Users } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

export default function InputPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: '', nik: '', alamat_rt: '01', 
    penghasilan: '', tanggungan: '',
    nama_pekerjaan: '', status_pekerjaan: '1'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/warga', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (res.ok) {
      alert('Data tersimpan!');
      router.push('/dashboard');
    } else {
      alert('Gagal menyimpan data.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* HEADER PAGE */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Input Data Warga</h1>
        <p className="text-slate-500 mt-2">Pastikan data yang dimasukkan sesuai dengan KTP & KK terbaru.</p>
      </div>
      
      <div className="bg-white p-8 lg:p-10 rounded-3xl shadow-xl border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: IDENTITAS */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><User size={20}/></div> Identitas Diri
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Nama Lengkap" placeholder="Sesuai KTP" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
                <InputGroup label="Nomor Induk Kependudukan (NIK)" placeholder="16 Digit Angka" value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} />
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Alamat RT</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition bg-slate-50/50"
                        onChange={(e) => setFormData({...formData, alamat_rt: e.target.value})}>
                        <option value="01">RT 01 - RW 05</option>
                        <option value="02">RT 02 - RW 05</option>
                        <option value="03">RT 03 - RW 05</option>
                    </select>
                </div>
            </div>
          </div>

          {/* SECTION 2: EKONOMI */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600"><DollarSign size={20}/></div> Ekonomi & Keluarga
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Penghasilan Bulanan (Rp)" placeholder="Contoh: 1500000" type="number" value={formData.penghasilan} onChange={e => setFormData({...formData, penghasilan: e.target.value})} />
                <InputGroup label="Jumlah Tanggungan" placeholder="Jumlah orang dalam KK" type="number" value={formData.tanggungan} onChange={e => setFormData({...formData, tanggungan: e.target.value})} />
            </div>
          </div>

          {/* SECTION 3: PEKERJAAN */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Briefcase size={20}/></div> Pekerjaan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Nama Pekerjaan (Spesifik)" placeholder="Contoh: Buruh Cuci" value={formData.nama_pekerjaan} onChange={e => setFormData({...formData, nama_pekerjaan: e.target.value})} />
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Golongan Pekerjaan (Untuk Sistem)</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition bg-slate-50/50"
                        onChange={(e) => setFormData({...formData, status_pekerjaan: e.target.value})}>
                        <option value="1">Gol 1 - PNS / Tetap (Skor Rendah)</option>
                        <option value="2">Gol 2 - Kontrak / Swasta</option>
                        <option value="3">Gol 3 - Buruh / Serabutan</option>
                        <option value="4">Gol 4 - Pengangguran (Skor Tinggi)</option>
                    </select>
                </div>
            </div>
          </div>

          <div className="pt-6">
            <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex justify-center items-center gap-2">
               {loading ? 'Menyimpan...' : <><Save size={20}/> Simpan Data Warga</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const InputGroup = ({ label, type="text", placeholder, value, onChange }) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
        <input 
            type={type} 
            required 
            placeholder={placeholder}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition bg-slate-50/50" 
            onChange={onChange}
            value={value}
        />
    </div>
);