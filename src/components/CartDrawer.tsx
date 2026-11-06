import React, { useState } from 'react';
import { CartItem, OrderType } from '../types/bakery';
import { formatRupiah } from '../services/paymentEngine';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Check, Gift } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (orderData: {
    orderType: OrderType;
    packagingOption: 'kraft' | 'gift_box';
    discountCode: string;
    discountAmount: number;
    subtotal: number;
    tax: number;
    packagingFee: number;
    total: number;
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const [orderType, setOrderType] = useState<OrderType>('takeaway');
  const [packagingOption, setPackagingOption] = useState<'kraft' | 'gift_box'>('kraft');
  const [voucherInput, setVoucherInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; percent: number } | null>(null);
  const [voucherError, setVoucherError] = useState('');

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const packagingFee = packagingOption === 'gift_box' ? 8000 : 0;
  const discountAmount = appliedVoucher ? Math.round((subtotal * appliedVoucher.percent) / 100) : 0;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableAmount * 0.11); // PPN 11%
  const total = taxableAmount + tax + packagingFee;

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    const cleanCode = voucherInput.trim().toUpperCase();

    if (cleanCode === 'ROTIBARU') {
      setAppliedVoucher({ code: 'ROTIBARU', percent: 10 });
      setVoucherInput('');
    } else if (cleanCode === 'AROMAPASTISI') {
      setAppliedVoucher({ code: 'AROMAPASTISI', percent: 15 });
      setVoucherInput('');
    } else if (cleanCode) {
      setVoucherError('Kode voucher tidak ditemukan atau sudah kedaluwarsa.');
    }
  };

  const handleCheckoutClick = () => {
    onProceedToCheckout({
      orderType,
      packagingOption,
      discountCode: appliedVoucher?.code || '',
      discountAmount,
      subtotal,
      tax,
      packagingFee,
      total,
    });
  };

  const getSliceLabel = (opt: string) => {
    switch (opt) {
      case 'standar_1.5cm':
        return 'Potong Standar 1.5 cm';
      case 'tipis_1cm':
        return 'Potong Tipis 1.0 cm';
      case 'tebal_2cm':
        return 'Potong Tebal 2.0 cm';
      case 'utuh':
      default:
        return 'Utuh (Tanpa Potong)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-l border-[#E8DFD4] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-white border-b border-[#E8DFD4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C66526]" />
            <h2 className="font-serif-bakery text-xl font-bold text-[#2C241E]">
              Keranjang Belanja
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup keranjang"
            className="w-8 h-8 rounded-full border border-[#E8DFD4] flex items-center justify-center text-[#6B5E52] hover:bg-[#FAF7F2] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        {items.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F3ECE2] flex items-center justify-center text-[#8C7B6D] mb-4">
              <ShoppingBag className="w-8 h-8 opacity-60" />
            </div>
            <p className="font-serif-bakery text-lg font-bold text-[#2C241E]">
              Keranjang Masih Kosong
            </p>
            <p className="text-xs text-[#6B5E52] mt-1 mb-6 max-w-xs">
              Pilih roti ragi alami atau pastry hangat favorit Anda dari etalase untuk memesan.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#C66526] text-white text-xs font-semibold rounded-xl hover:bg-[#B3561B] cursor-pointer"
            >
              Mulai Belanja Roti
            </button>
          </div>
        ) : (
          <div className="flex-grow overflow-y-auto p-5 space-y-4">
            {/* Order Type Toggle */}
            <div className="bg-white p-2.5 rounded-xl border border-[#E8DFD4]">
              <div className="text-[11px] font-semibold text-[#8C7B6D] uppercase mb-1.5">
                Jenis Pesanan:
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(['takeaway', 'dine_in', 'delivery'] as OrderType[]).map((type) => {
                  const labels = {
                    takeaway: 'Bawa Pulang',
                    dine_in: 'Makan di Sini',
                    delivery: 'Kirim Kurir',
                  };
                  return (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                        orderType === type
                          ? 'bg-[#2C241E] text-white shadow-xs'
                          : 'bg-[#F3ECE2] text-[#5C5046] hover:bg-[#EAE2D7]'
                      }`}
                    >
                      {labels[type]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E8DFD4] shadow-xs flex gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-[#F5EFE6] shrink-0"
                  />
                  <div className="flex-grow flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif-bakery text-sm font-bold text-[#2C241E] truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Hapus ${item.product.name}`}
                          className="text-[#9C8F83] hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.product.allowSliceOption && (
                        <div className="text-[11px] text-[#C66526] font-medium mt-0.5">
                          {getSliceLabel(item.sliceOption)}
                        </div>
                      )}

                      {item.notes && (
                        <div className="text-[10px] text-[#7A6D60] italic mt-0.5 line-clamp-1">
                          Catatan: {item.notes}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F5EFE6]">
                      <span className="text-xs font-bold font-mono-receipt text-[#2C241E] tabular-nums">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>

                      <div className="flex items-center border border-[#E8DFD4] rounded bg-[#FAF7F2] text-xs">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-[#5C5046] hover:bg-[#EAE2D7] cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-6 text-center font-mono-receipt font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-[#5C5046] hover:bg-[#EAE2D7] cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Packaging Option */}
            <div className="bg-white p-3 rounded-xl border border-[#E8DFD4]">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#2C241E] mb-2">
                <Gift className="w-3.5 h-3.5 text-[#C66526]" />
                <span>Pilihan Kemasan Roti:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <label
                  className={`p-2 rounded-lg border cursor-pointer flex flex-col justify-between ${
                    packagingOption === 'kraft'
                      ? 'border-[#C66526] bg-[#FDF7F2]'
                      : 'border-[#E8DFD4] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="packaging"
                      checked={packagingOption === 'kraft'}
                      onChange={() => setPackagingOption('kraft')}
                      className="text-[#C66526]"
                    />
                    <span className="font-medium text-[#2C241E]">Kantong Kraft</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold mt-1">Gratis</span>
                </label>

                <label
                  className={`p-2 rounded-lg border cursor-pointer flex flex-col justify-between ${
                    packagingOption === 'gift_box'
                      ? 'border-[#C66526] bg-[#FDF7F2]'
                      : 'border-[#E8DFD4] bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="packaging"
                      checked={packagingOption === 'gift_box'}
                      onChange={() => setPackagingOption('gift_box')}
                      className="text-[#C66526]"
                    />
                    <span className="font-medium text-[#2C241E]">Hard Box Kado</span>
                  </div>
                  <span className="text-[10px] text-[#C66526] font-semibold mt-1">+Rp 8.000</span>
                </label>
              </div>
            </div>

            {/* Voucher Code Form */}
            <div className="bg-white p-3 rounded-xl border border-[#E8DFD4]">
              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <div className="relative flex-grow">
                  <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8C7B6D]" />
                  <input
                    type="text"
                    placeholder="Kode promo (coba: ROTIBARU)"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="w-full text-xs pl-8 pr-2 py-1.5 rounded-lg border border-[#E8DFD4] bg-[#FAF7F2] uppercase font-mono-receipt"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-[#2C241E] text-white rounded-lg hover:bg-black cursor-pointer shrink-0"
                >
                  Terapkan
                </button>
              </form>

              {appliedVoucher && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded mt-2 border border-emerald-200">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Voucher <strong>{appliedVoucher.code}</strong> aktif (-{appliedVoucher.percent}%)
                  </span>
                  <button
                    onClick={() => setAppliedVoucher(null)}
                    className="text-xs text-emerald-900 underline font-medium cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              )}

              {voucherError && (
                <div className="text-[11px] text-rose-600 mt-1.5">{voucherError}</div>
              )}
            </div>
          </div>
        )}

        {/* Drawer Footer with Price Summary & Checkout Action */}
        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-[#E8DFD4] space-y-3">
            <div className="space-y-1 text-xs text-[#6B5E52]">
              <div className="flex justify-between">
                <span>Subtotal Roti</span>
                <span className="font-mono-receipt tabular-nums">{formatRupiah(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Diskon Promo ({appliedVoucher?.code})</span>
                  <span className="font-mono-receipt tabular-nums">-{formatRupiah(discountAmount)}</span>
                </div>
              )}

              {packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Kotak Hadiah Eksklusif</span>
                  <span className="font-mono-receipt tabular-nums">{formatRupiah(packagingFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Pajak Restoran (PPN 11%)</span>
                <span className="font-mono-receipt tabular-nums">{formatRupiah(tax)}</span>
              </div>

              <div className="pt-2 border-t border-[#E8DFD4] flex justify-between text-sm font-bold text-[#2C241E]">
                <span>Total Pembayaran</span>
                <span className="font-mono-receipt text-base text-[#C66526] tabular-nums">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#C66526] hover:bg-[#B3561B] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Lanjut Bayar E-Wallet / Barcode QRIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
