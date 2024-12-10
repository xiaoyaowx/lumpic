import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { isAdmin } from '@/lib/utils';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

// 用户列表的查询参数验证
const querySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

// 创建用户的数据验证
const createUserSchema = z.object({
  name: z.string().min(2, '名称至少2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  role: z.enum(['USER', 'ADMIN']),
});

// 更新用户的数据验证
const updateUserSchema = z.object({
  name: z.string().min(2, '名称至少2个字符').optional(),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  password: z.string().min(6, '密码至少6个字符').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

// 获取用户列表
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = querySchema.parse({
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      search: searchParams.get('search') || undefined,
    });

    // 构建查询条件
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    // 查询总数
    const total = await prisma.user.count({ where });

    // 查询用户列表
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
        _count: {
          select: {
            images: true,
            albums: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });

    return NextResponse.json({
      data: users,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 创建用户
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const data = createUserSchema.parse(body);

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return new NextResponse('邮箱已存在', { status: 400 });
    }

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword: await bcrypt.hash(data.password, 10),
        role: data.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }
    console.error('Error in POST /api/admin/users:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
