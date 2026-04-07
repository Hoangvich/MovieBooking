import { useQuery } from '@tanstack/react-query';
import { HiCurrencyDollar, HiTicket, HiFilm, HiUsers } from 'react-icons/hi2';
import adminApi from '../../api/adminApi';
import movieApi from '../../api/movieApi';
import { formatCurrency } from '../../utils/formatters';

export default function AdminDashboard() {
  const today = new Date().toISOString().split('T')[0];
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const { data: dailyData } = useQuery({
    queryKey: ['revenue', 'daily', today],
    queryFn: () => adminApi.getDailyRevenue(today),
  });

  const { data: monthlyData } = useQuery({
    queryKey: ['revenue', 'monthly', year, month],
    queryFn: () => adminApi.getMonthlyRevenue(year, month),
  });

  const { data: moviesData } = useQuery({
    queryKey: ['movies', 'all'],
    queryFn: movieApi.getAll,
  });

  const daily = dailyData?.data || {};
  const monthly = monthlyData?.data || {};
  const totalMovies = moviesData?.data?.length || 0;

  const stats = [
    { label: 'Doanh thu hôm nay', value: formatCurrency(daily.totalRevenue || 0), icon: HiCurrencyDollar, color: 'bg-green-500', change: `${daily.totalBookings || 0} đơn` },
    { label: 'Doanh thu tháng', value: formatCurrency(monthly.totalRevenue || 0), icon: HiCurrencyDollar, color: 'bg-blue-500', change: `${monthly.totalBookings || 0} đơn` },
    { label: 'Vé bán tháng này', value: monthly.totalTicketsSold || 0, icon: HiTicket, color: 'bg-purple-500', change: `T${month}/${year}` },
    { label: 'Tổng số phim', value: totalMovies, icon: HiFilm, color: 'bg-orange-500', change: 'Đang hoạt động' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-dark-500">{stat.label}</p>
              <span className="text-xs text-dark-400">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Thêm phim', href: '/admin/movies', color: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' },
            { label: 'Thêm suất chiếu', href: '/admin/showtimes', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
            { label: 'Xem đặt vé', href: '/admin/bookings', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
            { label: 'Báo cáo', href: '/admin/revenue', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
          ].map((action) => (
            <a key={action.label} href={action.href}
              className={`${action.color} rounded-xl p-4 text-center font-medium hover:opacity-80 transition-opacity`}>
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
