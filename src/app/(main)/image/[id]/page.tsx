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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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
          {/* 图片显示区域 */}
          <div className="relative aspect-[16/9] bg-black">
            <Image
              src={image.url}
              alt={image.title || '图片'}
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>

          {/* 图片信息区域 */}
          <div className="p-8">
            <div className="max-w-5xl mx-auto">
              {/* 标题、描述和相册信息 */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12">
                <div className="flex-1 space-y-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {image.title || '未命名图片'}
                  </h1>
                  {image.description && (
                    <p className="text-lg text-gray-600 max-w-2xl">
                      {image.description}
                    </p>
                  )}
                  
                  {/* 所属相册 */}
                  <div className="pt-2">
                    <div className="inline-flex items-center text-sm text-gray-500">
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
                          <svg
                            className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </Link>
                      ) : (
                        <span className="text-gray-500 italic">未分类</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXIF 数据 */}
              <div>
                <ExifDataDisplay exifData={image.exifData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
