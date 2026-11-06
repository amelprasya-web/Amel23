import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenOrders,
  onNavigateSection,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif-bakery text-2xl font-bold tracking-tight text-[#2C241E] hover:text-[#C66526] transition-colors whitespace-nowrap shrink-0"
        >
          Aroma Karsa
        </a>

        {/* Zone 2: 4 clean single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5E52]">
          <button
            onClick={() => onNavigateSection('koleksi-roti')}
            className="hover:text-[#2C241E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Koleksi Roti
          </button>
          <button
            onClick={() => onNavigateSection('jadwal-oven')}
            className="hover:text-[#2C241E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Jadwal Oven
          </button>
          <button
            onClick={() => onNavigateSection('cerita-baker')}
            className="hover:text-[#2C241E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Tentang Kami
          </button>
          <button
            onClick={onOpenOrders}
            className="hover:text-[#2C241E] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-[#C66526]" />
            Riwayat Pesanan
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCart}
            aria-label={`Keranjang Belanja (${cartCount} item)`}
            className="relative inline-flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-white bg-[#C66526] hover:bg-[#B3561B] active:scale-[0.98] rounded-xl transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Keranjang</span>
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-mono-receipt font-bold bg-[#FAF7F2] text-[#C66526] rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
