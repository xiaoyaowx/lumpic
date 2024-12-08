import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return new NextResponse("Invalid file type. Only JPEG, PNG and WebP are allowed", { status: 400 });
    }

    // 读取文件内容
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 使用 sharp 处理图片
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // 确保输出格式为 WebP
    const processedImage = await image
      .resize(200, 200, {
        fit: 'cover',
        position: 'centre'
      })
      .webp({ quality: 80 })
      .toBuffer();

    // 创建上传目录（如果不存在）
    const uploadDir = join(process.cwd(), 'public', 'avatars');
    await createDirIfNotExists(uploadDir);

    // 生成唯一文件名
    const fileName = `${session.user.id}-${Date.now()}.webp`;
    const filePath = join(uploadDir, fileName);

    // 保存文件
    await writeFile(filePath, processedImage);

    // 更新数据库中的头像URL
    const avatarUrl = `/avatars/${fileName}`;
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        image: avatarUrl,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function createDirIfNotExists(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}
