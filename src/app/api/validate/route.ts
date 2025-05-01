import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

    // Validate the API key against Supabase database
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key', apiKey)
      .single();

    if (error) {
      console.error('Supabase query error:', error);
      
      // If the error is "No rows found", it means the API key doesn't exist
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          isValid: false,
          message: "Invalid API key"
        });
      }
      
      // For other errors, return a server error
      return NextResponse.json(
        { isValid: false, message: "Server error validating API key" },
        { status: 500 }
      );
    }

    // API key exists in the database
    return NextResponse.json({
      isValid: true,
      message: "Valid API key, /protected can be accessed",
      key: data
    });
    
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { isValid: false, message: "Error validating API key" },
      { status: 500 }
    );
  }
} 