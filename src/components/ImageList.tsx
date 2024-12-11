'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ImageListProps {
  groups: {
    date: string;
    images: Array<{
      id: string;
      title: string | null;
      url: string;
      thumbnailUrl: string;
      photoTakenAt: Date | string;
    }>;
  }[];
}

export function ImageList({ groups }: ImageListProps) {
  // 计算总图片数
  const totalImages = groups.reduce((sum, group) => sum + group.images.length, 0);

  if (!groups.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-block p-12 rounded-lg bg-gray-50">
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">还没有图片</h3>
          <p className="mt-2 text-sm text-gray-500">
            开始上传你的第一张照片吧
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 页面标题栏 */}
      <div className="sticky top-0 z-20">
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/80">
          <div className="px-6">
            <div className="h-14 flex items-center">
              <div className="flex items-baseline space-x-3">
                <h1 className="text-2xl font-semibold text-gray-800">我的空间</h1>
                <div className="flex items-center space-x-1.5 text-sm text-gray-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{totalImages.toLocaleString('zh-CN')} 张照片</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {groups.map(({ date, images }) => (
        <section key={date} className="mb-8">
          {/* 日期标题 */}
          <div className="sticky top-14 z-10">
            <div className="bg-white/95 backdrop-blur-sm px-6 border-b border-gray-100">
              <div className="flex items-center h-12">
                <h2 className="text-sm font-medium text-gray-600">
                  {format(new Date(date), 'yyyy年M月d日 EEEE', { locale: zhCN })}
                </h2>
              </div>
            </div>
          </div>

          {/* 图片网格 */}
          <div className="px-6 mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {images.map((image) => (
                <Link
                  key={image.id}
                  href={`/image/${image.id}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                >
                  <Image
                    src={image.thumbnailUrl}
                    alt={image.title || '照片'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12.5vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
