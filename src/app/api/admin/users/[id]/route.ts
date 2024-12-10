import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import { isAdmin } from '@/lib/utils';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

// 更新用户的数据验证
const updateUserSchema = z.object({
  name: z.string().min(2, '名称至少2个字符').optional(),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  password: z.string().min(6, '密码至少6个字符').optional(),
  role: z.enum(['USER', 'ADMIN']).optional(),
});

// 更新用户
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const data = updateUserSchema.parse(body);

    // 如果要更新邮箱，检查是否已存在
    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingUser) {
        return new NextResponse('邮箱已存在', { status: 400 });
      }
    }

    // 准备更新数据
    const updateData: any = { ...data };
    if (data.password) {
      updateData.hashedPassword = await bcrypt.hash(data.password, 10);
      delete updateData.password;
    }

    // 更新用户
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
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
    console.error('Error in PUT /api/admin/users/[id]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// 删除用户
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !isAdmin(session)) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 检查是否为最后一个管理员
    if (session.user.id === params.id) {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });
      if (adminCount <= 1) {
        return new NextResponse('不能删除最后一个管理员', { status: 400 });
      }
    }

    // 删除用户
    await prisma.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error in DELETE /api/admin/users/[id]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
