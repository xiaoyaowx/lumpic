'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';

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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; albumId: string | null }>({
    isOpen: false,
    albumId: null
  });

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

  const handleDeleteClick = (e: React.MouseEvent, albumId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, albumId });
  };

  const confirmDelete = async () => {
    const albumId = deleteConfirm.albumId;
    if (!albumId) return;

    try {
      setIsDeleting(albumId);
      const response = await fetch(`/api/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除相册失败');
      }

      // 从本地状态中移除相册
      setAlbums(albums.filter(album => album.id !== albumId));
      toast.success('相册已删除');
    } catch (error) {
      console.error('删除相册失败:', error);
      toast.error('删除相册失败');
    } finally {
      setIsDeleting(null);
      setDeleteConfirm({ isOpen: false, albumId: null });
    }
  };

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
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 relative group">
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleDeleteClick(e, album.id)}
                      className="p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-colors duration-200 disabled:opacity-50"
                      disabled={isDeleting === album.id}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
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
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, albumId: null })}
        onConfirm={confirmDelete}
        title="删除相册"
        message="确定要删除这个相册吗？此操作将同时删除相册中的所有图片，且不可恢复。"
        confirmText="删除"
        cancelText="取消"
        type="danger"
      />
    </div>
  );
}
