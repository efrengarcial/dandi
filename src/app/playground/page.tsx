'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store the API key in session storage to access it on the protected page
    if (apiKey) {
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('apiKey', apiKey);
          router.push('/protected');
        }
      } catch (error) {
        console.error('Error storing API key in session storage:', error);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-md mx-auto mt-16">
          <h1 className="text-3xl font-bold mb-8">API Playground</h1>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Enter Your API Key</h2>
            <p className="text-gray-400 mb-6">
              Enter your API key to access the protected playground. You can find your API key in the dashboard.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-400 mb-2">
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="dandi-xxxxxxxxxxxxxxxx"
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Access Playground
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 