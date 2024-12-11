'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import UserFormDialog from '@/components/UserFormDialog';
import ConfirmDialog from '@/components/ConfirmDialog';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  image: string | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    images: number;
    albums: number;
  };
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // 加载用户列表
  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error('加载用户列表失败');

      const data = await response.json();
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('加载用户列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.pageSize, search]);

  // 删除用户
  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success('用户已删除');
      loadUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '删除用户失败');
    }
  };

  // 打开删除确认对话框
  const openDeleteConfirm = (user: User) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (userToDelete) {
      handleDelete(userToDelete.id);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">用户管理</h1>
          <p className="mt-2 text-sm text-gray-700">
            管理系统中的所有用户，包括普通用户和管理员。
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setModalMode('create');
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            添加用户
          </button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="mt-6 flex justify-between items-center space-x-4">
        <div className="flex-1 max-w-md">
          <label htmlFor="search" className="sr-only">
            搜索用户
          </label>
          <div className="relative text-gray-400 focus-within:text-gray-600">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                // 重置页码到第一页
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="block w-full rounded-lg border-0 py-3 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="搜索用户名或邮箱..."
              spellCheck={false}
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">显示</span>
            <div className="relative">
              <select
                value={pagination.pageSize}
                onChange={(e) => {
                  setPagination(prev => ({
                    ...prev,
                    page: 1,
                    pageSize: Number(e.target.value),
                  }));
                }}
                className="block w-20 rounded-lg border-0 py-1.5 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 appearance-none"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  className="h-4 w-4 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <span className="text-sm text-gray-500">条/页</span>
          </label>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="mt-6 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      用户
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      角色
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      图片/相册
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      注册时间
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">操作</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.image ? (
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={user.image}
                                alt=""
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg
                                  className="h-6 w-6 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.name || '未设置昵称'}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role === 'ADMIN' ? '管理员' : '普通用户'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                            {user._count.images} 张图片
                          </span>
                          <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                            {user._count.albums} 个相册
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => {
                              setModalMode('edit');
                              setSelectedUser(user);
                              setIsModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => openDeleteConfirm(user)}
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
          </div>
        </div>
      </div>

      {/* 分页 */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center">
          <p className="text-sm text-gray-700">
            显示第{' '}
            <span className="font-medium">
              {(pagination.page - 1) * pagination.pageSize + 1}
            </span>{' '}
            到{' '}
            <span className="font-medium">
              {Math.min(pagination.page * pagination.pageSize, pagination.total)}
            </span>{' '}
            条，共{' '}
            <span className="font-medium">{pagination.total}</span> 条
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page >= pagination.totalPages}
            className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一页
          </button>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="删除用户"
        message={`确定要删除用户 "${userToDelete?.name || userToDelete?.email}" 吗？此操作不可恢复。`}
        confirmText="删除"
        cancelText="取消"
        type="danger"
      />

      {/* 用户表单对话框 */}
      <UserFormDialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        user={selectedUser}
        onSuccess={loadUsers}
      />
    </div>
  );
}
