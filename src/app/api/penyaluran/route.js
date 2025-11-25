import { NextResponse } from 'next/server';

// Gunakan jalur manual (../../../)
import dbConnect from '../../../lib/db'; 
import Penyaluran from '../../../models/Penyaluran'; 
import Warga from '../../../models/Warga'; // <--- KITA IMPORT MODEL WARGA JUGA

// GET: Ambil semua riwayat untuk ditampilkan di tabel riwayat
export async function GET() {
  await dbConnect();
  try {
    const data = await Penyaluran.find({}).sort({ tanggal_salur: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Catat penyaluran DAN Hapus Warga
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();

    // ---------------------------------------------------------
    // LANGKAH 1: SIMPAN KE RIWAYAT (ARSIP ABADI)
    // ---------------------------------------------------------
    const record = new Penyaluran(body);
    await record.save();

    // ---------------------------------------------------------
    // LANGKAH 2: HAPUS DARI DATA MASTER WARGA (AUTO DELETE)
    // ---------------------------------------------------------
    // Kita cari warga berdasarkan NIK yang dikirim, lalu hapus.
    const deleted = await Warga.findOneAndDelete({ nik: body.nik_penerima });

    if (!deleted) {
        // Opsional: Jika NIK tidak ketemu di database Warga (misal data manual)
        console.log("Warga tidak ditemukan di database master, tapi riwayat tetap tersimpan.");
    }

    return NextResponse.json({ 
        success: true, 
        message: "Bantuan berhasil disalurkan. Data warga telah dihapus dari daftar antrian." 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}