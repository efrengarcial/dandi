import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the API key
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { isValid: false, message: "No API key provided" },
        { status: 400 }
      );
    }

    // This would normally be a database query or API call to validate the key
    // For now, we'll just check if it starts with 'dandi-' and is longer than 10 characters
    const isValid = apiKey.startsWith('dandi-') && apiKey.length > 10;
    
    if (isValid) {
      return NextResponse.json({
        isValid: true,
        message: "Valid API key, /protected can be accessed"
      });
    } else {
      return NextResponse.json({
        isValid: false,
        message: "Invalid API key"
      });
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { isValid: false, message: "Error validating API key" },
      { status: 500 }
    );
  }
} 