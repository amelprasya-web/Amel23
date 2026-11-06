import React from 'react';
import { Order } from '../types/bakery';
import { formatRupiah, EWALLET_PROVIDERS } from '../services/paymentEngine';
import { X, Receipt, Clock, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onViewReceipt: (order: Order) => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  onViewReceipt,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E8DFD4] shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8DFD4] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C66526]" />
            <h2 className="font-serif-bakery text-xl font-bold text-[#2C241E]">
              Riwayat Transaksi Roti
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup riwayat"
            className="w-8 h-8 rounded-full border border-[#E8DFD4] flex items-center justify-center text-[#6B5E52] hover:bg-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 text-[#9C8F83] mx-auto mb-3 opacity-60" />
              <p className="font-serif-bakery text-lg font-bold text-[#2C241E]">
                Belum Ada Riwayat Pesanan
              </p>
              <p className="text-xs text-[#6B5E52] mt-1">
                Semua pesanan yang telah dibayar menggunakan QRIS atau e-wallet akan tersimpan di sini.
              </p>
            </div>
          ) : (
            orders.map((order) => {
              const provider = EWALLET_PROVIDERS[order.paymentMethod] || EWALLET_PROVIDERS.qris;
              return (
                <div
                  key={order.id}
                  className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD4] shadow-xs flex flex-col justify-between gap-3 hover:border-[#D1BFA9] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-receipt font-bold text-sm text-[#2C241E]">
                          {order.orderNumber}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Lunas
                        </span>
                      </div>
                      <div className="text-xs text-[#6B5E52] mt-0.5">
                        {order.createdAt} · {order.customerName}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-serif-bakery text-base font-bold text-[#2C241E] tabular-nums">
                        {formatRupiah(order.total)}
                      </div>
                      <div className="text-[10px] text-[#7A6D60]">
                        Via {provider.name}
                      </div>
                    </div>
                  </div>

                  {/* Items preview snippet */}
                  <div className="text-xs text-[#5C5046] border-t border-[#E8DFD4] pt-2">
                    {order.items.map((it) => `${it.quantity}x ${it.product.name}`).join(', ')}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#7A6D60] font-mono-receipt">
                      Barcode: {order.barcodeValue}
                    </span>
                    <button
                      onClick={() => onViewReceipt(order)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#C66526] hover:underline cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Buka Struk Kasir</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD4] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2C241E] text-white text-xs font-semibold rounded-xl hover:bg-black cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
