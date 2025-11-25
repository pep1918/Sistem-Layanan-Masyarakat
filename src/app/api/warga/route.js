import { NextResponse } from 'next/server';

// PERBAIKAN: Gunakan jalur titik-titik (../../../) agar pasti ketemu
import dbConnect from '../../../lib/db';
import Warga from '../../../models/Warga';
import { cekKelayakanBansos } from '../../../lib/utils';

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Logika Server-side
    const analisa = cekKelayakanBansos(body.penghasilan);
    
    const newWarga = new Warga({
      ...body,
      status_kelayakan: analisa.status,
      // Jika tidak layak, langsung REJECTED agar tidak perlu diverifikasi RW
      status_approval: analisa.status === 'TIDAK_LAYAK' ? 'REJECTED' : 'PENDING_RW'
    });

    await newWarga.save();
    return NextResponse.json({ success: true, data: newWarga }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function GET() {
    await dbConnect();
    try {
        const data = await Warga.find({}).sort({ tanggal_input: -1 });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}