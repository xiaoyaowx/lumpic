'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { formatBytes } from '@/lib/utils';
import {
  UsersIcon,
  PhotoIcon,
  FolderIcon,
  ServerIcon,
} from '@heroicons/react/24/outline';

interface Stats {
  userCount: number;
  imageCount: number;
  albumCount: number;
  totalStorage: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  _count: {
    images: number;
    albums: number;
  };
}

interface Image {
  id: string;
  title: string;
  filename: string;
  thumbnailUrl: string;
  size: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
}

interface AdminStats {
  stats: Stats;
  recentUsers: User[];
  recentImages: Image[];
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AdminStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error: {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 text-gray-500 bg-gray-50 rounded-lg">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">仪表盘</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">总用户数</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data.stats.userCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-blue-600/10 px-5 py-3">
            <div className="text-sm text-blue-600">
              活跃用户：{data.stats.userCount}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">总图片数</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data.stats.imageCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-purple-600/10 px-5 py-3">
            <div className="text-sm text-purple-600">
              本月上传：{data.stats.imageCount}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">相册数量</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data.stats.albumCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-green-600/10 px-5 py-3">
            <div className="text-sm text-green-600">
              共享相册：{data.stats.albumCount}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-gradient-to-br from-amber-50 to-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-600 truncate">存储使用量</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {formatBytes(data.stats.totalStorage)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-amber-600/10 px-5 py-3">
            <div className="text-sm text-amber-600">
              可用空间：{formatBytes(data.stats.totalStorage)}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Recent Users */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">最近用户</h2>
            </div>
            <div className="mt-6 flow-root">
              <ul role="list" className="-my-5 divide-y divide-gray-200">
                {data.recentUsers.map((user) => (
                  <li key={user.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Avatar>
                          <AvatarImage src={user.image || undefined} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="truncate text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div>
                        <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          注册于{' '}
                          {formatDistanceToNow(new Date(user.createdAt), {
                            addSuffix: true,
                            locale: zhCN,
                          })}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Images */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-medium text-gray-900">最近图片</h2>
            </div>
            <div className="mt-6 flow-root">
              <ul role="list" className="grid grid-cols-2 gap-4">
                {data.recentImages.map((image) => (
                  <li key={image.id} className="relative">
                    <div className="group block w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <img
                        src={image.thumbnailUrl}
                        alt={image.title}
                        className="object-cover group-hover:opacity-75"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-sm font-medium text-white truncate">{image.title}</p>
                        <p className="text-xs text-gray-300 truncate">
                          上传于{' '}
                          {formatDistanceToNow(new Date(image.createdAt), {
                            addSuffix: true,
                            locale: zhCN,
                          })}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
