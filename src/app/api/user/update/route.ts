import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const { name, image, currentPassword, newPassword } = data;

    // 准备更新数据
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;

    // 如果要更新密码
    if (currentPassword && newPassword) {
      // 获取用户当前密码hash
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { hashedPassword: true }
      });

      if (!user) {
        return new NextResponse("User not found", { status: 404 });
      }

      // 验证当前密码
      const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword || '');
      if (!isPasswordValid) {
        return new NextResponse("Current password is incorrect", { status: 400 });
      }

      // 生成新密码的hash
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.hashedPassword = hashedPassword;
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse(error instanceof Error ? error.message : "Internal Error", { status: 500 });
  }
}
