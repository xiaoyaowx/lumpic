'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

interface AlbumItem {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function AlbumsPage() {
  const router = useRouter();
  const [albums, setAlbums] = useState<AlbumItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<AlbumItem | null>(null);

  // 加载相册列表
  const loadAlbums = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/albums?${params}`);
      if (!response.ok) throw new Error('加载相册列表失败');

      const data = await response.json();
      setAlbums(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('加载相册列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, [pagination.page, pagination.pageSize, search]);

  // 删除相册
  const handleDelete = async (albumId: string) => {
    try {
      const response = await fetch(`/api/admin/albums/${albumId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('相册已删除');
      loadAlbums();
      setIsConfirmOpen(false);
      setAlbumToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除相册失败');
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (album: AlbumItem) => {
    setAlbumToDelete(album);
    setIsConfirmOpen(true);
  };

  // 查看相册详情
  const viewAlbumDetail = (album: AlbumItem) => {
    router.push(`/admin/albums/${album.id}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">相册管理</h1>
        
        {/* 搜索框 */}
        <div className="w-full sm:w-64 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索相册..."
            className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pr-10 transition-shadow duration-200"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* 相册列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : albums.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">封面</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">名称</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">图片数量</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">创建者</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">创建时间</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {albums.map((album) => (
                <tr key={album.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-4 pr-3 sm:pl-6">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100">
                      {album.coverUrl ? (
                        <Image
                          src={album.coverUrl}
                          alt={album.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full text-gray-400">
                          <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <div className="font-medium">{album.name}</div>
                    {album.description && (
                      <div className="text-gray-500 truncate max-w-xs" title={album.description}>
                        {album.description}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {album.imageCount} 张图片
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="truncate max-w-[200px]" title={album.user.email}>
                      {album.user.name || album.user.email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(album.createdAt), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => viewAlbumDetail(album)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                      >
                        <EyeIcon className="h-4 w-4" />
                        查看
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(album)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 分页 */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  显示第 <span className="font-medium">{(pagination.page - 1) * pagination.pageSize + 1}</span> 到{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.pageSize, pagination.total)}
                  </span>{' '}
                  条，共 <span className="font-medium">{pagination.total}</span> 条
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">上一页</span>
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">下一页</span>
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">暂无相册</h3>
          <p className="mt-1 text-sm text-gray-500">还没有任何相册</p>
        </div>
      )}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => albumToDelete && handleDelete(albumToDelete.id)}
        title="删除相册"
        message={`确定要删除相册"${albumToDelete?.name}"吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        type="danger"
      />
    </div>
  );
}
