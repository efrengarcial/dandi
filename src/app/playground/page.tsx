'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { Notification } from '@/components/ui/notification';
import { validateApiKey } from '../actions';
import { CheckCircleIcon, XCircleIcon } from './icons';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) return;

    setIsValidating(true);
    
    try {
      // Call the server action to validate the API key
      const result = await validateApiKey(apiKey);
      setValidationResult(result);
      setShowNotification(true);
      
      // If the API key is valid, store it and redirect to the protected page
      if (result.isValid) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('apiKey', apiKey);
          // Wait a moment to show the notification before redirecting
          setTimeout(() => {
            router.push('/protected');
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setValidationResult({
        isValid: false,
        message: 'Error validating API key'
      });
      setShowNotification(true);
    } finally {
      setIsValidating(false);
    }
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Notification component */}
        {showNotification && validationResult && (
          <Notification
            show={showNotification}
            onClose={closeNotification}
            message={validationResult.message}
            type={validationResult.isValid ? "success" : "error"}
            icon={
              validationResult.isValid 
                ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> 
                : <XCircleIcon className="w-5 h-5 text-red-500" />
            }
          />
        )}

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
                disabled={isValidating}
              >
                {isValidating ? 'Validating...' : 'Access Playground'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 