import mongoose from 'mongoose';

const WargaSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  nik: { type: String, required: true, unique: true },
  alamat_rt: { type: String, required: true },
  
  penghasilan: { type: Number, required: true }, 
  tanggungan: { type: Number, required: true }, 
  
  // PERUBAHAN:
  // 1. nama_pekerjaan: Untuk teks bebas (misal: Tukang Cilok)
  nama_pekerjaan: { type: String, default: '-' },
  // 2. status_pekerjaan: Untuk Angka SKOR SAW (1-4)
  status_pekerjaan: { type: Number, required: true },

  skor_saw: { type: Number, default: 0 },
  status_kelayakan: { type: String, default: 'DIPERTIMBANGKAN' },
  status_approval: { type: String, default: 'PENDING_RW' },
  tanggal_input: { type: Date, default: Date.now }
});

export default mongoose.models.Warga || mongoose.model('Warga', WargaSchema);