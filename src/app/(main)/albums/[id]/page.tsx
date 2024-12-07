'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ImageUploader from '@/components/ImageUploader';

interface Album {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  images: {
    id: string;
    filename: string;
    title: string | null;
    mimeType: string;
    size: number;
    createdAt: string;
    url: string;
  }[];
}

export default function AlbumPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchAlbum = async () => {
    try {
      const response = await fetch(`/api/albums/${params.id}`);
      if (!response.ok) {
        throw new Error('获取相册失败');
      }
      const data = await response.json();
      setAlbum(data);
    } catch (error) {
      console.error('获取相册失败:', error);
      toast.error('获取相册失败');
      router.push('/albums');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchAlbum();
    }
  }, [status, params.id]);

  const handleUploadSuccess = async (images: any[]) => {
    // 重新获取相册数据
    await fetchAlbum();
    toast.success(`成功上传 ${images.length} 张图片`);
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      setIsDeleting(imageId);
      const response = await fetch(`/api/image/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除图片失败');
      }

      // 从本地状态中移除图片
      setAlbum(prev => 
        prev ? {
          ...prev,
          images: prev.images.filter(img => img.id !== imageId),
          _count: {
            ...prev._count,
            images: prev._count.images - 1
          }
        } : null
      );
      
      toast.success('图片已删除');
    } catch (error) {
      console.error('删除图片失败:', error);
      toast.error('删除图片失败');
    } finally {
      setIsDeleting(null);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">相册不存在</h2>
          <p className="mt-2 text-gray-500">该相册可能已被删除或您没有访问权限</p>
          <Link
            href="/albums"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            返回相册列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* 标题部分 */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{album.name}</h1>
            <Link
              href="/albums"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              返回相册列表
            </Link>
          </div>
          {album.description && (
            <p className="text-sm text-gray-500">{album.description}</p>
          )}
        </div>

        {/* 上传组件 */}
        <div className="mb-8">
          <ImageUploader
            albumId={params.id}
            onUploadSuccess={handleUploadSuccess}
            buttonClassName="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            buttonText="上传图片"
          />
        </div>

        {/* 图片网格 */}
        {album.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {album.images.map((image) => (
              <div
                key={image.id}
                className="relative group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <Link href={`/image/${image.id}`} className="block relative">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <Image
                      src={image.url}
                      alt={image.title || image.filename}
                      width={400}
                      height={225}
                      className="object-cover w-full h-full"
                      priority
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {image.title || image.filename}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500 space-y-1">
                      <p>{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p>{new Date(image.createdAt).toLocaleDateString()}</p>
                      <p>{image.mimeType}</p>
                    </div>
                  </div>
                </Link>
                {/* 删除按钮 - 优化位置和样式 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteImage(image.id);
                    }}
                    disabled={isDeleting === image.id}
                    className="p-1.5 rounded-full hover:bg-black/50 transition-colors duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    title="删除图片"
                  >
                    {isDeleting === image.id ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <svg
                        className="h-5 w-5 text-white filter drop-shadow-md"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              暂无图片
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              开始上传图片到这个相册吧
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
