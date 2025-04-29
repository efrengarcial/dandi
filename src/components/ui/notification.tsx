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
    success: "bg-green-100 border-green-200 text-green-800",
    error: "bg-red-100 border-red-200 text-red-800",
    info: "bg-blue-100 border-blue-200 text-blue-800",
    warning: "bg-yellow-100 border-yellow-200 text-yellow-800"
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
            "text-green-600 hover:text-green-800": type === 'success',
            "text-red-600 hover:text-red-800": type === 'error',
            "text-blue-600 hover:text-blue-800": type === 'info',
            "text-yellow-600 hover:text-yellow-800": type === 'warning',
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