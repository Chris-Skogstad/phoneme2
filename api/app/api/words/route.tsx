import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { phonemeLegend } from '@/lib/phonemeLegend'; // adjust path to match your actual file location

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET – all words, or filter by ?locale=au
export async function GET(request: NextRequest) {
  try {
    const locale = request.nextUrl.searchParams.get('locale');
    const words = await prisma.word.findMany({
      where: locale ? { locale } : undefined,
      orderBy: { text: 'asc' },
    });
    return NextResponse.json(words, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// POST – create a new word
export async function POST(request: NextRequest) {
  try {
    const { text, locale, phonemes, hint } = await request.json();

    if (!text || typeof text !== 'string') {
      return new NextResponse('Missing or invalid "text"', { status: 400, headers: corsHeaders });
    }
    if (!locale || typeof locale !== 'string') {
      return new NextResponse('Missing or invalid "locale"', { status: 400, headers: corsHeaders });
    }
    if (!Array.isArray(phonemes) || phonemes.length === 0) {
      return new NextResponse('"phonemes" must be a non-empty array', { status: 400, headers: corsHeaders });
    }
    const invalidPhoneme = phonemes.find((p: string) => !(p in phonemeLegend));
    if (invalidPhoneme) {
      return new NextResponse(`Unknown phoneme symbol: "${invalidPhoneme}"`, { status: 400, headers: corsHeaders });
    }

    const word = await prisma.word.create({
      data: { text, locale, phonemes, hint: hint ?? null },
    });

    return NextResponse.json(word, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return new NextResponse('Word already exists for this locale', { status: 409, headers: corsHeaders });
    }
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}