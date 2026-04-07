import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiMagnifyingGlass, HiUser, HiChevronDown, HiXMark, HiBars3, HiSun, HiMoon } from 'react-icons/hi2';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../context/ThemeContext';

const PHIM_MENU = [
  { label: 'Đang chiếu', to: '/movies' },
  { label: 'Sắp chiếu', to: '/movies?tab=soon' },
  { label: 'Tất cả phim', to: '/movies?tab=all' },
];

function NavDropdown({ label, isActive, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={ref} className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-0.5 px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
      >
        {label}
        <HiChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-white dark:bg-gray-800 shadow-2xl border border-gray-100 dark:border-gray-700 rounded-lg z-50 min-w-[180px] py-1.5">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { dark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { dispatch(logout()); navigate('/'); setUserOpen(false); };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-1">

          {/* Left nav */}
          <div className="hidden md:flex items-center gap-0 flex-shrink-0">
            <Link to="/mua-ve"
              className="text-sm font-semibold text-red-600 hover:text-red-700 whitespace-nowrap px-3 py-2">
              Đặt vé phim chiếu rạp
            </Link>

            <Link to="/lich-chieu"
              className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap
                ${location.pathname === '/lich-chieu' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
              Lịch chiếu
            </Link>

            <NavDropdown label="Phim" isActive={location.pathname.startsWith('/movies')}>
              {PHIM_MENU.map((item) => (
                <Link key={item.label} to={item.to}
                  className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white whitespace-nowrap">
                  {item.label}
                </Link>
              ))}
            </NavDropdown>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center md:justify-center">
            <Link to="/" className="flex-shrink-0 px-4">
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                H<span className="text-red-600">V</span>ich
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {searchOpen ? (
              <div className="flex items-center gap-2 max-w-xs">
                <div className="relative">
                  <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input autoFocus value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchVal.trim()) {
                        navigate(`/movies?search=${encodeURIComponent(searchVal.trim())}`);
                        setSearchOpen(false);
                        setSearchVal('');
                      }
                    }}
                    placeholder="Tìm phim..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400 dark:bg-gray-800 dark:text-white" />
                </div>
                <button onClick={() => { setSearchOpen(false); setSearchVal(''); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <HiXMark className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <>
                <button onClick={() => setSearchOpen(true)}
                  className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-gray-400 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-gray-300 dark:hover:border-gray-500 min-w-[180px] dark:bg-gray-800">
                  <HiMagnifyingGlass className="w-4 h-4 flex-shrink-0" />
                  <span>Từ khóa tìm kiếm...</span>
                </button>
                <button onClick={() => setSearchOpen(true)} className="sm:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <HiMagnifyingGlass className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </>
            )}

            <button onClick={toggleTheme} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title={dark ? 'Chế độ sáng' : 'Chế độ tối'}>
              {dark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-500" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setUserOpen((v) => !v)} className="flex items-center p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                </button>
                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserOpen(false)} />
                    <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl z-50 py-1 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-semibold dark:text-white">{user.username}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link to="/my-bookings" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Vé của tôi</Link>
                      {user.role === 'ROLE_ADMIN' && (
                        <Link to="/admin" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Quản trị</Link>
                      )}
                      <hr className="border-gray-100 dark:border-gray-700" />
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">Đăng xuất</button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <HiUser className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}

            {/* Mobile hamburger */}
            <button className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" onClick={() => setMobileOpen((v) => !v)}>
              {mobileOpen ? <HiXMark className="w-5 h-5" /> : <HiBars3 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 space-y-1">
          <Link to="/mua-ve" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-semibold text-red-600">Đặt vé phim chiếu rạp</Link>
          <Link to="/lich-chieu" onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300">Lịch chiếu</Link>
          <p className="pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase">Phim</p>
          {PHIM_MENU.map((item) => (
            <Link key={item.label} to={item.to} onClick={() => setMobileOpen(false)}
              className="block py-2 pl-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-3">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">Đăng nhập</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 bg-red-600 text-white rounded-lg text-sm font-medium">Đăng ký</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
