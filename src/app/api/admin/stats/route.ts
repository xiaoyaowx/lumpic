export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { isAdmin } from '@/lib/utils';

// 获取管理后台统计数据
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 获取统计数据
    const [
      userCount,
      imageCount,
      albumCount,
      totalStorage,
      recentUsers,
      recentImages,
    ] = await Promise.all([
      // 用户总数
      prisma.user.count(),
      // 图片总数
      prisma.image.count(),
      // 相册总数
      prisma.album.count(),
      // 存储使用量（字节）
      prisma.image.aggregate({
        _sum: {
          size: true,
        },
      }),
      // 最近注册的用户
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          _count: {
            select: {
              images: true,
              albums: true,
            },
          },
        },
      }),
      // 最近上传的图片
      prisma.image.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          filename: true,
          thumbnailUrl: true,
          size: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      stats: {
        userCount,
        imageCount,
        albumCount,
        totalStorage: totalStorage._sum.size || 0,
      },
      recentUsers,
      recentImages,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
