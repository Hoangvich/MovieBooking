import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';
import {
  HiFilm, HiHome, HiVideoCamera, HiBuildingOffice2, HiCalendarDays,
  HiTicket, HiUsers, HiChartBar, HiBars3, HiXMark, HiMoon, HiSun,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';

const menuItems = [
  { to: '/admin', icon: HiHome, label: 'Dashboard' },
  { to: '/admin/movies', icon: HiVideoCamera, label: 'Quản lý phim' },
  { to: '/admin/cinemas', icon: HiBuildingOffice2, label: 'Rạp & Phòng chiếu' },
  { to: '/admin/showtimes', icon: HiCalendarDays, label: 'Suất chiếu' },
  { to: '/admin/bookings', icon: HiTicket, label: 'Đặt vé' },
  { to: '/admin/users', icon: HiUsers, label: 'Người dùng' },
  { to: '/admin/revenue', icon: HiChartBar, label: 'Doanh thu' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();

  const handleLogout = () => { dispatch(logout()); navigate('/'); };

  const Sidebar = ({ mobile }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-500">
          <HiFilm className="w-7 h-7" />
          <span>Admin Panel</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link key={item.to} to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${active
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                  : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'}`}>
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2">
        <button onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm w-full hover:bg-dark-100 dark:hover:bg-dark-800">
          {dark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5" />}
          {dark ? 'Chế độ sáng' : 'Chế độ tối'}
        </button>
        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 w-full hover:bg-red-50 dark:hover:bg-red-900/20">
          <HiArrowRightOnRectangle className="w-5 h-5" /> Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-50 dark:bg-dark-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-dark-900 border-r border-dark-100 dark:border-dark-800">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white dark:bg-dark-900">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1">
              <HiXMark className="w-6 h-6" />
            </button>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800 flex items-center px-6 gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <HiBars3 className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">
            {menuItems.find((m) => m.to === location.pathname)?.label || 'Admin'}
          </h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
