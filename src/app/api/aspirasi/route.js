import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Pengaduan from '../../../models/Pengaduan';

export async function GET() {
  await dbConnect();
  const data = await Pengaduan.find({}).sort({ tanggal: -1 });
  // Hitung statistik per kategori
  const stats = {
    infrastruktur: data.filter(d => d.kategori === 'INFRASTRUKTUR').length,
    keamanan: data.filter(d => d.kategori === 'KEAMANAN').length,
    sosial: data.filter(d => d.kategori === 'SOSIAL').length,
    urgensi_tinggi: data.filter(d => d.urgensi === 'TINGGI').length
  };
  return NextResponse.json({ success: true, data, stats });
}

// FITUR DELETE
export async function DELETE(request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        await Pengaduan.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}