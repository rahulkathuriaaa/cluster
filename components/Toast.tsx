'use client'

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Toast as ToastType } from '../hooks/use-toast';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  // Auto dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        p-4 rounded-sm border shadow-lg min-w-[300px] max-w-[350px] transform transition-all duration-300
        ${toast.variant === 'destructive' 
          ? 'bg-black border-red-600 text-red-400' 
          : 'bg-black border-[#FFD700] text-[#FFD700]'
        }
      `}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          {toast.title && (
            <h3 className="font-medium mb-1">{toast.title}</h3>
          )}
          {toast.description && (
            <p className="text-sm opacity-80">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className={`p-1 rounded-sm hover:bg-black/20 transition-colors ${
            toast.variant === 'destructive' ? 'text-red-400' : 'text-[#FFD700]'
          }`}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast; 