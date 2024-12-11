import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Tag {
  id: string;
  name: string;
  description: string | null;
}

interface TagSelectorProps {
  imageId: string;
  onTagsChange?: (tags: Tag[]) => void;
}

export default function TagSelector({ imageId, onTagsChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载所有标签
  const loadTags = async () => {
    try {
      const response = await fetch('/api/admin/tags?pageSize=100');
      if (!response.ok) throw new Error('加载标签失败');
      const data = await response.json();
      setTags(data.data);
    } catch (error) {
      console.error('加载标签失败:', error);
      toast.error('加载标签失败');
    }
  };

  // 加载图片的标签
  const loadImageTags = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/image/${imageId}/tags`);
      if (!response.ok) throw new Error('加载图片标签失败');
      const data = await response.json();
      setSelectedTags(data);
      if (onTagsChange) {
        onTagsChange(data);
      }
    } catch (error) {
      console.error('加载图片标签失败:', error);
      toast.error('加载图片标签失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 更新图片标签
  const updateImageTags = async (newTags: Tag[]) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/image/${imageId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tagIds: newTags.map((tag) => tag.id),
        }),
      });

      if (!response.ok) throw new Error('更新标签失败');
      const data = await response.json();
      setSelectedTags(data);
      if (onTagsChange) {
        onTagsChange(data);
      }
      toast.success('标签已更新');
      setIsEditing(false);
    } catch (error) {
      console.error('更新标签失败:', error);
      toast.error('更新标签失败');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    loadTags();
    loadImageTags();
  }, [imageId]);

  // 过滤标签
  const filteredTags = tags.filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span>加载标签中...</span>
      </div>
    );
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">标签</h3>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            编辑
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedTags.length > 0 ? (
            selectedTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >
                {tag.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">暂无标签</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">编辑标签</h3>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
            disabled={isUpdating}
          >
            取消
          </button>
          <button
            type="button"
            onClick={() => updateImageTags(selectedTags)}
            disabled={isUpdating}
            className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                保存中...
              </>
            ) : (
              '保存'
            )}
          </button>
        </div>
      </div>

      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索标签..."
          className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="max-h-48 overflow-y-auto p-2 space-y-2">
          {filteredTags.map((tag) => {
            const isSelected = selectedTags.some(
              (selectedTag) => selectedTag.id === tag.id
            );
            return (
              <label
                key={tag.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      setSelectedTags(
                        selectedTags.filter(
                          (selectedTag) => selectedTag.id !== tag.id
                        )
                      );
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                />
                <div>
                  <div className="font-medium text-sm text-gray-900">
                    {tag.name}
                  </div>
                  {tag.description && (
                    <div className="text-xs text-gray-500">
                      {tag.description}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
          {filteredTags.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-2">
              未找到匹配的标签
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
