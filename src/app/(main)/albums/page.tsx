'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Album {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  createdAt: string;
  _count: {
    images: number;
  };
}

export default function AlbumsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    const fetchAlbums = async () => {
      try {
        const response = await fetch('/api/albums');
        if (!response.ok) {
          throw new Error('获取相册列表失败');
        }
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('获取相册列表失败:', error);
        toast.error('获取相册列表失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">我的相册</h1>
            <p className="mt-1 text-sm text-gray-500">管理和组织你的图片集合</p>
          </div>
          <Link
            href="/albums/new"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            创建新相册
          </Link>
        </div>

        {albums.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">暂无相册</h3>
            <p className="mt-1 text-sm text-gray-500">开始创建你的第一个相册吧</p>
            <div className="mt-6">
              <Link
                href="/albums/new"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                创建新相册
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album, index) => (
              <Link
                key={album.id}
                href={`/albums/${album.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="relative w-full pt-[56.25%]">
                    {album.coverImage ? (
                      <Image
                        src={album.coverImage}
                        alt={album.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                        priority={index < 6}
                        style={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0 }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <svg
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      {album.name}
                    </h3>
                    <div className="h-[3em] mb-2">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {album.description || '暂无描述'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{album._count.images} 张图片</span>
                      <span>{new Date(album.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
