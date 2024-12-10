import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import prisma from '@/lib/prisma';
import { deleteImage } from '@/lib/storage';

// DELETE /api/admin/images/[id] - 删除图片
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 查找图片
    const image = await prisma.image.findUnique({
      where: { id: params.id },
    });

    if (!image) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // 删除存储中的图片文件
    await deleteImage(image.url);
    if (image.thumbnailUrl) {
      await deleteImage(image.thumbnailUrl);
    }

    // 删除数据库中的图片记录
    await prisma.image.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/admin/images/[id]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
