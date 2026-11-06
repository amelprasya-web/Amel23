import React, { useState, useEffect } from 'react';
import { Order, PaymentMethod } from '../types/bakery';
import { formatRupiah, EWALLET_PROVIDERS, playCashierSuccessChime } from '../services/paymentEngine';
import { QRCodeRenderer, BarcodeRenderer } from './QRCodeRenderer';
import {
  X,
  Clock,
  CheckCircle2,
  Copy,
  Smartphone,
  RefreshCw,
  AlertCircle,
  QrCode,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PaymentModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (paidOrder: Order) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  if (!isOpen || !order) return null;

  // 5 Minutes (300 seconds) Countdown
  const [timeLeft, setTimeLeft] = useState(300);
  const [isCopied, setIsCopied] = useState(false);
  const [showRawPayload, setShowRawPayload] = useState(false);
  const [isSimulatingPhone, setIsSimulatingPhone] = useState(false);
  const [simulatedPin, setSimulatedPin] = useState('');
  const [simulatingStep, setSimulatingStep] = useState<'scan' | 'confirm' | 'processing' | 'success'>('scan');
  const [isPaid, setIsPaid] = useState(false);

  const provider = EWALLET_PROVIDERS[order.paymentMethod] || EWALLET_PROVIDERS.qris;

  // Timer countdown
  useEffect(() => {
    if (isPaid) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaid]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const progressPercent = (timeLeft / 300) * 100;

  // Trigger successful payment
  const completePayment = () => {
    setIsPaid(true);
    playCashierSuccessChime();

    const updatedOrder: Order = {
      ...order,
      paymentStatus: 'paid',
      paidAt: new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    setTimeout(() => {
      onPaymentSuccess(updatedOrder);
    }, 1200);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(order.qrisPayload);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatedPayment = () => {
    setSimulatingStep('processing');
    setTimeout(() => {
      setSimulatingStep('success');
      setTimeout(() => {
        setIsSimulatingPhone(false);
        completePayment();
      }, 700);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl border border-[#E8DFD4] shadow-2xl overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-[#E8DFD4] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#C66526]">
                Portal Pembayaran Digital Toko Roti
              </span>
              <h2 className="font-serif-bakery text-xl font-bold text-[#2C241E]">
                {provider.name} & Barcode QRIS
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup pembayaran"
            className="w-8 h-8 rounded-full border border-[#E8DFD4] flex items-center justify-center text-[#6B5E52] hover:bg-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[82vh] overflow-y-auto space-y-6">
          {/* Status & Countdown Banner */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD4]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-[#6B5E52]">
                Selesaikan pembayaran dalam tempo:
              </div>
              <div className="flex items-center gap-1.5 font-mono-receipt text-sm font-bold text-[#C66526]">
                <Clock className="w-4 h-4" />
                <span>{timeFormatted}</span>
              </div>
            </div>

            {/* Countdown progress line */}
            <div className="w-full h-1.5 bg-[#E8DFD4] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C66526] transition-all duration-1000 ease-linear rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8DFD4] text-xs">
              <span className="text-[#6B5E52]">
                No. Pesanan: <strong className="text-[#2C241E] font-mono-receipt">{order.orderNumber}</strong>
              </span>
              <span className="font-serif-bakery text-base font-bold text-[#2C241E] tabular-nums">
                Total: {formatRupiah(order.total)}
              </span>
            </div>
          </div>

          {/* QR Code and Barcode Presentation Container */}
          <div className="flex flex-col items-center justify-center text-center p-6 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD4] relative">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8C7B6D] mb-1">
              Pindai / Scan Menggunakan Aplikasi E-Wallet
            </div>
            <div className="text-xs text-[#5C5046] mb-4">
              Buka aplikasi {provider.name}, BCA, Mandiri, atau e-wallet lainnya lalu arahkan kamera:
            </div>

            {/* QR Code Pure JavaScript SVG */}
            <div className="relative group">
              <QRCodeRenderer
                payload={order.qrisPayload}
                size={230}
                centerLogoText={order.paymentMethod === 'qris' ? 'QRIS' : provider.name.slice(0, 5).toUpperCase()}
                className="bg-white shadow-sm"
              />

              {isPaid && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center text-emerald-700 animate-in fade-in">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mb-2 animate-bounce" />
                  <span className="font-serif-bakery text-lg font-bold">LUNAS</span>
                  <span className="text-xs text-[#5C5046]">Terverifikasi Otomatis</span>
                </div>
              )}
            </div>

            {/* Barcode Pure JavaScript Code 128 (Optional Optical Cashier Scanner) */}
            <div className="mt-5 pt-4 border-t border-[#E8DFD4] w-full flex flex-col items-center">
              <div className="text-[11px] font-semibold text-[#8C7B6D] uppercase tracking-wider mb-2">
                Barcode Optik Scanner Kasir (Code 128)
              </div>
              <BarcodeRenderer
                value={order.barcodeValue}
                height={46}
                showText={true}
                className="shadow-2xs"
              />
              <span className="text-[10px] text-[#7A6D60] mt-1">
                Dapat discan langsung oleh barcode scanner kasir di outlet
              </span>
            </div>
          </div>

          {/* Quick Pay Action & Smartphone Simulator */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DFD4] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2C241E] flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-[#C66526]" />
                Simulasi Pembayaran (Uji Coba Interaktif):
              </span>
              <button
                onClick={() => setIsSimulatingPhone(!isSimulatingPhone)}
                className="text-xs text-[#C66526] hover:underline font-semibold cursor-pointer flex items-center gap-1"
              >
                {isSimulatingPhone ? 'Tutup Simulator' : 'Buka Layar HP'}
                {isSimulatingPhone ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Simulated Phone Screen */}
            {isSimulatingPhone ? (
              <div className="bg-white rounded-xl p-4 border border-[#E8DFD4] shadow-inner space-y-3">
                <div className="flex items-center justify-between border-b border-[#F0E8DC] pb-2 text-xs">
                  <span className="font-bold text-[#2C241E]">Simulasi {provider.name} Pay</span>
                  <span className="font-mono-receipt text-[11px] text-emerald-700 font-semibold">
                    Saldo Aktif: Rp 500.000
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-[#6B5E52]">
                    <span>Merchant:</span>
                    <strong className="text-[#2C241E]">TOKO ROTI AROMA KARSA</strong>
                  </div>
                  <div className="flex justify-between text-[#6B5E52]">
                    <span>Nominal Bayar:</span>
                    <strong className="text-[#C66526] font-mono-receipt tabular-nums font-bold">
                      {formatRupiah(order.total)}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#6B5E52]">
                    <span>Biaya Transaksi:</span>
                    <span className="text-emerald-700 font-semibold">Rp 0 (Gratis)</span>
                  </div>
                </div>

                {simulatingStep === 'scan' && (
                  <button
                    onClick={handleSimulatedPayment}
                    className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Konfirmasi Pembayaran ({formatRupiah(order.total)})</span>
                  </button>
                )}

                {simulatingStep === 'processing' && (
                  <div className="py-2.5 text-center text-xs font-semibold text-[#C66526] flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses transaksi ke jaringan bank...</span>
                  </div>
                )}

                {simulatingStep === 'success' && (
                  <div className="py-2 text-center text-xs font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pembayaran Berhasil di HP! Menyinkronkan kasir...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={completePayment}
                  disabled={isPaid}
                  className="flex-grow inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasi Bayar Berhasil (Instan)</span>
                </button>
              </div>
            )}
          </div>

          {/* JavaScript QRIS Payload Inspector (Proof of real JavaScript implementation) */}
          <div className="border border-[#E8DFD4] rounded-xl overflow-hidden bg-white text-xs">
            <button
              onClick={() => setShowRawPayload(!showRawPayload)}
              className="w-full px-4 py-2.5 bg-[#FAF7F2] text-left font-semibold text-[#5C5046] flex items-center justify-between hover:bg-[#F3ECE2] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5 text-[#C66526]" />
                Lihat Payload String Standar QRIS EMVCo (JavaScript)
              </span>
              <span className="text-[11px] text-[#C66526]">
                {showRawPayload ? 'Sembunyikan' : 'Periksa Raw Code'}
              </span>
            </button>

            {showRawPayload && (
              <div className="p-4 space-y-2 bg-[#FBF9F6]">
                <p className="text-[11px] text-[#7A6D60]">
                  Berikut adalah string EMVCo yang di-generate langsung oleh modul JavaScript kami dengan kalkulasi checksum CRC16:
                </p>
                <div className="p-2.5 bg-[#2C241E] text-amber-200 font-mono-receipt text-[11px] break-all rounded-lg select-all border border-black/20">
                  {order.qrisPayload}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-[#7A6D60]">
                    Panjang Karakter: {order.qrisPayload.length} byte · Tag CRC: {order.qrisPayload.slice(-4)}
                  </span>
                  <button
                    onClick={handleCopyPayload}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#C66526] hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{isCopied ? 'Tersalin!' : 'Salin String'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DFD4] flex items-center justify-between text-xs text-[#6B5E52]">
          <span>Butuh bantuan kasir? Hubungi WhatsApp: 0812-9988-2211</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-[#E8DFD4] hover:bg-white text-[#2C241E] font-medium cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
