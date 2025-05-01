'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';

export default function ProtectedPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the API key from session storage (only runs client-side)
    try {
      const storedApiKey = typeof window !== 'undefined' ? sessionStorage.getItem('apiKey') : null;
      
      if (!storedApiKey) {
        // No API key found in session storage, redirect back to playground
        router.push('/playground');
        return;
      }
      
      // Key exists in session storage, so set it in state
      setApiKey(storedApiKey);
    } catch (error) {
      console.error('Error accessing session storage:', error);
      router.push('/playground');
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto mt-16">
          <h1 className="text-3xl font-bold mb-8">Protected Playground</h1>

          {!apiKey ? (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <p className="text-center text-gray-400">Loading...</p>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Welcome to the Protected Playground</h2>
              <p className="text-gray-400 mb-6">
                Your API key has been validated. You now have access to the protected playground.
              </p>
              <div className="border-t border-gray-800 pt-4 mt-4">
                <h3 className="text-lg font-medium mb-2">Your API Key</h3>
                <div className="bg-gray-800 p-3 rounded flex items-center justify-between">
                  <code className="text-sm text-green-400">{apiKey}</code>
                  <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded">Valid</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 