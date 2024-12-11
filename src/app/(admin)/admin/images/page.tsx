'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { ChevronLeftIcon, ChevronRightIcon, MagnifyingGlassIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ImageItem {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  thumbnailUrl: string;
  size: number;
  width: number;
  height: number;
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
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function ImagesPage() {
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 10, 
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageItem | null>(null);

  // 加载图片列表
  const loadImages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/images?${params}`);
      if (!response.ok) throw new Error('加载图片列表失败');

      const data = await response.json();
      // API 返回的是按日期分组的数据，我们需要展平为列表
      const flattenedImages = data.groups.flatMap((group: { images: ImageItem[] }) => group.images);
      setImages(flattenedImages);
      setPagination({
        currentPage: data.currentPage,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });
    } catch (error) {
      toast.error('加载图片列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, [pagination.currentPage, pagination.pageSize, search]);

  // 删除图片
  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('图片已删除');
      loadImages();
      setIsConfirmOpen(false);
      setImageToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除图片失败');
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (image: ImageItem) => {
    setImageToDelete(image);
    setIsConfirmOpen(true);
  };

  // 查看图片详情
  const viewImageDetail = (image: ImageItem) => {
    window.open(image.url, '_blank');
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">图片管理</h1>
        
        {/* 搜索框 */}
        <div className="w-full sm:w-64 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索图片..."
            className="w-full rounded-lg border-0 py-2.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 pr-10 transition-shadow duration-200"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* 图片列表 */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      ) : images.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">缩略图</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">标题</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">尺寸</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">大小</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">上传者</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">上传时间</th>
                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {images.map((image) => (
                <tr key={image.id} className="hover:bg-gray-50">
                  <td className="py-4 pl-4 pr-3 sm:pl-6">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={image.thumbnailUrl}
                        alt={image.title || ''}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <div className="font-medium">{image.title}</div>
                    {image.description && (
                      <div className="text-gray-500 truncate max-w-xs" title={image.description}>
                        {image.description}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {image.width && image.height ? `${image.width}x${image.height}` : '未知'}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {formatFileSize(image.size)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="truncate max-w-[200px]" title={image.user.email}>
                      {image.user.name || image.user.email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(image.createdAt), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => viewImageDetail(image)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(image)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无图片数据</p>
        </div>
      )}

      {/* 分页 */}
      {!loading && images.length > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                显示第{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * pagination.pageSize + 1}
                </span>{' '}
                到{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * pagination.pageSize, pagination.total)}
                </span>{' '}
                条，共{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                条
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                  disabled={pagination.currentPage === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">上一页</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">下一页</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setImageToDelete(null);
        }}
        onConfirm={() => imageToDelete && handleDelete(imageToDelete.id)}
        title="删除图片"
        message={`确定要删除图片"${imageToDelete?.title}"吗？此操作不可撤销。`}
      />
    </div>
  );
}
