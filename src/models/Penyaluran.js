import mongoose from 'mongoose';

const PenyaluranSchema = new mongoose.Schema({
  nama_penerima: { type: String, required: true },
  nik_penerima: { type: String, required: true },
  alamat_rt: { type: String, required: true },
  jenis_bantuan: { type: String, required: true }, 
  nominal: { type: Number, required: true },
  petugas: { type: String, default: 'Admin Desa' },
  tanggal_salur: { type: Date, default: Date.now },
  keterangan: { type: String }
}, { timestamps: true });

export default mongoose.models.Penyaluran || mongoose.model('Penyaluran', PenyaluranSchema);