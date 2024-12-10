import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/auth.config';
import prisma from '@/lib/prisma';
import { deleteImage } from '@/lib/storage';

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

    // 检查相册是否存在
    const album = await prisma.album.findFirst({
      where: {
        id: params.id,
      },
      include: {
        images: true,
      },
    });

    if (!album) {
      return NextResponse.json({ error: '相册不存在' }, { status: 404 });
    }

    // 开启事务，删除相册和相关图片的关联
    await prisma.$transaction([
      // 更新所有相关图片，移除相册关联
      prisma.image.updateMany({
        where: {
          albumId: params.id,
        },
        data: {
          albumId: null,
        },
      }),
      // 删除相册
      prisma.album.delete({
        where: {
          id: params.id,
        },
      }),
    ]);

    // 删除相册中的所有图片文件
    for (const image of album.images) {
      try {
        // 删除原图和缩略图
        await Promise.all([
          deleteImage(image.url, true),
          deleteImage(image.thumbnailUrl, true),
        ]);
      } catch (error) {
        console.error(`删除图片文件失败: ${image.url}`, error);
      }
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('删除相册失败:', error);
    return NextResponse.json({ error: '删除相册失败' }, { status: 500 });
  }
}
