import React, { useState } from 'react';
import { Product } from '../types/bakery';
import { formatRupiah } from '../services/paymentEngine';
import { Plus, Check, Clock, UtensilsCrossed } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickAdd,
}) => {
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'sourdough':
        return 'Sourdough Alami';
      case 'pastry':
        return 'Laminated Pastry';
      case 'sweet_savory':
        return 'Roti Lembut';
      case 'beverage':
        return 'Minuman Seduh';
      default:
        return 'Spesial Baker';
    }
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group flex flex-col bg-white rounded-2xl border border-[#E8DFD4] overflow-hidden hover:border-[#D1BFA9] hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative w-full aspect-[4/3] bg-[#F5EFE6] overflow-hidden">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-[#8C7B6D] bg-[#F5EFE6]">
            <UtensilsCrossed className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs font-serif-bakery">{product.name}</span>
          </div>
        )}

        {/* Subtle 1-line tag if applicable (no pills, quiet banner tag) */}
        {product.isPopular && (
          <div className="absolute top-3 left-3 bg-[#2C241E]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
            Favorit Pelanggan
          </div>
        )}
        {!product.isPopular && product.isNewBatch && (
          <div className="absolute top-3 left-3 bg-[#C66526]/90 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
            Batch Baru
          </div>
        )}

        {/* Stock status indicator */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs text-[11px] font-medium text-[#5C5046] px-2 py-0.5 rounded border border-[#E8DFD4] flex items-center gap-1">
          <Clock className="w-3 h-3 text-[#C66526]" />
          <span>Sisa {product.stock} porsi</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#968372] mb-1">
            {getCategoryLabel(product.category)}
          </div>

          <h3 className="font-serif-bakery text-lg font-bold text-[#2C241E] group-hover:text-[#C66526] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-[#6B5E52] line-clamp-2 mt-1.5 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action Strip */}
        <div className="mt-4 pt-3.5 border-t border-[#F0E8DC] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#8C7B6D]">Harga</div>
            <div className="text-base font-bold text-[#2C241E] tabular-nums font-sans-bakery">
              {formatRupiah(product.price)}
            </div>
          </div>

          <button
            onClick={handleQuickAddClick}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#F3ECE2] text-[#2C241E] hover:bg-[#C66526] hover:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{product.allowSliceOption ? 'Pilih Potong' : 'Tambah'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
