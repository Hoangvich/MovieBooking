import { useQuery } from '@tanstack/react-query';
import { HiUsers } from 'react-icons/hi2';
import axiosClient from '../../api/axiosClient';

const fetchUsers = () => axiosClient.get('/admin/users');

export default function AdminUsers() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  const users = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <HiUsers className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="font-bold text-lg">Quản lý người dùng</h2>
          <span className="text-sm text-gray-400">({users.length} người dùng)</span>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Đang tải...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Username</th>
                  <th className="px-4 py-3 text-left font-medium">Họ tên</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">SĐT</th>
                  <th className="px-4 py-3 text-left font-medium">Vai trò</th>
                  <th className="px-4 py-3 text-left font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-dark-50 dark:hover:bg-dark-800/50">
                    <td className="px-4 py-3">{user.id}</td>
                    <td className="px-4 py-3 font-medium">{user.username}</td>
                    <td className="px-4 py-3">{user.fullName}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">{user.phoneNumber || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.role === 'ROLE_ADMIN'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                        {user.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${user.active
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'}`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
