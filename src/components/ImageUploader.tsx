'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

interface Album {
  id: string;
  name: string;
}

interface Image {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl: string;
}

interface ImageUploaderProps {
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  onUploadSuccess?: (images: Image[]) => void;
  albumId?: string;
  hideAlbumSelect?: boolean;
  buttonClassName?: string;
  buttonText?: string;
}

export default function ImageUploader({
  onUploadStart,
  onUploadEnd,
  onUploadSuccess,
  albumId,
  hideAlbumSelect = false,
  buttonClassName = 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors',
  buttonText = '上传图片'
}: ImageUploaderProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | undefined>(albumId);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!hideAlbumSelect) {
      fetchAlbums();
    }
  }, [hideAlbumSelect]);

  useEffect(() => {
    setSelectedAlbumId(albumId);
  }, [albumId]);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/albums');
      if (!response.ok) {
        throw new Error('获取图库列表失败');
      }
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      toast.error('获取图库列表失败');
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    onUploadStart?.();

    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('files', file);
      });

      if (selectedAlbumId) {
        formData.append('albumId', selectedAlbumId);
      }

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      toast.success('上传成功');
      onUploadSuccess?.(data);
    } catch (error) {
      console.error('上传错误:', error);
      toast.error('上传失败');
    } finally {
      setIsUploading(false);
      onUploadEnd?.();
    }
  }, [selectedAlbumId, onUploadStart, onUploadEnd, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <button
            type="button"
            className={buttonClassName}
            disabled={isUploading}
          >
            {isUploading ? '上传中...' : buttonText}
          </button>
          <p className="text-sm text-gray-500">
            {isDragActive ? '松开鼠标上传图片' : '或将图片拖放到此处'}
          </p>
          <p className="text-xs text-gray-400">
            支持 PNG、JPG、GIF、WebP 格式，单个文件最大 10MB
          </p>
        </div>
      </div>

      {!hideAlbumSelect && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            选择图库
          </label>
          <select
            value={selectedAlbumId || ''}
            onChange={(e) => setSelectedAlbumId(e.target.value || undefined)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">未分类</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                {album.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
