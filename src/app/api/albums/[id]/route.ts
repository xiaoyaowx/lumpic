import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { deleteImage } from '@/lib/storage';
import path from 'path';

// 获取单个相册详情
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

    const album = await prisma.album.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            title: true,
            mimeType: true,
            size: true,
            createdAt: true,
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
    });

    if (!album) {
      return NextResponse.json({ error: '相册不存在' }, { status: 404 });
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error('获取相册详情失败:', error);
    return NextResponse.json({ error: '获取相册详情失败' }, { status: 500 });
  }
}

// 更新相册信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const album = await prisma.album.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!album) {
      return NextResponse.json({ error: '相册不存在' }, { status: 404 });
    }

    const updatedAlbum = await prisma.album.update({
      where: { id: params.id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(updatedAlbum);
  } catch (error) {
    console.error('更新相册失败:', error);
    return NextResponse.json({ error: '更新相册失败' }, { status: 500 });
  }
}

// 删除相册
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

    // 获取相册及其所有图片
    const album = await prisma.album.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        images: {
          select: {
            id: true,
            filename: true,
            title: true,
            mimeType: true,
            size: true,
            createdAt: true,
            url: true,
            thumbnailUrl: true,
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json({ error: '相册不存在' }, { status: 404 });
    }

    // 删除相册中的所有图片文件
    for (const image of album.images) {
      try {
        // 删除原图
        await deleteImage(image.url);
        // 删除缩略图
        await deleteImage(image.thumbnailUrl);
      } catch (error) {
        console.error(`删除图片文件失败: ${image.filename}`, error);
      }
    }

    // 使用事务删除相册及其所有图片记录
    await prisma.$transaction([
      prisma.image.deleteMany({
        where: { albumId: params.id },
      }),
      prisma.album.delete({
        where: { id: params.id },
      }),
    ]);

    return NextResponse.json({ message: '相册删除成功' });
  } catch (error) {
    console.error('删除相册失败:', error);
    return NextResponse.json({ error: '删除相册失败' }, { status: 500 });
  }
}
