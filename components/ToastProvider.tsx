'use client'

import React from 'react';
import { createPortal } from 'react-dom';
import { useToast } from '../hooks/use-toast';
import Toast from './Toast';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, dismiss } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default ToastProvider; 