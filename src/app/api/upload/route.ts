import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth.config';
import prisma from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';
import sharp from 'sharp';
import ExifParser from 'exif-parser';
import { ExifData } from '@/types/exif';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const THUMBNAIL_DIR = join(process.cwd(), 'public', 'thumbnails');

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
        const fileId = nanoid();
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${fileId}.${extension}`;
        const thumbnailFilename = `${fileId}_thumb.${extension}`;

        // 保存原始图片
        await writeFile(join(UPLOAD_DIR, filename), buffer);

        // 生成缩略图
        const thumbnail = await sharp(buffer)
          .resize(300, 300, {
            fit: 'cover',
            position: 'centre',
          })
          .toBuffer();

        await writeFile(join(THUMBNAIL_DIR, thumbnailFilename), thumbnail);

        // 提取EXIF数据
        let exifData: ExifData = {};
        try {
          const parser = ExifParser.create(buffer);
          const result = parser.parse();
          const metadata = await sharp(buffer).metadata();
          
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
            software: result.tags.Software?.toString(),
            orientation: result.tags.Orientation,
            flash: result.tags.Flash,
            meteringMode: result.tags.MeteringMode?.toString(),
            whiteBalance: result.tags.WhiteBalance?.toString(),
            imageDescription: result.tags.ImageDescription?.toString(),
            copyright: result.tags.Copyright?.toString(),
          };

          // 移除所有 undefined 值
          Object.keys(exifData).forEach(key => {
            if (exifData[key] === undefined) {
              delete exifData[key];
            }
          });
        } catch (error) {
          console.warn('无法解析EXIF数据:', error);
        }

        // 获取图片尺寸
        const metadata = await sharp(buffer).metadata();

        // 保存到数据库
        return prisma.image.create({
          data: {
            userId: user.id,
            albumId: albumId || null,
            title: file.name,
            filename,
            url: `/uploads/${filename}`,
            thumbnailUrl: `/thumbnails/${thumbnailFilename}`,
            mimeType: file.type,
            size: file.size,
            width: metadata.width || 0,
            height: metadata.height || 0,
            exifData: Object.keys(exifData).length > 0 ? exifData as any : undefined,
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
      })
    );

    return NextResponse.json(uploadedImages);
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传失败，请稍后重试' },
      { status: 500 }
    );
  }
}
