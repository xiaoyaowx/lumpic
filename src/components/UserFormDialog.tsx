import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { XMarkIcon } from '@heroicons/react/24/outline';

// 表单验证schema
const createUserSchema = z.object({
  name: z.string().min(2, '名称至少2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  role: z.enum(['USER', 'ADMIN']),
});

const updateUserSchema = z.object({
  name: z.string().min(2, '名称至少2个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().optional(),
  role: z.enum(['USER', 'ADMIN']),
});

// 使用联合类型来处理不同模式下的表单数据
type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;
type UserFormData = CreateUserFormData | UpdateUserFormData;

interface UserFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
  } | null;
  onSuccess: () => void;
}

export default function UserFormDialog({
  isOpen,
  onClose,
  mode,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(mode === 'create' ? createUserSchema : updateUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'USER',
    },
  });

  // 当编辑模式下，用户数据变化时重置表单
  useEffect(() => {
    if (mode === 'edit' && user) {
      reset({
        name: user.name || '',
        email: user.email,
        password: '', // 编辑模式下密码默认为空
        role: user.role,
      });
    } else if (mode === 'create') {
      reset({
        name: '',
        email: '',
        password: '', // 创建模式下需要输入密码
        role: 'USER',
      });
    }
  }, [mode, user, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const url = mode === 'create' 
        ? '/api/admin/users' 
        : `/api/admin/users/${user?.id}`;
      
      // 如果是编辑模式且密码为空字符串，则从提交数据中移除密码字段
      const submitData = { ...data };
      if (mode === 'edit' && (!submitData.password || submitData.password.trim() === '')) {
        delete submitData.password;
      }

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success(mode === 'create' ? '用户创建成功' : '用户更新成功');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '操作失败');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">关闭</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 mb-6"
                    >
                      {mode === 'create' ? '创建新用户' : '编辑用户信息'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          用户名
                        </label>
                        <div className="mt-2">
                          <input
                            type="text"
                            {...register('name')}
                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="请输入用户名"
                          />
                          {errors.name && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          邮箱地址
                        </label>
                        <div className="mt-2">
                          <input
                            type="email"
                            {...register('email')}
                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="请输入邮箱地址"
                          />
                          {errors.email && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.email.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          密码{mode === 'edit' && ' (留空表示不修改)'}
                        </label>
                        <div className="mt-2">
                          <input
                            type="password"
                            {...register('password')}
                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder={mode === 'create' ? '请输入密码' : '输入新密码'}
                          />
                          {errors.password && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="role"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          用户角色
                        </label>
                        <div className="mt-2">
                          <select
                            {...register('role')}
                            className="block w-full rounded-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 appearance-none bg-none pr-8"
                          >
                            <option value="USER">普通用户</option>
                            <option value="ADMIN">管理员</option>
                          </select>
                          {errors.role && (
                            <p className="mt-2 text-sm text-red-600">
                              {errors.role.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-8 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex w-full justify-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? '提交中...' : mode === 'create' ? '创建' : '更新'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                          onClick={onClose}
                        >
                          取消
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
