import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// 创建相册
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { name, description } = await request.json();
    if (!name) {
      return NextResponse.json({ error: '相册名称不能为空' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    const album = await prisma.album.create({
      data: {
        name,
        description,
        userId: user.id,
      },
      include: {
        _count: {
          select: { images: true }
        }
      }
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error('创建相册失败:', error);
    return NextResponse.json({ error: '创建相册失败' }, { status: 500 });
  }
}

// 获取用户的所有相册
export async function GET(request: Request) {
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

    const albums = await prisma.album.findMany({
      where: {
        userId: user.id,
      },
      include: {
        images: {
          take: 1,
          select: {
            url: true,
            thumbnailUrl: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: { images: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 转换数据结构，添加封面图
    const albumsWithCover = albums.map(album => ({
      ...album,
      coverImage: album.images[0]?.thumbnailUrl || null, // 使用缩略图作为封面
      images: undefined, // 移除原始的 images 数组
    }));

    return NextResponse.json(albumsWithCover);
  } catch (error) {
    console.error('获取相册列表失败:', error);
    return NextResponse.json({ error: '获取相册列表失败' }, { status: 500 });
  }
}
