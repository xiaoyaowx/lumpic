import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/auth.config';

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

    const images = await prisma.image.findMany({
      where: {
        albumId: params.id,
        album: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('获取相册图片列表失败:', error);
    return NextResponse.json(
      { error: '获取相册图片列表失败' },
      { status: 500 }
    );
  }
}
