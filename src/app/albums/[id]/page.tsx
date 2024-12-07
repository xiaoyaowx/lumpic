'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ImageGrid from '@/components/ImageGrid';
import ImageUploader from '@/components/ImageUploader';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface Album {
  id: string;
  name: string;
  description?: string;
  images: Image[];
  _count: {
    images: number;
  };
}

interface Image {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl: string;
}

export default function AlbumPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchAlbumAndImages();
    }
  }, [status, params.id]);

  const fetchAlbumAndImages = async () => {
    try {
      const albumResponse = await fetch(`/api/albums/${params.id}`);

      if (!albumResponse.ok) {
        throw new Error('获取图库信息失败');
      }

      const albumData = await albumResponse.json();
      setAlbum(albumData);
    } catch (error) {
      toast.error('获取图库信息失败');
      router.push('/albums');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (newImages: Image[]) => {
    setAlbum((prevAlbum) => {
      if (!prevAlbum) return null;
      return {
        ...prevAlbum,
        images: [...prevAlbum.images, ...newImages],
        _count: {
          images: prevAlbum._count.images + newImages.length
        }
      };
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900">图库不存在</h2>
            <p className="mt-2 text-gray-600">该图库可能已被删除或您没有访问权限</p>
            <Link
              href="/albums"
              className="mt-4 inline-block text-blue-500 hover:text-blue-600"
            >
              返回图库列表
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">{album.name}</h1>
                <span className="text-sm text-gray-500">
                  {album._count.images} 张图片
                </span>
              </div>
              {album.description && (
                <p className="mt-1 text-gray-500">{album.description}</p>
              )}
            </div>
            <Link
              href="/albums"
              className="text-gray-600 hover:text-gray-900"
            >
              返回图库列表
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          <ImageUploader
            onUploadSuccess={handleUploadSuccess}
            albumId={params.id}
            buttonText="上传图片"
            buttonClassName="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          />

          {album.images.length > 0 ? (
            <ImageGrid
              images={album.images}
              onImageClick={(image) => router.push(`/image/${image.id}`)}
              gridCols={6}
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500">暂无图片，点击上方按钮上传</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
