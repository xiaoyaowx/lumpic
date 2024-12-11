import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/auth.config';
import prisma from '@/lib/prisma';
import { ImageList } from '@/components/ImageList';

async function getImages() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { groups: [] };
  }

  const images = await prisma.image.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      title: true,
      url: true,
      thumbnailUrl: true,
      photoTakenAt: true,
    },
    orderBy: {
      photoTakenAt: 'desc',
    },
  });

  // 将图片按日期分组
  const groupedImages = images.reduce((groups, image) => {
    // 确保 photoTakenAt 是 Date 对象
    const photoTakenAt = image.photoTakenAt instanceof Date 
      ? image.photoTakenAt 
      : new Date(image.photoTakenAt);
    
    const date = photoTakenAt.toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push({
      ...image,
      photoTakenAt, // 使用处理后的 Date 对象
    });
    return groups;
  }, {} as Record<string, typeof images>);

  // 按日期降序排序
  const sortedDates = Object.keys(groupedImages).sort((a, b) => b.localeCompare(a));

  return {
    groups: sortedDates.map(date => ({
      date,
      images: groupedImages[date],
    })),
  };
}

export default async function HomePage() {
  const { groups } = await getImages();

  return (
    <main className="w-full -mt-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 py-6">我的照片</h1>
      <Suspense fallback={<div className="text-center py-8">加载中...</div>}>
        <ImageList groups={groups} />
      </Suspense>
    </main>
  );
}
