import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
// PERBAIKAN DI SINI: Ubah 'Pengaduan' menjadi 'Agenda'
import Agenda from '../../../models/Agenda'; 

// GET: Ambil semua agenda (untuk admin list)
export async function GET() {
  await dbConnect();
  try {
    const agendas = await Agenda.find().sort({ date: 1 });
    return NextResponse.json({ success: true, data: agendas });
  } catch (error) {
    console.error("Error GET Agenda:", error); // Tambahkan log agar mudah debug
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Tambah agenda baru
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newAgenda = await Agenda.create(body);
    return NextResponse.json({ success: true, data: newAgenda });
  } catch (error) {
    console.error("Error POST Agenda:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Hapus agenda
export async function DELETE(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) throw new Error("ID tidak ditemukan");

    await Agenda.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}