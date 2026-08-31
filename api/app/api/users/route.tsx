import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // ✅ Import only

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS – CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET – Get all users or one by ID (?id=uuid)
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (id) {
      const user = await prisma.user.findUnique({
        where: { id }, // assumes id is UUID string
      });

      if (!user) {
        return new NextResponse('User not found', { status: 404, headers: corsHeaders });
      }

      return NextResponse.json(user, { headers: corsHeaders });
    }

    const users = await prisma.user.findMany();
    return NextResponse.json(users, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Server error', { status: 500, headers: corsHeaders });
  }
}

// POST – Create new user
export async function POST(request: NextRequest) {
  try {
    const { name, lineStatus } = await request.json();

    if (!name || !lineStatus) {
      return new NextResponse('Missing name or lineStatus', { status: 400, headers: corsHeaders });
    }

    const newUser = await prisma.user.create({
      data: { name, lineStatus },
    });

    return NextResponse.json(newUser, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request body', { status: 400, headers: corsHeaders });
  }
}

// PATCH – Update user by ID (?id=uuid)
export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    const { name, lineStatus } = await request.json();

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(lineStatus !== undefined && { lineStatus }),
      },
    });

    return NextResponse.json(updatedUser, { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}

// DELETE – Delete user by ID (?id=uuid)
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
      return new NextResponse('Missing id', { status: 400, headers: corsHeaders });
    }

    await prisma.user.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new NextResponse('Invalid request', { status: 400, headers: corsHeaders });
  }
}