import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';

// 获取标签列表
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * pageSize;

    // 构建查询条件
    const where = {
      OR: search
        ? [
            {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
    };

    // 获取总数
    const total = await prisma.tag.count({ where });

    // 获取分页数据
    const tags = await prisma.tag.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            images: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: tags,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 创建标签
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    // 检查标签名是否已存在
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      return new NextResponse('标签已存在', { status: 400 });
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
