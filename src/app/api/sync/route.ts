import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { scriptUrl, action, data } = await req.json();

    if (!scriptUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing scriptUrl' },
        { status: 400 }
      );
    }

    // Forward request to Google Apps Script Web App
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: action || 'sync', data }),
      redirect: 'follow',
      cache: 'no-store',
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scriptUrl = searchParams.get('scriptUrl');

  if (!scriptUrl) {
    return NextResponse.json(
      { success: false, error: 'Missing scriptUrl' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Fetch failed' },
      { status: 500 }
    );
  }
}

