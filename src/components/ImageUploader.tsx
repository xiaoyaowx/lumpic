'use client';

import { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

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
  albumId: string;
  buttonClassName?: string;
  buttonText?: string;
}

export default function ImageUploader({
  onUploadStart,
  onUploadEnd,
  onUploadSuccess,
  albumId,
  buttonClassName = 'bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors',
  buttonText = '上传图片'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploading(true);
    onUploadStart?.();

    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('files', file);
      });

      formData.append('albumId', albumId);

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
  }, [albumId, onUploadStart, onUploadEnd, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
      }`}
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
          {isDragging ? '松开以上传图片' : '或将图片拖放到此处'}
        </p>
        <p className="text-xs text-gray-400">
          支持 PNG、JPG、GIF、WebP 格式，单个文件最大 10MB
        </p>
      </div>
    </div>
  );
}
