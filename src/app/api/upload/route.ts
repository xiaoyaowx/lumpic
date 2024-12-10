import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import prisma from '@/lib/prisma';
import sharp from 'sharp';
import ExifParser from 'exif-parser';
import { ExifData } from '@/types/exif';
import { generateDateBasedPath } from '@/lib/storage';
import fs from 'fs/promises';

export async function POST(request: Request) {
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

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const albumId = formData.get('albumId') as string;

    if (!files || files.length === 0) {
      return NextResponse.json({ error: '没有上传文件' }, { status: 400 });
    }

    // 验证相册
    if (albumId) {
      const album = await prisma.album.findFirst({
        where: {
          id: albumId,
          userId: user.id,
        },
      });

      if (!album) {
        return NextResponse.json({ error: '相册不存在' }, { status: 404 });
      }
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
          throw new Error(`文件 ${file.name} 不是图片文件`);
        }

        // 验证文件大小（10MB）
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`文件 ${file.name} 超过10MB`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 使用新的基于日期的路径生成
        const { url: imageUrl, filePath: imagePath } = await generateDateBasedPath(file.name, 'image');
        const { url: thumbnailUrl, filePath: thumbnailPath } = await generateDateBasedPath(file.name, 'thumbnail');

        // 保存原始图片
        await fs.writeFile(imagePath, buffer);

        // 生成并保存缩略图
        const thumbnail = await sharp(buffer)
          .resize(300, 300, {
            fit: 'cover',
            position: 'centre',
          })
          .toBuffer();

        await fs.writeFile(thumbnailPath, thumbnail);

        // 获取图片基本信息
        const metadata = await sharp(buffer).metadata();

        // 提取EXIF数据
        let exifData: ExifData = {};
        let photoTakenAt: Date = new Date(); // 默认使用当前时间

        try {
          const parser = ExifParser.create(buffer);
          const result = parser.parse();
          
          // 处理拍摄时间
          if (result.tags.DateTimeOriginal) {
            const timestamp = result.tags.DateTimeOriginal;
            // 确保时间戳是有效的
            if (timestamp > 0) {
              const date = new Date(timestamp * 1000);
              // 如果转换后的日期有效，使用它
              if (!isNaN(date.getTime())) {
                photoTakenAt = date;
              }
            }
          }
          
          exifData = {
            make: result.tags.Make?.toString(),
            model: result.tags.Model?.toString(),
            exposureTime: result.tags.ExposureTime,
            fNumber: result.tags.FNumber,
            iso: result.tags.ISO,
            dateTimeOriginal: result.tags.DateTimeOriginal,
            focalLength: result.tags.FocalLength,
            lensModel: result.tags.LensModel?.toString(),
            gpsLatitude: result.tags.GPSLatitude,
            gpsLongitude: result.tags.GPSLongitude,
            width: metadata.width,
            height: metadata.height,
          };

          // 移除所有 undefined 值
          Object.keys(exifData).forEach(key => {
            if (exifData[key] === undefined) {
              delete exifData[key];
            }
          });
        } catch (error) {
          console.error('解析EXIF数据失败:', error);
        }

        // 创建图片记录
        const image = await prisma.image.create({
          data: {
            title: file.name,
            filename: file.name,
            url: imageUrl,
            thumbnailUrl: thumbnailUrl,
            mimeType: file.type,
            size: file.size,
            width: metadata.width,
            height: metadata.height,
            exifData: Object.keys(exifData).length > 0 ? exifData : undefined,
            photoTakenAt, // 使用从 EXIF 中提取的拍摄时间或默认的当前时间
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: user.id,
            albumId: albumId || null,
          },
          include: {
            album: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return image;
      })
    );

    return NextResponse.json({ 
      message: '上传成功', 
      images: uploadedImages 
    });

  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传失败' },
      { status: 500 }
    );
  }
}
