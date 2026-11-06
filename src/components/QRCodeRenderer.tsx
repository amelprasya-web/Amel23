import React, { useMemo } from 'react';
import { generateQRMatrix, generateBarcodeModules } from '../services/paymentEngine';

interface QRCodeRendererProps {
  payload: string;
  size?: number;
  centerLogoText?: string;
  className?: string;
}

export const QRCodeRenderer: React.FC<QRCodeRendererProps> = ({
  payload,
  size = 220,
  centerLogoText = 'QRIS',
  className = '',
}) => {
  const matrix = useMemo(() => {
    return generateQRMatrix(payload);
  }, [payload]);

  const matrixSize = matrix.length;
  const cellSize = size / matrixSize;

  return (
    <div className={`relative inline-block bg-white p-3 rounded-xl border border-[#E8DFD4] shadow-inner ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block"
        role="img"
        aria-label="QR Code Pembayaran QRIS"
      >
        <rect width={size} height={size} fill="#ffffff" />
        {matrix.map((row, r) =>
          row.map((isDark, c) => {
            if (!isDark) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize + 0.3} // Sedikit overlap untuk mencegah garis putih sub-pixel
                height={cellSize + 0.3}
                fill="#1C1814"
              />
            );
          })
        )}
      </svg>

      {/* Center Badge QRIS / Toko Roti */}
      {centerLogoText && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white px-2 py-0.5 rounded shadow-sm border border-slate-300 flex items-center gap-1">
            <span className="text-[10px] font-black tracking-tight text-[#C82A2A]">
              {centerLogoText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

interface BarcodeRendererProps {
  value: string;
  height?: number;
  showText?: boolean;
  className?: string;
}

export const BarcodeRenderer: React.FC<BarcodeRendererProps> = ({
  value,
  height = 54,
  showText = true,
  className = '',
}) => {
  const modules = useMemo(() => {
    return generateBarcodeModules(value);
  }, [value]);

  const moduleWidth = 2;
  const totalWidth = modules.length * moduleWidth;

  return (
    <div className={`inline-flex flex-col items-center bg-white p-2.5 rounded-lg border border-[#E8DFD4] ${className}`}>
      <svg
        width={totalWidth}
        height={height}
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="block"
        role="img"
        aria-label={`Barcode ${value}`}
      >
        <rect width={totalWidth} height={height} fill="#ffffff" />
        {modules.map((isBar, idx) => {
          if (!isBar) return null;
          return (
            <rect
              key={idx}
              x={idx * moduleWidth}
              y={0}
              width={moduleWidth}
              height={height}
              fill="#1C1814"
            />
          );
        })}
      </svg>
      {showText && (
        <div className="text-[11px] font-mono-receipt tracking-widest text-[#5C5046] mt-1.5 select-all">
          *{value}*
        </div>
      )}
    </div>
  );
};
