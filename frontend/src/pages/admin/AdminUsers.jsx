import { HiUsers } from 'react-icons/hi2';

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <HiUsers className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="font-bold text-lg">Quản lý người dùng</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">ID</th>
                <th className="px-4 py-3 text-left font-medium">Username</th>
                <th className="px-4 py-3 text-left font-medium">Họ tên</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
              <tr className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                <td className="px-4 py-3">1</td>
                <td className="px-4 py-3 font-medium">admin</td>
                <td className="px-4 py-3">Admin System</td>
                <td className="px-4 py-3">admin@moviebooking.com</td>
                <td className="px-4 py-3"><span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">ADMIN</span></td>
                <td className="px-4 py-3"><span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span></td>
              </tr>
              <tr className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                <td className="px-4 py-3">2</td>
                <td className="px-4 py-3 font-medium">user1</td>
                <td className="px-4 py-3">Nguyen Van A</td>
                <td className="px-4 py-3">user1@gmail.com</td>
                <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">USER</span></td>
                <td className="px-4 py-3"><span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span></td>
              </tr>
              <tr className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                <td className="px-4 py-3">3</td>
                <td className="px-4 py-3 font-medium">user2</td>
                <td className="px-4 py-3">Tran Thi B</td>
                <td className="px-4 py-3">user2@gmail.com</td>
                <td className="px-4 py-3"><span className="badge bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">USER</span></td>
                <td className="px-4 py-3"><span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-dark-500 mt-4">* Tích hợp API quản lý user đầy đủ khi backend có endpoint /api/admin/users</p>
      </div>
    </div>
  );
}
