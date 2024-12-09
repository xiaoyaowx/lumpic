import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from '../../auth/auth.config';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user?.hashedPassword) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    // 验证当前密码
    const isCorrectPassword = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );

    if (!isCorrectPassword) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    // 更新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        hashedPassword,
      },
    });

    return new NextResponse("Password updated", { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
