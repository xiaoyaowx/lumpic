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
      const response = await fetch(`/api/images/${params.id}`);
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
    <div className="p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-1"
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
                <Link
                  href={`/albums/${image.album.id}`}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {image.album.name}
                </Link>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 图片显示区域 */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={image.url}
                alt={image.title || '图片'}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            {/* 图片信息区域 */}
            <div className="space-y-6">
              {/* 标题和描述 */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {image.title || '未命名图片'}
                  </h2>
                  {image.description && (
                    <p className="mt-2 text-gray-500">{image.description}</p>
                  )}
                </div>

                {/* 所属图库 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500">所属图库</h3>
                  {image.album ? (
                    <Link
                      href={`/albums/${image.album.id}`}
                      className="mt-1 text-blue-500 hover:text-blue-600 block"
                    >
                      {image.album.name}
                    </Link>
                  ) : (
                    <p className="mt-1 text-gray-500">未分类</p>
                  )}
                </div>

                {/* EXIF 数据 */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    图片信息
                  </h3>
                  <ExifDataDisplay exifData={image.exifData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
