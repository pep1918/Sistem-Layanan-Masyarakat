import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';
import KasRT from '../../../models/KasRT';
import Penyaluran from '../../../models/Penyaluran';
import Agenda from '../../../models/Agenda'; 

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    // 1. DETAIL POPUP: AGENDA (TAMPILKAN SEMUA TANPA FILTER TANGGAL)
    if (type === 'agenda') {
      const data = await Agenda.find().sort({ date: 1 }); // Menampilkan semua, urut tanggal
      return NextResponse.json({ success: true, data });
    }

    // 2. DETAIL POPUP: KAS
    if (type === 'kas') {
      const data = await KasRT.find().sort({ tanggal: -1 }).limit(10);
      return NextResponse.json({ success: true, data });
    }

    // 3. DETAIL POPUP: BANSOS
    if (type === 'penyaluran') {
      const data = await Penyaluran.find().sort({ tanggal_salur: -1 });
      return NextResponse.json({ success: true, data });
    }

    // 4. STATS UTAMA (DASHBOARD)
    const kasMasuk = await KasRT.aggregate([{ $match: { tipe: 'MASUK' } }, { $group: { _id: null, total: { $sum: "$nominal" } } }]);
    const kasKeluar = await KasRT.aggregate([{ $match: { tipe: 'KELUAR' } }, { $group: { _id: null, total: { $sum: "$nominal" } } }]);
    const saldo = (kasMasuk[0]?.total || 0) - (kasKeluar[0]?.total || 0);
    
    const bansos = await Penyaluran.aggregate([{ $group: { _id: null, total: { $sum: "$nominal" } } }]);
    const penerima = await Penyaluran.countDocuments();
    
    // Hitung Agenda (Semua Agenda)
    const agendaCount = await Agenda.countDocuments();

    return NextResponse.json({ 
      success: true, 
      kas_rt: saldo, 
      dana_bansos: bansos[0]?.total || 0,
      total_penerima: penerima,
      total_agenda: agendaCount 
    });

  } catch (error) {
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    
    const t = body.isi_laporan.toLowerCase();
    let kategori = 'LAINNYA';
    let urgensi = 'RENDAH';

    if (t.includes('jalan') || t.includes('lampu') || t.includes('rusak')) kategori = 'INFRASTRUKTUR';
    else if (t.includes('maling') || t.includes('aman')) kategori = 'KEAMANAN';
    else if (t.includes('bansos') || t.includes('miskin')) kategori = 'SOSIAL';
    if (t.includes('segera') || t.includes('bahaya')) urgensi = 'TINGGI';

    const aduanBaru = new Pengaduan({ ...body, kategori, urgensi });
    await aduanBaru.save();
    
    return NextResponse.json({ success: true, message: "Laporan berhasil dikirim!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}