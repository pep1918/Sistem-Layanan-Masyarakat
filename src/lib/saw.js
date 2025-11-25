export function hitungSAW(dataWarga) {
    if (!dataWarga || dataWarga.length === 0) return [];

    // 1. Tentukan Bobot (Total = 1.0)
    const W = { 
        c1: 0.50, // Penghasilan (50%)
        c2: 0.30, // Tanggungan (30%)
        c3: 0.20  // Pekerjaan (20%)
    };

    // 2. Cari Nilai Min/Max (Normalisasi)
    // Pastikan nilai dikonversi ke Angka (parseFloat) agar tidak error
    const penghasilanVals = dataWarga.map(w => parseFloat(w.penghasilan) || 0);
    const tanggunganVals = dataWarga.map(w => parseFloat(w.tanggungan) || 0);
    const kerjaVals = dataWarga.map(w => parseFloat(w.status_pekerjaan) || 0);

    // Hindari pembagian dengan nol (Infinity)
    const minC1 = Math.min(...penghasilanVals) || 1; 
    const maxC2 = Math.max(...tanggunganVals) || 1;
    const maxC3 = Math.max(...kerjaVals) || 1;

    // 3. Hitung Skor Per Baris
    const hasilRanking = dataWarga.map(w => {
        const v1 = parseFloat(w.penghasilan) || 0;
        const v2 = parseFloat(w.tanggungan) || 0;
        const v3 = parseFloat(w.status_pekerjaan) || 0;

        // Rumus Normalisasi
        const R1 = minC1 / (v1 === 0 ? 1 : v1); // Cost (Min / Nilai)
        const R2 = v2 / maxC2;                  // Benefit (Nilai / Max)
        const R3 = v3 / maxC3;                  // Benefit (Nilai / Max)

        // Rumus Bobot (SAW)
        const skor = (R1 * W.c1) + (R2 * W.c2) + (R3 * W.c3);

        return {
            ...w._doc, // Copy data asli
            skor_saw: skor.toFixed(4) // Simpan 4 digit desimal
        };
    });

    // 4. Urutkan dari Skor Tertinggi
    return hasilRanking.sort((a, b) => b.skor_saw - a.skor_saw);
}