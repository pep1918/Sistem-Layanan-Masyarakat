import { NextResponse } from 'next/server';
// Gunakan jalur manual (../../../) agar aman
import dbConnect from '../../../lib/db';
import Warga from '../../../models/Warga';
import { hitungSAW } from '../../../lib/saw';

export async function POST() {
  await dbConnect();
  try {
    // 1. Ambil Data
    const allWarga = await Warga.find({});
    if (allWarga.length === 0) return NextResponse.json({ message: "Data kosong" }, { status: 400 });

    // 2. Hitung
    const rankedData = hitungSAW(allWarga);

    // 3. Simpan Hasil ke Database
    const updates = rankedData.map(async (item) => {
        // Logika Kelayakan: Skor >= 0.5 dianggap LAYAK
        const statusBaru = parseFloat(item.skor_saw) >= 0.5000 ? 'LAYAK' : 'TIDAK_LAYAK';
        
        return Warga.findByIdAndUpdate(item._id, {
            skor_saw: item.skor_saw,
            status_kelayakan: statusBaru
        });
    });

    await Promise.all(updates);
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}