'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ExifDataDisplay from '@/components/ExifDataDisplay';
import { toast } from 'react-hot-toast';

interface ImageDetails {
  id: string;
  url: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  exifData: any;
  albumId: string | null;
  album?: {
    id: string;
    name: string;
  };
}

export default function ImagePage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [image, setImage] = useState<ImageDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchImage();
    }
  }, [status, params.id]);

  const fetchImage = async () => {
    try {
      const response = await fetch(`/api/image/${params.id}`);
      if (!response.ok) {
        throw new Error('图片不存在');
      }
      const data = await response.json();
      setImage(data);
    } catch (error) {
      console.error('获取图片失败:', error);
      toast.error('获取图片失败');
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !image) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900 flex items-center transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回
            </button>
            {image.album && (
              <div className="flex items-center">
                <span className="text-gray-400 mx-2">/</span>
                <Link
                  href={`/albums/${image.album.id}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  {image.album.name}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr]">
            {/* 图片显示区域 */}
            <div className="relative min-h-[600px] lg:min-h-[800px] bg-gray-100">
              {/* 缩略图（模糊） */}
              <Image
                src={image.thumbnailUrl}
                alt={image.title || '图片'}
                fill
                className="object-contain transition-opacity duration-300"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                style={{ filter: 'blur(10px)', opacity: isImageLoading ? 1 : 0 }}
              />
              {/* 高清图 */}
              <Image
                src={image.url}
                alt={image.title || '图片'}
                fill
                className="object-contain transition-opacity duration-300"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                onLoadingComplete={() => setIsImageLoading(false)}
                style={{ opacity: isImageLoading ? 0 : 1 }}
              />
              {/* 加载指示器 */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-500"></div>
                </div>
              )}
            </div>

            {/* 图片信息区域 */}
            <div className="p-8 lg:border-l border-gray-100">
              <div className="space-y-8">
                {/* 标题和描述 */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {image.title || '未命名图片'}
                  </h1>
                  {image.description && (
                    <p className="text-lg text-gray-600">
                      {image.description}
                    </p>
                  )}
                </div>
                
                {/* 所属相册 */}
                <div className="border-t border-gray-100 pt-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg
                      className="w-4 h-4 mr-2"
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
                    <span className="mr-2">所属相册:</span>
                    {image.album ? (
                      <Link
                        href={`/albums/${image.album.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 hover:underline inline-flex items-center group"
                      >
                        {image.album.name}
                      </Link>
                    ) : (
                      <span className="text-gray-400">未分类</span>
                    )}
                  </div>
                </div>

                {/* EXIF 数据 */}
                {image.exifData && (
                  <div className="border-t border-gray-100 pt-6">
                    <ExifDataDisplay exifData={image.exifData} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
