'use client'

import { useState, useCallback } from 'react';

export type ToastVariant = 'default' | 'destructive';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 3000 }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Add toast to the array
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);
    
    // Remove toast after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, duration);
    
    return { id };
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts,
  };
}
