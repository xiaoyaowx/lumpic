'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ImageData {
  id: string;
  title?: string;
  url: string;
  thumbnailUrl: string;
  description?: string;
  albumId?: string;
  album?: {
    id: string;
    name: string;
  };
}

interface ImageGridProps {
  images: ImageData[];
  onImageClick?: (image: ImageData) => void;
  isLoading?: boolean;
  gridCols?: 4 | 6;
}

export default function ImageGrid({ images, onImageClick, isLoading = false, gridCols = 4 }: ImageGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const gridClassName = gridCols === 6
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';

  if (isLoading) {
    return (
      <div className={gridClassName}>
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">暂无图片</p>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group cursor-pointer aspect-square bg-gray-100 rounded-lg overflow-hidden"
          onClick={() => onImageClick?.(image)}
          onMouseEnter={() => setHoveredId(image.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Image
            src={image.thumbnailUrl}
            alt={image.title || '图片'}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-200 group-hover:scale-110"
          />
          
          {/* 图片信息浮层 */}
          {hoveredId === image.id && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-4 transition-opacity">
              <div className="text-white">
                {image.title && (
                  <h3 className="text-sm font-medium truncate">
                    {image.title}
                  </h3>
                )}
                {image.album && (
                  <p className="text-xs text-gray-300 mt-1">
                    {image.album.name}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
