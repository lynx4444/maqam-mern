import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Copy, Check, QrCode, Download, Heart } from 'lucide-react';
import { Toast } from '../components/Toast';

export const Donation = () => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const accountNumber = '1005 5410 0001 0976';

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''));
    setCopied(true);
    setToast({ message: t('copied_account'), type: 'success' });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Main Sign Board Container matching Laravel exactly */}
      <div className="relative w-full max-w-sm bg-white border-[6px] border-lime-500 rounded-3xl shadow-2xl shadow-lime-200/60 overflow-hidden flex flex-col items-center text-center transition-transform hover:scale-[1.01]">
        {/* Decorative Pattern (Subtle grid texture) */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Content Wrapper */}
        <div className="z-10 w-full flex flex-col items-center px-4">
          {/* Header Title */}
          <div className="mt-8 mb-4">
            <h1 className="font-extrabold tracking-tighter drop-shadow-sm flex items-baseline justify-center">
              <span className="text-5xl text-gray-800 font-black">Infaq</span>
              <span className="text-3xl text-lime-500 mx-0.5 font-bold">n</span>
              <span className="text-5xl text-lime-500 font-black">Go</span>
            </h1>
          </div>

          {/* DuitNow Logo Box */}
          <div className="bg-white px-4 py-1.5 mb-3 flex items-center justify-center">
            <img
              src="/images/duit-now-logo.png"
              alt="DuitNow Logo"
              className="h-11 w-auto object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          {/* QR Code Area */}
          <div className="bg-white p-2 mb-4 rounded-2xl shadow-sm border border-gray-100 relative group">
            <img
              src="/images/qr-code.png"
              alt="Scan QR Code"
              className="w-56 h-56 object-cover border-4 border-lime-500 rounded-xl"
              onError={(e) => {
                e.target.src =
                  'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MasjidAlHidayahInfaq';
              }}
            />
          </div>

          {/* Mosque Name & Purpose */}
          <div className="mb-6 px-2">
            <h2 className="text-gray-800 font-extrabold text-xl tracking-wider uppercase">
              {t('mosque_name')}
            </h2>
            <p className="text-lime-600 text-xs font-bold tracking-widest uppercase mt-1">
              {t('fund_name')}
            </p>
          </div>
        </div>

        {/* Bottom Lime Strip */}
        <div className="z-10 w-full bg-lime-400 py-4 flex flex-col items-center justify-center mt-auto relative border-t-4 border-lime-500 px-4">
          {/* Account Number with Copy Button */}
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lime-950 font-black text-2xl tracking-widest drop-shadow-sm font-mono select-all">
              {accountNumber}
            </span>
            <button
              onClick={handleCopy}
              title="Copy Account Number"
              className="p-1.5 bg-lime-500 hover:bg-lime-600 text-lime-950 rounded-lg transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Bank Name */}
          <div className="flex items-center gap-2">
            <span className="text-lime-900 font-bold text-sm tracking-wider uppercase">
              {t('bank_name')}
            </span>
          </div>
        </div>
      </div>

      {/* Copy Quick Action button for mobile */}
      <button
        onClick={handleCopy}
        className="mt-6 inline-flex items-center space-x-2 bg-white text-lime-800 font-bold px-5 py-2.5 rounded-full shadow-md border border-lime-300 hover:bg-lime-50 transition text-sm"
      >
        <Copy className="w-4 h-4 text-lime-600" />
        <span>{t('copy_account')}</span>
      </button>
    </div>
  );
};
