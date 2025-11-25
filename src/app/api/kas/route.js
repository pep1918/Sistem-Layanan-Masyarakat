import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import KasRT from '../../../models/KasRT';

// GET: Ambil Data
export async function GET() {
    await dbConnect();
    try {
        const data = await KasRT.find({}).sort({ tanggal: -1 });
        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}

// POST: Tambah Data
export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const newKas = new KasRT(body);
    await newKas.save();
    return NextResponse.json({ success: true, data: newKas });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// === FITUR BARU: DELETE ===
export async function DELETE(request) {
    await dbConnect();
    try {
        // Ambil ID dari alamat URL (contoh: /api/kas?id=12345)
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ success: false, message: "ID tidak ditemukan" }, { status: 400 });
        }

        // Hapus dari database
        await KasRT.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Data berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}