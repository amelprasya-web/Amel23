import React, { useState } from 'react';
import { Product, SliceOption } from '../types/bakery';
import { formatRupiah } from '../services/paymentEngine';
import { X, Check, Clock, AlertCircle, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, sliceOption: SliceOption, notes: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSlice, setSelectedSlice] = useState<SliceOption>('utuh');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedSlice, notes);
    onClose();
  };

  const sliceOptionsList: { id: SliceOption; label: string; desc: string }[] = [
    {
      id: 'utuh',
      label: 'Utuh / Tanpa Potong',
      desc: 'Menjaga kelembapan remah roti lebih tahan lama (disarankan dipotong saat hendak dimakan)',
    },
    {
      id: 'standar_1.5cm',
      label: 'Potong Standar (1.5 cm)',
      desc: 'Ketebalan ideal untuk roti panggang harian, olesan mentega, atau selai',
    },
    {
      id: 'tipis_1cm',
      label: 'Potong Tipis (1.0 cm)',
      desc: 'Cocok untuk sandwich lapis deli atau canapé tipis renyah',
    },
    {
      id: 'tebal_2cm',
      label: 'Potong Tebal French Toast (2.0 cm)',
      desc: 'Potongan tebal bertekstur empuk, sangat nikmat untuk rendaman telur French Toast',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl border border-[#E8DFD4] shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close */}
        <button
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 border border-[#E8DFD4] text-[#5C5046] hover:bg-white transition-all cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image & Batch Info */}
          <div className="relative bg-[#F5EFE6] min-h-[260px] md:min-h-full">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/95 rounded-xl border border-[#E8DFD4] text-xs">
              <div className="flex items-center gap-1.5 text-[#C66526] font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{product.batchTime}</span>
              </div>
              {product.fermentationHours && (
                <p className="text-[#6B5E52] mt-0.5">
                  Waktu Fermentasi: {product.fermentationHours} Jam Ragi Liar
                </p>
              )}
            </div>
          </div>

          {/* Details & Controls */}
          <div className="p-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#C66526] mb-1">
                Informasi Artisan Baker
              </div>
              <h2 className="font-serif-bakery text-2xl font-bold text-[#2C241E] leading-tight">
                {product.name}
              </h2>
              <p className="text-xl font-bold text-[#2C241E] mt-2 tabular-nums">
                {formatRupiah(product.price)}
              </p>
              <p className="text-xs text-[#6B5E52] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Slicing preference if applicable */}
              {product.allowSliceOption && (
                <div className="mt-5 pt-4 border-t border-[#F0E8DC]">
                  <label className="block text-xs font-semibold text-[#2C241E] mb-2">
                    Pilihan Pemotongan Roti (Gratis):
                  </label>
                  <div className="space-y-2">
                    {sliceOptionsList.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedSlice === opt.id
                            ? 'border-[#C66526] bg-[#FDF7F2]'
                            : 'border-[#E8DFD4] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="sliceOption"
                          value={opt.id}
                          checked={selectedSlice === opt.id}
                          onChange={() => setSelectedSlice(opt.id)}
                          className="mt-0.5 text-[#C66526] focus:ring-[#C66526]"
                        />
                        <div>
                          <div className="font-medium text-[#2C241E]">{opt.label}</div>
                          <div className="text-[11px] text-[#7A6D60] leading-snug">{opt.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Ingredients & Allergens Accordion/Box */}
              <div className="mt-5 pt-4 border-t border-[#F0E8DC] space-y-2.5 text-xs">
                <div className="bg-[#FAF7F2] p-3 rounded-lg border border-[#E8DFD4]">
                  <div className="font-semibold text-[#2C241E] flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                    Komposisi Bahan Murni:
                  </div>
                  <p className="text-[#6B5E52] leading-relaxed">
                    {product.ingredients.join(' · ')}
                  </p>
                </div>

                <div className="flex items-start gap-1.5 text-[11px] text-[#8C7B6D]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Alergen: {product.allergens.join(', ')}</span>
                </div>
              </div>

              {/* Special Notes */}
              <div className="mt-4">
                <label htmlFor="baker-notes" className="block text-xs font-semibold text-[#2C241E] mb-1">
                  Catatan untuk Baker (Opsional):
                </label>
                <input
                  id="baker-notes"
                  type="text"
                  placeholder="Contoh: Tolong pisahkan bungkus atau minta pisau kayu..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#E8DFD4] bg-[#FAF7F2] focus:outline-none focus:border-[#C66526]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-[#F0E8DC] flex items-center gap-3">
              {/* Stepper */}
              <div className="flex items-center border border-[#E8DFD4] rounded-lg bg-[#FAF7F2]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Kurangi jumlah"
                  className="px-3 py-2 text-sm font-bold text-[#5C5046] hover:bg-[#EAE2D7] rounded-l-lg cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center text-xs font-semibold font-mono-receipt text-[#2C241E]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  aria-label="Tambah jumlah"
                  className="px-3 py-2 text-sm font-bold text-[#5C5046] hover:bg-[#EAE2D7] rounded-r-lg cursor-pointer"
                >
                  +
                </button>
              </div>

              {/* Add Button */}
              <button
                onClick={handleAdd}
                className="flex-grow inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#C66526] hover:bg-[#B3561B] text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Tambahkan ({formatRupiah(product.price * quantity)})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
