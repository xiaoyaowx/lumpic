import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

// 更新标签
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // 检查标签名是否已存在（排除当前标签）
    const existingTag = await prisma.tag.findFirst({
      where: {
        name,
        NOT: {
          id: params.id,
        },
      },
    });

    if (existingTag) {
      return new NextResponse('Tag name already exists', { status: 400 });
    }

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 删除标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prisma.tag.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
