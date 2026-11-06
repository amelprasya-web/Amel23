import React from 'react';
import { ArrowDown, Flame, Sparkles, QrCode } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 lg:py-16 border-b border-[#E8DFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Editorial Headline & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean unboxed metadata separator */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#C66526] mb-4">
              <span>Boulangerie & Patisserie Pengrajin</span>
              <span aria-hidden="true">·</span>
              <span>Jakarta Selatan</span>
              <span aria-hidden="true">·</span>
              <span>Est. 2018</span>
            </div>

            <h1 className="font-serif-bakery text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2C241E] leading-[1.12] mb-6 text-balance">
              Roti ragi alami & pastry renyah, hangat langsung dari oven batu.
            </h1>

            <p className="text-base sm:text-lg text-[#6B5E52] leading-relaxed mb-8 max-w-xl">
              Kami memfermentasi adonan lambat selama 36 jam menggunakan starter sourdough warisan keluarga dan mentega Prancis AOP tanpa bahan pengawet. Nikmati kemudahan pesan langsung dengan pembayaran instan QRIS dan semua e-wallet.
            </p>

            {/* CTAs & Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExplore}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#C66526] hover:bg-[#B3561B] rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <span>Pesan Roti Segar</span>
                <ArrowDown className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-3 bg-[#F3ECE2] border border-[#E8DFD4] rounded-xl text-xs font-medium text-[#5C5046]">
                <QrCode className="w-4 h-4 text-[#C66526]" />
                <span>Bayar Instan QRIS, GoPay, OVO, DANA</span>
              </div>
            </div>

            {/* Clean Proof Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8DFD4] max-w-lg">
              <div>
                <p className="text-2xl font-bold font-serif-bakery text-[#2C241E] tabular-nums">36 Jam</p>
                <p className="text-xs text-[#7A6D60] mt-0.5">Fermentasi lambat ragi</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif-bakery text-[#2C241E] tabular-nums">100%</p>
                <p className="text-xs text-[#7A6D60] mt-0.5">Mentega AOP murni</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif-bakery text-[#2C241E] tabular-nums">06.30</p>
                <p className="text-xs text-[#7A6D60] mt-0.5">Batch pagi pertama</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="w-full relative rounded-2xl overflow-hidden border border-[#E8DFD4] shadow-md bg-[#F3ECE2] aspect-[4/3] lg:aspect-auto lg:h-[460px]">
              <img
                src="/src/assets/images/bakery_hero_artisanal_1793935182916.jpg"
                alt="Display etalase toko roti artisanal Aroma Karsa"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
              
              {/* Overlay note on card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-sm border border-[#E8DFD4] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#C66526] flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5" />
                      Status Dapur Saat Ini
                    </p>
                    <p className="text-sm font-bold text-[#2C241E] mt-0.5">
                      Batch Pagi Masih Hangat
                    </p>
                  </div>
                  <span className="text-xs font-mono-receipt font-semibold text-[#6B5E52] bg-[#FAF7F2] px-2.5 py-1 rounded border border-[#E8DFD4]">
                    Stok Tersedia
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
