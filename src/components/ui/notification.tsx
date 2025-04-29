'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NotificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  icon?: React.ReactNode;
}

export function Notification({
  show,
  onClose,
  message,
  type = 'success',
  duration = 3000,
  icon
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, onClose]);

  const typeStyles = {
    success: "bg-green-900/60 border-green-700 text-green-300",
    error: "bg-red-900/60 border-red-700 text-red-300",
    info: "bg-blue-900/60 border-blue-700 text-blue-300",
    warning: "bg-yellow-900/60 border-yellow-700 text-yellow-300"
  };

  if (!show) return null;

  return (
    <div 
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 border px-4 py-3 rounded-md shadow-md z-50 flex items-center gap-2",
        typeStyles[type]
      )}
    >
      {icon}
      <span>{message}</span>
      <button 
        onClick={onClose}
        className={cn(
          "ml-4 hover:opacity-80",
          {
            "text-green-300 hover:text-green-100": type === 'success',
            "text-red-300 hover:text-red-100": type === 'error',
            "text-blue-300 hover:text-blue-100": type === 'info',
            "text-yellow-300 hover:text-yellow-100": type === 'warning',
          }
        )}
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
} 