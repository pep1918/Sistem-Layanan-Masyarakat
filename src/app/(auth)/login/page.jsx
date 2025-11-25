"use client";
import { useState, useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/navigation';
import { ShieldCheck, User, Lock, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  // 1. LOGIC TAMBAHAN: Pastikan form bersih saat halaman baru dibuka
  useEffect(() => {
    setForm({ username: '', password: '' });
    setError('');
  }, []);

  // Mock Data User
  const users = [
    { username: 'pak_rw', password: 'rw123', name: 'Bapak RW 05', role: 'rw' },
    { username: 'rt01',   password: 'rt01',  name: 'Ketua RT 01',  role: 'rt' },
    { username: 'rt02',   password: 'rt02',  name: 'Ketua RT 02',  role: 'rt' },
    { username: 'rt03',   password: 'rt03',  name: 'Ketua RT 03',  role: 'rt' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = users.find(u => u.username === form.username && u.password === form.password);
      if (foundUser) {
        localStorage.setItem('user_session', JSON.stringify(foundUser));
        router.push('/dashboard'); 
      } else {
        setError('Username atau Password salah!');
        setLoading(false);
        // Opsional: Bersihkan password jika salah agar user mengetik ulang
        setForm(prev => ({ ...prev, password: '' }));
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px]"></div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-200 relative z-10">
        
        <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-800 transition">
            <ArrowLeft size={20} />
        </Link>

        <div className="text-center mb-8 mt-4">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl rotate-3 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-blue-200">
                <ShieldCheck size={32}/>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Login</h2>
            <p className="text-slate-500 text-sm mt-1"></p>
        </div>

        {/* 2. LOGIC TAMBAHAN: autoComplete="off" di form utama */}
        <form onSubmit={handleLogin} className="space-y-5" autoComplete="off">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm text-center font-bold border border-red-100 animate-pulse">{error}</div>}

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Username</label>
                <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        /* 3. LOGIC TAMBAHAN: name random atau autoComplete="off" */
                        name="username_field_random" 
                        autoComplete="off"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                        placeholder="Username"
                        value={form.username}
                        onChange={(e) => setForm({...form, username: e.target.value})}
                        required 
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="password" 
                        /* 4. LOGIC TAMBAHAN: new-password mencegah Chrome menimpa nilai */
                        name="password_field_random"
                        autoComplete="new-password"
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition font-medium"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({...form, password: e.target.value})}
                        required 
                    />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-xl hover:shadow-2xl hover:-translate-y-1 flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin"/> : 'Masuk'}
            </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 mb-2">?</p>
            <Link href="/" className="text-blue-600 font-bold hover:underline text-sm">
                Kembali 
            </Link>
        </div>
      </div>
    </div>
  );
}