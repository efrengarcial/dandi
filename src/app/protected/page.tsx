'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/ui/sidebar';
import { Notification } from '@/components/ui/notification';
import { CheckCircleIcon, XCircleIcon } from './icons';

// Mock function to validate API key (replace with actual API call in production)
const validateApiKey = async (apiKey: string): Promise<boolean> => {
  // This would normally be a call to your backend to validate the API key
  // For now, we'll just check if it starts with 'dandi-' and is longer than 10 characters
  return apiKey.startsWith('dandi-') && apiKey.length > 10;
};

export default function ProtectedPage() {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the API key from session storage (only runs client-side)
    try {
      const storedApiKey = typeof window !== 'undefined' ? sessionStorage.getItem('apiKey') : null;
      setApiKey(storedApiKey);

      if (!storedApiKey) {
        // No API key found in session storage, redirect back to playground
        router.push('/playground');
        return;
      }

      // Validate the API key
      const validate = async () => {
        try {
          const valid = await validateApiKey(storedApiKey);
          setIsValid(valid);
          setShowNotification(true);
        } catch (error) {
          console.error('Error validating API key:', error);
          setIsValid(false);
          setShowNotification(true);
        } finally {
          setIsValidating(false);
        }
      };

      validate();
    } catch (error) {
      console.error('Error accessing session storage:', error);
      router.push('/playground');
    }
  }, [router]);

  const closeNotification = () => {
    setShowNotification(false);
    
    // If the API key is invalid, redirect back to the playground
    if (!isValid) {
      router.push('/playground');
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        {/* Notification component */}
        {showNotification && isValid !== null && (
          <Notification
            show={showNotification}
            onClose={closeNotification}
            message={isValid ? "Valid API key, /protected can be accessed" : "Invalid API key"}
            type={isValid ? "success" : "error"}
            icon={isValid ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <XCircleIcon className="w-5 h-5 text-red-500" />}
          />
        )}

        <div className="max-w-4xl mx-auto mt-16">
          <h1 className="text-3xl font-bold mb-8">Protected Playground</h1>

          {isValidating ? (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <p className="text-center text-gray-400">Validating your API key...</p>
            </div>
          ) : isValid ? (
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
          ) : (
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-red-400">Access Denied</h2>
              <p className="text-gray-400">
                Your API key could not be validated. You will be redirected back to the API Playground.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 