'use server';

// Server component to validate API key
export async function validateApiKey(apiKey: string): Promise<{ isValid: boolean; message: string }> {
  try {
    // This would normally be a database query or API call to validate the key
    // For now, we'll just check if it starts with 'dandi-' and is longer than 10 characters
    const isValid = apiKey.startsWith('dandi-') && apiKey.length > 10;
    
    if (isValid) {
      return {
        isValid: true,
        message: "Valid API key, /protected can be accessed"
      };
    } else {
      return {
        isValid: false,
        message: "Invalid API key"
      };
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return {
      isValid: false,
      message: "Error validating API key"
    };
  }
} 