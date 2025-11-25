import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Fungsi Format Rupiah (Rp 1.000.000)
export const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(number);
};


export const cekKelayakanBansos = (gaji) => {
  const BATAS_GAJI = 3000000;
  
  if (gaji > BATAS_GAJI) {
    return {
      status: 'TIDAK_LAYAK',
      label: 'DITOLAK SISTEM',
      message: 'Penghasilan melebihi batas ketentuan (Rp 3.000.000).',
      color: 'bg-red-100 text-red-700 border-red-300'
    };
  } else {
    return {
      status: 'LAYAK',
      label: 'BERHAK BANSOS',
      message: 'Penghasilan memenuhi kriteria penerima bantuan.',
      color: 'bg-green-100 text-green-700 border-green-300'
    };
  }
};