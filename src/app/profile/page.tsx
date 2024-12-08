'use client';

import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [useRandomAvatar, setUseRandomAvatar] = useState(false);

  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('文件大小不能超过 5MB');
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('只支持 JPEG、PNG 和 WebP 格式的图片');
      return;
    }

    setSelectedFile(file);
    setUseRandomAvatar(false);
    
    // 创建本地预览
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpdate = () => {
    setUseRandomAvatar(true);
    setSelectedFile(null);
    setPreviewImage(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`);
  };

  const handleAvatarSave = async () => {
    setIsLoading(true);
    try {
      let avatarUrl = session?.user?.image;

      // 处理头像更新
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/user/avatar/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('头像上传失败');
        }

        const data = await uploadResponse.json();
        avatarUrl = data.image;
        setIsUploading(false);
      } else if (useRandomAvatar && previewImage) {
        // 直接使用当前预览的随机头像URL
        avatarUrl = previewImage;
        
        // 更新数据库中的头像URL
        const response = await fetch('/api/user/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: avatarUrl,
          }),
        });

        if (!response.ok) {
          throw new Error('头像更新失败');
        }
      }

      // 更新session
      await update({
        ...session,
        user: {
          ...session?.user,
          image: avatarUrl,
        },
      });

      toast.success('头像保存成功');
      
      // 清理状态
      setSelectedFile(null);
      setPreviewImage(null);
      setUseRandomAvatar(false);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 验证密码
      if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('新密码与确认密码不匹配');
          setIsLoading(false);
          return;
        }
        if (!formData.currentPassword) {
          toast.error('请输入当前密码');
          setIsLoading(false);
          return;
        }
      }

      // 提交更改
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '更新失败');
      }

      const data = await response.json();

      // 更新session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
        },
      });

      toast.success('保存成功');
      
      // 清理密码字段
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

    } catch (error) {
      toast.error(error instanceof Error ? error.message : '保存失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 md:ml-64">
          <div className="max-w-6xl mx-auto">
            {/* 页面标题 */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">个人信息设置</h1>
            </div>

            {/* 内容区域 - 左右布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 左侧 - 头像设置 */}
              <div className="lg:col-span-4">
                <div className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100 h-full">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">头像设置</h2>
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                      <div className="relative w-32 lg:w-40 h-32 lg:h-40 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                        <Image
                          src={previewImage || session?.user?.image || `/avatars/default.png`}
                          alt="用户头像"
                          fill
                          className="object-cover"
                          priority
                          unoptimized
                        />
                      </div>
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">更换头像</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 w-full">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileSelect}
                        ref={fileInputRef}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        <span>上传新头像</span>
                      </button>
                      <div className="w-full text-center">
                        <span className="text-sm text-gray-500">或者</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAvatarUpdate}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                        </svg>
                        <span>使用随机头像</span>
                      </button>
                      
                      {(previewImage || selectedFile || useRandomAvatar) && (
                        <button
                          type="button"
                          onClick={handleAvatarSave}
                          disabled={isLoading || isUploading}
                          className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{isLoading || isUploading ? '保存中...' : '保存头像'}</span>
                        </button>
                      )}
                    </div>
                    {(previewImage || selectedFile || useRandomAvatar) && (
                      <p className="text-sm text-blue-600">
                        头像已更改，点击上方保存按钮以确认更改
                      </p>
                    )}
                    <p className="text-sm text-gray-500 text-center">
                      支持 JPEG、PNG 和 WebP 格式，最大 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* 右侧 - 基本信息 */}
              <div className="lg:col-span-8">
                <form onSubmit={handleSubmit} className="bg-white p-6 lg:p-8 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        用户昵称
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入您的昵称"
                      />
                    </div>

                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        当前密码
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="如需修改密码，请输入当前密码"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        新密码
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请输入新密码"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        确认新密码
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="请再次输入新密码"
                      />
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                          {isLoading ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          )}
                        </svg>
                        <span>{isLoading ? '保存中...' : '保存修改'}</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
