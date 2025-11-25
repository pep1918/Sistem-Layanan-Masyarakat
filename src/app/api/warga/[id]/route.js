import { NextResponse } from 'next/server';

// ============================================================
// PERBAIKAN JALUR IMPORT (MANUAL 4 TINGKAT):
// Dari: src/app/api/warga/[id]
// Ke:   src/lib/db.js
// ============================================================
import dbConnect from '../../../../lib/db';
import Warga from '../../../../models/Warga';

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const warga = await Warga.findById(id);

    if (!warga) {
      return NextResponse.json({ success: false, message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: warga });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}