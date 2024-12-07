'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ImageGrid from '@/components/ImageGrid';
import toast from 'react-hot-toast';

interface Image {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchImages();
    }
  }, [status]);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/image');
      if (!response.ok) {
        throw new Error('获取图片列表失败');
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('获取图片列表失败:', error);
      toast.error('获取图片列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="p-6 pt-24">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="p-6 pt-24">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">所有图片</h1>
          <p className="text-sm text-gray-500">{images.length} 张图片</p>
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="bg-white p-6 rounded-lg">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">还没有图片</h3>
              <p className="mt-2 text-gray-500">
                前往相册上传你的第一张图片吧
              </p>
            </div>
          </div>
        ) : (
          <ImageGrid
            images={images}
            gridCols={6}
            onImageClick={(image) => router.push(`/image/${image.id}`)}
          />
        )}
      </div>
    </div>
  );
}
