import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-400 text-emerald-800',
    error: 'bg-rose-50 border-rose-400 text-rose-800',
    warning: 'bg-amber-50 border-amber-400 text-amber-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 mr-2 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 mr-2 shrink-0" />,
    info: <CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />,
  };

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 animate-bounce duration-300">
      <div
        className={`flex items-center px-4 py-3 rounded-xl border shadow-xl ${
          bgColors[type] || bgColors.info
        } max-w-md`}
      >
        {icons[type]}
        <span className="text-sm font-medium pr-2">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
