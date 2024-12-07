import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 获取单张图片详情
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const image = await prisma.image.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        thumbnailUrl: true,
        albumId: true,
        exifData: true,
        album: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json({ error: '图片不存在' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('获取图片详情失败:', error);
    return NextResponse.json({ error: '获取图片详情失败' }, { status: 500 });
  }
}

// 更新图片信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { title, description, albumId } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const image = await prisma.image.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!image) {
      return NextResponse.json({ error: '图片不存在' }, { status: 404 });
    }

    // 如果指定了相册，确认相册存在且属于当前用户
    if (albumId) {
      const album = await prisma.album.findFirst({
        where: {
          id: albumId,
          userId: user.id,
        },
      });

      if (!album) {
        return NextResponse.json({ error: '相册不存在' }, { status: 404 });
      }
    }

    const updatedImage = await prisma.image.update({
      where: { id: params.id },
      data: {
        title,
        description,
        albumId: albumId || null,
      },
      include: {
        album: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedImage);
  } catch (error) {
    console.error('更新图片失败:', error);
    return NextResponse.json({ error: '更新图片失败' }, { status: 500 });
  }
}

// 删除图片
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const image = await prisma.image.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!image) {
      return NextResponse.json({ error: '图片不存在' }, { status: 404 });
    }

    // 删除图片文件
    // TODO: 实现文件删除逻辑

    // 删除数据库记录
    await prisma.image.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除图片失败:', error);
    return NextResponse.json({ error: '删除图片失败' }, { status: 500 });
  }
}
