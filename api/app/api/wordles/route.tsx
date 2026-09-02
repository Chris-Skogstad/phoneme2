import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET – all wordles, optionally filtered by ?creator=name, or a single one by ?id=uuid
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const creatorName = request.nextUrl.searchParams.get('creator');

    if (id) {
      const wordle = await prisma.wordle.findUnique({
        where: { id },
        include: { words: true, creator: true },
      });
      if (!wordle) {
        return new NextResponse('Wordle not found', { status: 404, headers: corsHeaders });
      }
      return NextResponse.json(wordle, { headers: corsHeaders });
    }

    const wordles = await prisma.wordle.findMany({
      where: creatorName ? { creator: { name: creatorName } } : undefined,
      include: { words: true, creator: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(wordles, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// POST – create a new wordle
export async function POST(request: NextRequest) {
  try {
    const { title, difficulty, wordIds, creatorName, outputSettings } = await request.json();

    if (!title || typeof title !== 'string') {
      return new NextResponse('Missing or invalid "title"', { status: 400, headers: corsHeaders });
    }
    if (!difficulty || typeof difficulty !== 'string') {
      return new NextResponse('Missing or invalid "difficulty"', { status: 400, headers: corsHeaders });
    }
    if (!Array.isArray(wordIds) || wordIds.length === 0) {
      return new NextResponse('"wordIds" must be a non-empty array', { status: 400, headers: corsHeaders });
    }
    if (!creatorName || typeof creatorName !== 'string') {
      return new NextResponse('Missing or invalid "creatorName"', { status: 400, headers: corsHeaders });
    }

    const creator = await prisma.user.upsert({
      where: { name: creatorName },
      update: {},
      create: { name: creatorName },
    });

    const wordle = await prisma.wordle.create({
      data: {
        title,
        difficulty,
        outputSettings: outputSettings ?? undefined,
        creatorId: creator.id,
        words: { connect: wordIds.map((id: string) => ({ id })) },
      },
      include: { words: true, creator: true },
    });

    return NextResponse.json(wordle, { status: 201, headers: corsHeaders });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return new NextResponse('One or more wordIds not found', { status: 400, headers: corsHeaders });
    }
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}


// PATCH – update a wordle by ID (?id=uuid)
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    const { title, difficulty, wordIds, outputSettings } = await request.json();

    const updated = await prisma.wordle.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(difficulty !== undefined && { difficulty }),
        ...(outputSettings !== undefined && { outputSettings }),
        ...(wordIds !== undefined && {
          words: { set: wordIds.map((wid: string) => ({ id: wid })) },
        }),
      },
      include: { words: true, creator: true },
    });

    return NextResponse.json(updated, { headers: corsHeaders });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return new NextResponse('Wordle not found', { status: 404, headers: corsHeaders });
    }
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}


// DELETE – delete a wordle by ID (?id=uuid)
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    await prisma.wordle.delete({ where: { id } });

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return new NextResponse('Wordle not found', { status: 404, headers: corsHeaders });
    }
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}