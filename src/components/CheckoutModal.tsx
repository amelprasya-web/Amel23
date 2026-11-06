import React, { useState } from 'react';
import { CartItem, OrderType, PaymentMethod } from '../types/bakery';
import { formatRupiah, EWALLET_PROVIDERS } from '../services/paymentEngine';
import { X, QrCode, ShieldCheck, User, Phone, MapPin, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  orderType: OrderType;
  subtotal: number;
  discount: number;
  tax: number;
  packagingFee: number;
  total: number;
  onConfirmOrder: (customerData: {
    name: string;
    phone: string;
    tableOrAddress: string;
    paymentMethod: PaymentMethod;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  orderType,
  subtotal,
  discount,
  tax,
  packagingFee,
  total,
  onConfirmOrder,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Silakan masukkan nama pemesan.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Silakan masukkan nomor telepon / WhatsApp untuk konfirmasi pesanan.');
      return;
    }

    onConfirmOrder({
      name: name.trim(),
      phone: phone.trim(),
      tableOrAddress: tableOrAddress.trim() || (orderType === 'dine_in' ? 'Meja Utama' : 'Kasir Toko'),
      paymentMethod,
    });
  };

  const getOrderTypeBadge = (type: OrderType) => {
    switch (type) {
      case 'dine_in':
        return 'Makan di Toko (Dine-in)';
      case 'delivery':
        return 'Pengiriman Kurir Cepat';
      case 'takeaway':
      default:
        return 'Bawa Pulang (Takeaway)';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8DFD4] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD4] flex items-center justify-between bg-[#FAF7F2]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#C66526]">
              Langkah Terakhir
            </div>
            <h2 className="font-serif-bakery text-xl font-bold text-[#2C241E]">
              Data Pemesan & Metode E-Wallet
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup form checkout"
            className="w-8 h-8 rounded-full border border-[#E8DFD4] flex items-center justify-center text-[#6B5E52] hover:bg-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {formError}
            </div>
          )}

          {/* Order Summary Pill */}
          <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD4] flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-[#2C241E]">{getOrderTypeBadge(orderType)}</span>
              <span className="text-[#7A6D60] ml-2">({items.length} jenis roti)</span>
            </div>
            <span className="font-bold text-[#C66526] font-mono-receipt text-sm tabular-nums">
              {formatRupiah(total)}
            </span>
          </div>

          {/* Customer Inputs */}
          <div className="space-y-3">
            <div>
              <label htmlFor="customer-name" className="block text-xs font-semibold text-[#2C241E] mb-1">
                Nama Lengkap Pemesan *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B6D]" />
                <input
                  id="customer-name"
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD4] bg-[#FAF7F2] focus:outline-none focus:border-[#C66526]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="customer-phone" className="block text-xs font-semibold text-[#2C241E] mb-1">
                Nomor WhatsApp / HP *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B6D]" />
                <input
                  id="customer-phone"
                  type="tel"
                  required
                  placeholder="0812-XXXX-XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD4] bg-[#FAF7F2] focus:outline-none focus:border-[#C66526]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="order-note-location" className="block text-xs font-semibold text-[#2C241E] mb-1">
                {orderType === 'dine_in'
                  ? 'Nomor Meja (Bila Sudah Duduk):'
                  : orderType === 'delivery'
                  ? 'Alamat Pengantaran:'
                  : 'Catatan Pengambilan di Kasir:'}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7B6D]" />
                <input
                  id="order-note-location"
                  type="text"
                  placeholder={
                    orderType === 'dine_in'
                      ? 'Contoh: Meja 04 area jendela'
                      : orderType === 'delivery'
                      ? 'Jl. Senopati No. 12, Kebayoran Baru'
                      : 'Ambil sekitar pukul 15.30 WIB'
                  }
                  value={tableOrAddress}
                  onChange={(e) => setTableOrAddress(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DFD4] bg-[#FAF7F2] focus:outline-none focus:border-[#C66526]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#2C241E] mb-2 flex items-center justify-between">
              <span>Pilih Metode Pembayaran E-Wallet:</span>
              <span className="text-[11px] text-[#C66526] font-medium flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                Dibuat Otomatis via JS
              </span>
            </label>

            <div className="space-y-2">
              {Object.values(EWALLET_PROVIDERS).map((provider) => {
                const isSelected = paymentMethod === provider.id;
                return (
                  <label
                    key={provider.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#C66526] bg-[#FDF7F2] shadow-xs'
                        : 'border-[#E8DFD4] bg-[#FAF7F2] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={provider.id}
                        checked={isSelected}
                        onChange={() => setPaymentMethod(provider.id)}
                        className="text-[#C66526] focus:ring-[#C66526]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2C241E]">
                            {provider.name}
                          </span>
                          {provider.id === 'qris' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#C82A2A] text-white rounded">
                              QRIS
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#7A6D60]">{provider.tagline}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono-receipt text-[#8C7B6D]">
                        Biaya Admin: Rp 0
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="flex items-center gap-2 p-3 bg-[#F3ECE2] rounded-xl text-[11px] text-[#5C5046]">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              Kode pembayaran QRIS dan Barcode dihitung secara instan menggunakan modul JavaScript dengan validasi checksum CRC16 resmi Bank Indonesia.
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#C66526] hover:bg-[#B3561B] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Tampilkan Barcode & QR Code Pembayaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
