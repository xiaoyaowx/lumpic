import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

// 获取图片的标签
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const imageTags = await prisma.imageTag.findMany({
      where: {
        imageId: params.id,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(imageTags.map((it) => it.tag));
  } catch (error) {
    console.error('Error fetching image tags:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 更新图片的标签
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { tagIds } = await request.json();

    // 验证图片所有权
    const image = await prisma.image.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    if (image.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // 删除所有现有标签
    await prisma.imageTag.deleteMany({
      where: {
        imageId: params.id,
      },
    });

    // 添加新标签
    if (tagIds && tagIds.length > 0) {
      await prisma.imageTag.createMany({
        data: tagIds.map((tagId: string) => ({
          imageId: params.id,
          tagId,
        })),
      });
    }

    // 获取更新后的标签
    const updatedImageTags = await prisma.imageTag.findMany({
      where: {
        imageId: params.id,
      },
      include: {
        tag: true,
      },
    });

    return NextResponse.json(updatedImageTags.map((it) => it.tag));
  } catch (error) {
    console.error('Error updating image tags:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
