import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { HiChartBar, HiCalendar, HiCurrencyDollar, HiTicket, HiShoppingCart } from 'react-icons/hi2';
import adminApi from '../../api/adminApi';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/formatters';

export default function AdminRevenue() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const today = new Date().toISOString().split('T')[0];

  const [year, setYear] = useState(currentYear);
  const [selectedDate, setSelectedDate] = useState(today);

  // Doanh thu ngày được chọn
  const { data: dailyData } = useQuery({
    queryKey: ['revenue', 'daily', selectedDate],
    queryFn: () => adminApi.getDailyRevenue(selectedDate),
    refetchInterval: 30000,
  });

  // Doanh thu tháng hiện tại
  const { data: monthlyData } = useQuery({
    queryKey: ['revenue', 'monthly', currentYear, currentMonth],
    queryFn: () => adminApi.getMonthlyRevenue(currentYear, currentMonth),
    refetchInterval: 30000,
  });

  // Doanh thu 12 tháng trong năm (biểu đồ cột)
  const { data: yearlyData, isLoading: loadingYearly } = useQuery({
    queryKey: ['revenue', 'yearly-breakdown', year],
    queryFn: () => adminApi.getYearlyBreakdown(year),
  });

  // Doanh thu 7 ngày gần nhất (biểu đồ đường) - refetch mỗi 30s
  const { data: weeklyData, isLoading: loadingWeekly } = useQuery({
    queryKey: ['revenue', 'weekly-breakdown', today],
    queryFn: () => adminApi.getWeeklyBreakdown(today),
    refetchInterval: 30000,
  });

  const daily = dailyData?.data || {};
  const monthly = monthlyData?.data || {};

  const yearlyChart = (yearlyData?.data || []).map((item) => ({
    name: item.period,
    revenue: item.totalRevenue || 0,
    bookings: item.totalBookings || 0,
    tickets: item.totalTicketsSold || 0,
  }));

  const weeklyChart = (weeklyData?.data || []).map((item) => ({
    name: item.period,
    revenue: item.totalRevenue || 0,
    bookings: item.totalBookings || 0,
    tickets: item.totalTicketsSold || 0,
  }));

  // Tính tổng năm
  const yearTotal = yearlyChart.reduce((sum, m) => sum + m.revenue, 0);
  const yearBookings = yearlyChart.reduce((sum, m) => sum + m.bookings, 0);
  const yearTickets = yearlyChart.reduce((sum, m) => sum + m.tickets, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-dark-800 text-white p-3 rounded-xl text-sm shadow-xl border border-dark-700">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: {p.name === 'Doanh thu' ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <HiCurrencyDollar className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-dark-500">Doanh thu hôm nay</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(daily.totalRevenue || 0)}</p>
          <p className="text-xs text-dark-400 mt-1">{daily.totalBookings || 0} đơn · {daily.totalTicketsSold || 0} vé</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <HiCurrencyDollar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm text-dark-500">Doanh thu tháng {currentMonth}</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(monthly.totalRevenue || 0)}</p>
          <p className="text-xs text-dark-400 mt-1">{monthly.totalBookings || 0} đơn · {monthly.totalTicketsSold || 0} vé</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <HiShoppingCart className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-dark-500">Tổng năm {year}</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(yearTotal)}</p>
          <p className="text-xs text-dark-400 mt-1">{yearBookings} đơn · {yearTickets} vé</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <HiCalendar className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-sm text-dark-500">Ngày {selectedDate === today ? '(hôm nay)' : selectedDate}</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(daily.totalRevenue || 0)}</p>
          <p className="text-xs text-dark-400 mt-1">{daily.totalBookings || 0} đơn · {daily.totalTicketsSold || 0} vé</p>
        </div>
      </div>

      {/* Date picker */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <HiCalendar className="w-5 h-5 text-dark-400" />
            <span className="font-medium">Chọn ngày xem chi tiết:</span>
          </div>
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            className="input-field !w-auto !py-2 text-sm" />
          {selectedDate !== today && (
            <button onClick={() => setSelectedDate(today)} className="text-sm text-primary-600 hover:underline">
              Về hôm nay
            </button>
          )}
        </div>
      </div>

      {/* Monthly bar chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <HiChartBar className="w-5 h-5 text-primary-600" />
            Doanh thu theo tháng
          </h2>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}
            className="input-field !w-auto !py-1.5 text-sm">
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loadingYearly ? <Loading /> : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12}
                  tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Weekly line chart */}
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-6 flex items-center gap-2">
          <HiTicket className="w-5 h-5 text-accent-600" />
          Xu hướng 7 ngày gần nhất
        </h2>

        {loadingWeekly ? <Loading /> : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis yAxisId="left" stroke="#94a3b8" fontSize={12}
                  tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v} />
                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#d946ef" strokeWidth={3}
                  dot={{ fill: '#d946ef', r: 5, strokeWidth: 2 }} name="Doanh thu" />
                <Line yAxisId="right" type="monotone" dataKey="tickets" stroke="#f59e0b" strokeWidth={2}
                  dot={{ fill: '#f59e0b', r: 4 }} name="Số vé" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detail table */}
      <div className="card p-6">
        <h2 className="font-bold text-lg mb-4">Chi tiết doanh thu theo tháng - {year}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tháng</th>
                <th className="px-4 py-3 text-right font-medium">Doanh thu</th>
                <th className="px-4 py-3 text-right font-medium">Số đơn</th>
                <th className="px-4 py-3 text-right font-medium">Số vé</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-800">
              {yearlyChart.map((item, i) => (
                <tr key={i} className={`hover:bg-dark-50 dark:hover:bg-dark-800/50 ${item.revenue > 0 ? 'font-medium' : 'text-dark-400'}`}>
                  <td className="px-4 py-3">{item.name}/{year}</td>
                  <td className="px-4 py-3 text-right text-green-600">{formatCurrency(item.revenue)}</td>
                  <td className="px-4 py-3 text-right">{item.bookings}</td>
                  <td className="px-4 py-3 text-right">{item.tickets}</td>
                </tr>
              ))}
              <tr className="font-bold bg-dark-50 dark:bg-dark-800">
                <td className="px-4 py-3">Tổng cộng</td>
                <td className="px-4 py-3 text-right text-green-600">{formatCurrency(yearTotal)}</td>
                <td className="px-4 py-3 text-right">{yearBookings}</td>
                <td className="px-4 py-3 text-right">{yearTickets}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
