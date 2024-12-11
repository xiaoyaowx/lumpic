import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm } from 'react-hook-form';

interface Tag {
  id: string;
  name: string;
  description: string | null;
}

interface TagFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  tag?: Tag | null;
  mode: 'create' | 'edit';
}

export default function TagFormDialog({
  isOpen,
  onClose,
  onSubmit,
  tag,
  mode,
}: TagFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ name: string; description: string }>();

  useEffect(() => {
    if (tag && mode === 'edit') {
      reset({
        name: tag.name,
        description: tag.description || '',
      });
    } else {
      reset({
        name: '',
        description: '',
      });
    }
  }, [tag, mode, reset]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {mode === 'create' ? '添加标签' : '编辑标签'}
                    </Dialog.Title>
                    <form
                      className="mt-6"
                      onSubmit={handleSubmit((data) => {
                        onSubmit(data);
                        onClose();
                      })}
                    >
                      <div className="space-y-6">
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                          >
                            标签名称
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              id="name"
                              {...register('name', { required: '标签名称不能为空' })}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                            htmlFor="description"
                            className="block text-left text-sm font-medium leading-6 text-gray-900"
                          >
                            描述
                          </label>
                          <div className="mt-2">
                            <textarea
                              id="description"
                              rows={3}
                              {...register('description')}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end gap-x-6">
                        <button
                          type="button"
                          onClick={onClose}
                          className="text-sm font-semibold leading-6 text-gray-900"
                        >
                          取消
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        >
                          {mode === 'create' ? '添加' : '保存'}
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
    </Transition.Root>
  );
}
