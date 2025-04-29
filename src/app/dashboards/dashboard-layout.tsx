'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-black">
      <div 
        className={cn(
          "fixed top-0 left-0 h-full transition-all duration-300 ease-in-out z-30",
          sidebarOpen ? "translate-x-0" : "-translate-x-[200px]"
        )}
      >
        <Sidebar />
      </div>
      
      <div 
        className={cn(
          "fixed top-4 z-40 transition-all duration-300 ease-in-out",
          sidebarOpen ? "left-[180px]" : "left-4"
        )}
      >
        <button 
          onClick={toggleSidebar}
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 shadow-lg"
          aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </button>
      </div>
      
      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          sidebarOpen ? "ml-[200px]" : "ml-0"
        )}
      >
        {children}
      </main>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
} 