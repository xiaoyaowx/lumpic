'use client';

import { useState, useEffect } from 'react';
import { Album } from '@prisma/client';

interface AlbumSelectorProps {
  selectedAlbumId?: string | null;
  onSelect: (albumId: string | null) => void;
  className?: string;
}

export default function AlbumSelector({
  selectedAlbumId,
  onSelect,
  className = '',
}: AlbumSelectorProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('/api/albums');
      if (response.ok) {
        const data = await response.json();
        setAlbums(data);
      } else {
        console.error('获取相册列表失败');
      }
    } catch (error) {
      console.error('获取相册列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <select
        className={`block w-full p-2 border rounded-md ${className}`}
        disabled
      >
        <option>加载中...</option>
      </select>
    );
  }

  return (
    <select
      className={`block w-full p-2 border rounded-md ${className}`}
      value={selectedAlbumId || ''}
      onChange={(e) => onSelect(e.target.value || null)}
    >
      <option value="">未分类</option>
      {albums.map((album) => (
        <option key={album.id} value={album.id}>
          {album.name}
        </option>
      ))}
    </select>
  );
}
