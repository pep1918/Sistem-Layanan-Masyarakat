import mongoose from 'mongoose';

const AgendaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Nama acara wajib diisi'],
  },
  date: {
    type: Date,
    required: [true, 'Tanggal acara wajib diisi'],
  },
  time: {
    type: String,
    required: [true, 'Waktu acara wajib diisi'],
  },
  location: {
    type: String,
    required: [true, 'Lokasi acara wajib diisi'],
  },
  type: {
    type: String,
    default: 'Rapat', // Default kategori
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Cek apakah model sudah ada (untuk mencegah overwrite saat hot-reload Next.js)
export default mongoose.models.Agenda || mongoose.model('Agenda', AgendaSchema);