import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, questions, answers } = body;

    if (!topic || !questions || !answers) {
      return NextResponse.json(
        { error: 'Topic, questions, and answers are required' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9999';
    const response = await axios.post(
      `${backendUrl}/api/coach/evaluate`,
      { topic, questions, answers },
      { timeout: 50000 }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API Route Error:', error);

    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || error.message },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
