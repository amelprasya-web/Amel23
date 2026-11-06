import React from 'react';
import { Order } from '../types/bakery';
import { formatRupiah, EWALLET_PROVIDERS } from '../services/paymentEngine';
import { QRCodeRenderer, BarcodeRenderer } from './QRCodeRenderer';
import { X, Printer, CheckCircle2, RotateCcw, Share2, Sparkles } from 'lucide-react';

interface ReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  isOpen,
  onClose,
  onNewOrder,
}) => {
  if (!isOpen || !order) return null;

  const provider = EWALLET_PROVIDERS[order.paymentMethod] || EWALLET_PROVIDERS.qris;

  const handlePrint = () => {
    window.print();
  };

  const getSliceShort = (opt: string) => {
    switch (opt) {
      case 'standar_1.5cm':
        return 'Potong 1.5cm';
      case 'tipis_1cm':
        return 'Potong 1.0cm';
      case 'tebal_2cm':
        return 'Potong Tebal 2cm';
      case 'utuh':
      default:
        return 'Utuh';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl border border-[#E8DFD4] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-[#E8DFD4] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-serif-bakery text-base font-bold text-[#2C241E]">
              Pembayaran Sukses & Terverifikasi
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup struk"
            className="w-7 h-7 rounded-full border border-[#E8DFD4] flex items-center justify-center text-[#6B5E52] hover:bg-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div className="p-6 max-h-[75vh] overflow-y-auto bg-[#FAF7F2]">
          <div
            id="printable-receipt"
            className="bg-white p-6 rounded-2xl border border-[#E8DFD4] shadow-xs font-mono-receipt text-xs text-[#2C241E] space-y-4"
          >
            {/* Bakery Brand Header */}
            <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#D8C7B5]">
              <h3 className="font-serif-bakery text-xl font-bold tracking-tight text-[#2C241E]">
                AROMA KARSA
              </h3>
              <p className="text-[11px] text-[#5C5046]">Boulangerie & Patisserie Pengrajin</p>
              <p className="text-[10px] text-[#7A6D60]">
                Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan
              </p>
              <p className="text-[10px] text-[#7A6D60]">Telp: (021) 720-9988 · WhatsApp: 0812-9988-2211</p>
            </div>

            {/* Order Metadata */}
            <div className="text-[11px] space-y-1 pb-3 border-b border-dashed border-[#D8C7B5]">
              <div className="flex justify-between">
                <span>No. Struk:</span>
                <strong className="font-bold">{order.orderNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span>Waktu Transaksi:</span>
                <span>{order.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>Siti Rahayu (Shift Pagi)</span>
              </div>
              <div className="flex justify-between">
                <span>Pelanggan:</span>
                <strong className="font-medium">{order.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Metode Pesan:</span>
                <span className="uppercase">{order.orderType}</span>
              </div>
              <div className="flex justify-between">
                <span>Lokasi/Meja:</span>
                <span>{order.tableOrAddress}</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-2 pb-3 border-b border-dashed border-[#D8C7B5]">
              {order.items.map((item) => (
                <div key={item.id} className="space-y-0.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="tabular-nums">
                      {formatRupiah(item.product.price * item.quantity)}
                    </span>
                  </div>
                  {item.product.allowSliceOption && (
                    <div className="text-[10px] text-[#7A6D60] pl-4">
                      ({getSliceShort(item.sliceOption)})
                    </div>
                  )}
                  {item.notes && (
                    <div className="text-[10px] text-[#7A6D60] italic pl-4">
                      Catatan: {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1 text-[11px] pb-3 border-b border-dashed border-[#D8C7B5]">
              <div className="flex justify-between">
                <span>Subtotal Roti</span>
                <span className="tabular-nums">{formatRupiah(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-800">
                  <span>Diskon Promo ({order.discountCode || 'Voucher'})</span>
                  <span className="tabular-nums">-{formatRupiah(order.discount)}</span>
                </div>
              )}
              {order.packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Kemasan Hard Box Kado</span>
                  <span className="tabular-nums">{formatRupiah(order.packagingFee)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>PPN Restoran (11%)</span>
                <span className="tabular-nums">{formatRupiah(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1 text-[#2C241E]">
                <span>TOTAL AKHIR</span>
                <span className="tabular-nums">{formatRupiah(order.total)}</span>
              </div>
            </div>

            {/* Payment Verification Stamp */}
            <div className="text-center p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DFD4] space-y-1">
              <div className="text-xs font-bold text-emerald-700 tracking-wider">
                *** LUNAS / PAID ***
              </div>
              <div className="text-[10px] text-[#5C5046]">
                Metode: {provider.name}
              </div>
              <div className="text-[9px] text-[#7A6D60] break-all">
                Ref ID: {order.id.slice(0, 18).toUpperCase()} · CRC: {order.qrisPayload.slice(-4)}
              </div>
            </div>

            {/* Barcode Pickup & Scanner Validation */}
            <div className="pt-2 flex flex-col items-center text-center">
              <BarcodeRenderer
                value={order.barcodeValue}
                height={38}
                showText={true}
                className="scale-95 border-none p-0"
              />
              <p className="text-[10px] text-[#7A6D60] mt-1">
                Tunjukkan barcode ini ke kasir saat mengambil pesanan
              </p>
            </div>

            {/* Thank you note */}
            <div className="text-center text-[10px] text-[#7A6D60] pt-2 border-t border-dashed border-[#D8C7B5]">
              Terima kasih telah mencintai roti segar artisan kami.<br />
              Simpan roti dalam wadah kedap udara atau hangatkan 3 menit di toaster.
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-[#E8DFD4] flex items-center justify-between gap-3">
          <button
            onClick={onNewOrder}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#E8DFD4] rounded-xl text-xs font-semibold text-[#2C241E] hover:bg-[#FAF7F2] cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pesan Roti Lain</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C241E] hover:bg-black text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Thermal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
