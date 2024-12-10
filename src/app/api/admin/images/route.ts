import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

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

    // 查询图片列表
    const images = await prisma.image.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc' as Prisma.SortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      data: images,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/images:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
