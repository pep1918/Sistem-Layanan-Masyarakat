import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db'; 
import Warga from '../../../models/Warga';
import KasRT from '../../../models/KasRT';
import Pengaduan from '../../../models/Pengaduan';

export async function GET() {
  await dbConnect();
  try {
    // 1. Statistik Kartu Utama
    const totalWarga = await Warga.countDocuments();
    const layak = await Warga.countDocuments({ status_kelayakan: 'LAYAK' });
    const pending = await Warga.countDocuments({ status_approval: 'PENDING_RW' });

    const allKas = await KasRT.find({});
    const totalKas = allKas.reduce((acc, curr) => 
        curr.tipe === 'MASUK' ? acc + curr.nominal : acc - curr.nominal, 0
    );

    const aduanBaru = await Pengaduan.countDocuments({ status: 'DITERIMA' });

    const chartData = await Warga.aggregate([
        {
            $group: {
                _id: "$alamat_rt", // Group by RT
                total: { $sum: 1 }, // Hitung Total
                layak: { 
                    $sum: { $cond: [{ $eq: ["$status_kelayakan", "LAYAK"] }, 1, 0] } 
                } // Hitung yg Layak saja
            }
        },
        { $sort: { _id: 1 } } // Urutkan RT 01, 02, dst
    ]);

    // Format ulang data agar sesuai dengan Recharts
    const formattedChart = chartData.map(item => ({
        name: `RT ${item._id}`,
        total: item.total,
        layak: item.layak
    }));

    return NextResponse.json({
        total: totalWarga,
        layak: layak,
        pending: pending,
        kas: totalKas,
        aduan: aduanBaru,
        chart: formattedChart // Data grafik dikirim ke frontend
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}