import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { format } from 'date-fns';

// GET /api/admin/images - 获取图片列表
export async function GET(request: Request) {
  try {
    // 检查管理员权限
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || '';

    // 构建查询条件
    const where: Prisma.ImageWhereInput = search ? {
      OR: [
        {
          title: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive' as Prisma.QueryMode,
          },
        },
        {
          user: {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive' as Prisma.QueryMode,
                },
              },
            ],
          },
        },
      ],
    } : {};

    // 查询总数
    const total = await prisma.image.count({ where });

    // 查询图片列表，并按拍摄时间分组
    const images = await prisma.image.findMany({
      where,
      select: {
        id: true,
        title: true,
        filename: true,
        url: true,
        thumbnailUrl: true,
        mimeType: true,
        size: true,
        width: true,
        height: true,
        photoTakenAt: true,
        createdAt: true,
        exifData: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        photoTakenAt: 'desc' as Prisma.SortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // 将图片按日期分组
    const groupedImages = images.reduce((groups, image) => {
      const date = format(image.photoTakenAt, 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(image);
      return groups;
    }, {} as Record<string, typeof images>);

    // 转换为数组格式并按日期排序
    const result = Object.entries(groupedImages).map(([date, images]) => ({
      date,
      images,
    })).sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
      pageSize,
      groups: result,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/images:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
