'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
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
    } else if (status === 'authenticated') {
      fetchAlbums();
    }
  }, [status]);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/albums');
      if (!response.ok) {
        throw new Error('获取图库列表失败');
      }
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('获取图库列表失败:', error);
      toast.error('获取图库列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">图库管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理和组织你的图片集</p>
          </div>
          <Link
            href="/albums/new"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            创建图库
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/albums/${album.id}`}
              className="block group"
            >
              <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative bg-gray-100">
                  {album.coverImage ? (
                    <img
                      src={album.coverImage}
                      alt={album.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg
                        className="w-12 h-12"
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
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {album.name}
                  </h3>
                  {album.description && (
                    <p className="mt-1 text-sm text-gray-500">
                      {album.description}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-500">
                    {album._count.images} 张图片
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {albums.length === 0 && (
            <div className="col-span-full text-center py-12">
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                还没有图库
              </h3>
              <p className="mt-2 text-gray-500">开始创建你的第一个图库吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
