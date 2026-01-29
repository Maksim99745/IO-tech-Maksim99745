import { NextResponse } from 'next/server';
import { API_BASE_URL, API_TOKEN } from '@/lib/constants';

export async function GET() {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (API_TOKEN) {
      headers['Authorization'] = `Bearer ${API_TOKEN}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/services?populate=*`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        {
          error: `Strapi API error: ${response.status} ${response.statusText}`,
          details: errorText,
          url: `${API_BASE_URL}/api/services`,
          hasToken: !!API_TOKEN,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data,
      url: `${API_BASE_URL}/api/services`,
      hasToken: !!API_TOKEN,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch from Strapi',
        url: `${API_BASE_URL}/api/services`,
        hasToken: !!API_TOKEN,
      },
      { status: 500 }
    );
  }
}
