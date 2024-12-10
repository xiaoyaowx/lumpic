import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';
import { deleteImage } from '@/lib/storage';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { generateDateBasedPath } from '@/lib/storage';
import fs from 'fs/promises';
import sharp from 'sharp';

// 获取单张图片详情
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

    const image = await prisma.image.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        thumbnailUrl: true,
        albumId: true,
        exifData: true,
        album: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!image) {
      return NextResponse.json({ error: '图片不存在' }, { status: 404 });
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('获取图片详情失败:', error);
    return NextResponse.json({ error: '获取图片详情失败' }, { status: 500 });
  }
}

// 更新图片信息
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const albumId = formData.get("albumId") as string;

    if (!file) {
      return new Response(JSON.stringify({ error: "No file uploaded" }), {
        status: 400,
      });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // 使用新的基于日期的路径生成
    const { url: imageUrl, filePath: imagePath } = await generateDateBasedPath(file.name, 'image');
    const { url: thumbnailUrl, filePath: thumbnailPath } = await generateDateBasedPath(file.name, 'thumbnail');

    // 保存原始图片
    await fs.writeFile(imagePath, buffer);

    // 生成并保存缩略图
    const thumbnail = await sharp(buffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .toBuffer();
    await fs.writeFile(thumbnailPath, thumbnail);

    // 更新数据库记录
    const image = await prisma.image.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url: imageUrl,
        thumbnailUrl,
        albumId: albumId || null,
        status: "ACTIVE",
      },
    });

    return new Response(JSON.stringify(image), {
      status: 200,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to upload image" }),
      { status: 500 }
    );
  }
}

// 删除图片
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 检查用户权限
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

    // 查找图片并验证所有权
    const image = await prisma.image.findFirst({
      where: {
        id: params.id,
        userId: user.id, // 确保只能删除自己的图片
      },
    });

    if (!image) {
      return NextResponse.json({ error: '图片不存在或无权限删除' }, { status: 404 });
    }

    // 删除图片文件
    try {
      await deleteImage(image.url);
      if (image.thumbnailUrl) {
        await deleteImage(image.thumbnailUrl);
      }
    } catch (error) {
      console.error('删除图片文件失败:', error);
      // 继续执行数据库删除操作
    }

    // 删除数据库记录
    await prisma.image.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除图片失败:', error);
    return NextResponse.json({ error: '删除图片失败' }, { status: 500 });
  }
}
