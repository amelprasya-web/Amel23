import React from 'react';
import { QrCode, MapPin, Clock, Phone, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#241C16] text-[#D8C7B5] pt-14 pb-12 border-t border-[#3B2F25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#3B2F25]">
          {/* Col 1: Brand & Craft */}
          <div className="md:col-span-1 space-y-3">
            <h3 className="font-serif-bakery text-2xl font-bold text-white tracking-tight">
              Aroma Karsa
            </h3>
            <p className="text-xs text-[#BFA791] leading-relaxed">
              Boulangerie & Patisserie Pengrajin. Menyajikan roti ragi alami starter 12 tahun dan pastry mentega murni panggang segar setiap hari.
            </p>
            <div className="pt-1 text-[11px] text-[#A68F7A]">
              Sertifikasi Halal ID3111000188920
            </div>
          </div>

          {/* Col 2: Jam Operasional & Oven */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-2">
              Waktu Operasional Toko
            </div>
            <div className="flex items-start gap-2 text-[#BFA791]">
              <Clock className="w-3.5 h-3.5 mt-0.5 text-[#C66526] shrink-0" />
              <div>
                <p className="font-medium text-white">Senin — Minggu</p>
                <p>06.30 — 21.00 WIB</p>
                <p className="text-[10px] text-[#8C7560] mt-1">
                  *Batch roti pertama keluar oven pukul 06.30 WIB
                </p>
              </div>
            </div>
          </div>

          {/* Col 3: Lokasi & Kontak */}
          <div className="space-y-2 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-2">
              Lokasi Outlet Dapur
            </div>
            <div className="flex items-start gap-2 text-[#BFA791]">
              <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#C66526] shrink-0" />
              <div>
                <p className="font-medium text-white">Aroma Karsa Senopati</p>
                <p>Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan 12160</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[#BFA791] pt-1">
              <Phone className="w-3.5 h-3.5 text-[#C66526] shrink-0" />
              <span>(021) 720-9988 / 0812-9988-2211</span>
            </div>
          </div>

          {/* Col 4: Pembayaran Digital Terakreditasi */}
          <div className="space-y-3 text-xs">
            <div className="font-semibold text-white uppercase tracking-wider text-[11px] mb-2">
              Sistem Pembayaran Kasir
            </div>
            <p className="text-[#BFA791] text-xs leading-relaxed">
              Mendukung transaksi cepat tanpa kontak via QRIS Bank Indonesia, GoPay, OVO, DANA, ShopeePay, dan Barcode Scanner.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#E5D7C8]">
              <span className="px-2 py-0.5 rounded bg-[#382B21] border border-[#4D3C2E]">QRIS</span>
              <span className="px-2 py-0.5 rounded bg-[#382B21] border border-[#4D3C2E]">GoPay</span>
              <span className="px-2 py-0.5 rounded bg-[#382B21] border border-[#4D3C2E]">OVO</span>
              <span className="px-2 py-0.5 rounded bg-[#382B21] border border-[#4D3C2E]">DANA</span>
              <span className="px-2 py-0.5 rounded bg-[#382B21] border border-[#4D3C2E]">ShopeePay</span>
            </div>
          </div>
        </div>

        {/* Quiet Sub-footer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8C7560] gap-3">
          <p>© {new Date().getFullYear()} Aroma Karsa Boulangerie & Patisserie. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-1">
            <span>Dibuat dengan cinta untuk penikmat roti pengrajin sejati</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
