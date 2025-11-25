import mongoose from 'mongoose';

const KasRTSchema = new mongoose.Schema({
  keterangan: { type: String, required: true },
  tipe: { type: String, enum: ['MASUK', 'KELUAR'], required: true },
  nominal: { type: Number, required: true },
  tanggal: { type: Date, default: Date.now },
  petugas: { type: String, default: 'Ketua RT' }
});

export default mongoose.models.KasRT || mongoose.model('KasRT', KasRTSchema);