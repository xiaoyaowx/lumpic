export default function LogsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">操作日志</h1>
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {/* 日志筛选区域 */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  日期范围
                </label>
                <select
                  id="date"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option>最近7天</option>
                  <option>最近30天</option>
                  <option>最近90天</option>
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  操作类型
                </label>
                <select
                  id="type"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option>全部</option>
                  <option>登录</option>
                  <option>上传</option>
                  <option>删除</option>
                  <option>修改</option>
                </select>
              </div>
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                  操作用户
                </label>
                <input
                  type="text"
                  id="user"
                  placeholder="请输入用户邮箱"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  查询
                </button>
              </div>
            </div>

            {/* 日志列表 */}
            <div className="mt-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        时间
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        用户
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作类型
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        详情
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP地址
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* 示例数据 */}
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        2024-12-10 14:30:00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        user@example.com
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          登录
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        用户登录成功
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        192.168.1.1
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        2024-12-10 14:25:00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        admin@example.com
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          上传
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        上传图片 image.jpg
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        192.168.1.2
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 分页 */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  显示 <span className="font-medium">1</span> 到 <span className="font-medium">10</span> 条，
                  共 <span className="font-medium">20</span> 条记录
                </div>
                <div className="flex-1 flex justify-end">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      上一页
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      下一页
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
