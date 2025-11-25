import mongoose from 'mongoose';

const PengaduanSchema = new mongoose.Schema({
  nama_pelapor: { type: String, default: 'Anonim' },
  rt_tujuan: { type: String, required: true },
  isi_laporan: { type: String, required: true },
  
  // --- HASIL ANALISIS AI ---
  kategori: { 
    type: String, 
    enum: ['INFRASTRUKTUR', 'KEAMANAN', 'SOSIAL', 'ADMINISTRASI', 'LAINNYA'],
    default: 'LAINNYA' 
  },
  urgensi: { 
    type: String, 
    enum: ['TINGGI', 'SEDANG', 'RENDAH'], 
    default: 'RENDAH' 
  },
  // -------------------------

  status: { type: String, enum: ['DITERIMA', 'DIPROSES', 'SELESAI'], default: 'DITERIMA' },
  tanggal: { type: Date, default: Date.now }
});

export default mongoose.models.Pengaduan || mongoose.model('Pengaduan', PengaduanSchema);