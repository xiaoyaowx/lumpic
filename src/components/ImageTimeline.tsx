import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ImageTimelineProps {
  groups: {
    date: string;
    images: Array<{
      id: string;
      title: string;
      url: string;
      thumbnailUrl: string;
      photoTakenAt: string;
    }>;
  }[];
}

export function ImageTimeline({ groups }: ImageTimelineProps) {
  return (
    <div className="relative">
      {/* 时间轴线 */}
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2" />
      
      {groups.map(({ date, images }) => (
        <div key={date} className="mb-12">
          {/* 日期标题 */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <time className="text-gray-600 font-medium">
                {format(new Date(date), 'yyyy年M月d日 EEEE', { locale: zhCN })}
              </time>
            </div>
          </div>

          {/* 图片网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image) => (
              <Link
                key={image.id}
                href={`/image/${image.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <Image
                  src={image.thumbnailUrl}
                  alt={image.title || '照片'}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300" />
                
                {/* 时间标签 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                  <time className="text-white text-sm">
                    {format(new Date(image.photoTakenAt), 'HH:mm')}
                  </time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
