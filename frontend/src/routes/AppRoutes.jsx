import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import AdminLayout from '../components/layout/AdminLayout';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

import HomePage from '../pages/HomePage';
import MuaVePage from '../pages/MuaVePage';
import SchedulePage from '../pages/SchedulePage';
import MovieListPage from '../pages/movie/MovieListPage';
import MovieDetailPage from '../pages/movie/MovieDetailPage';
import CinemaListPage from '../pages/CinemaListPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

import SeatSelectionPage from '../pages/booking/SeatSelectionPage';
import CheckoutPage from '../pages/booking/CheckoutPage';
import BookingConfirmPage from '../pages/booking/BookingConfirmPage';
import MyBookingsPage from '../pages/booking/MyBookingsPage';
import PaymentCallbackPage from '../pages/payment/PaymentCallbackPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminMovies from '../pages/admin/AdminMovies';
import AdminCinemas from '../pages/admin/AdminCinemas';
import AdminShowtimes from '../pages/admin/AdminShowtimes';
import AdminBookings from '../pages/admin/AdminBookings';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminRevenue from '../pages/admin/AdminRevenue';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/mua-ve" element={<MuaVePage />} />
        <Route path="/lich-chieu" element={<SchedulePage />} />
        <Route path="/movies" element={<MovieListPage />} />
        <Route path="/movies/:id" element={<MovieDetailPage />} />
        <Route path="/cinemas" element={<CinemaListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/booking/seats/:showtimeId" element={<ProtectedRoute><SeatSelectionPage /></ProtectedRoute>} />
        <Route path="/booking/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/booking/confirm/:bookingId" element={<ProtectedRoute><BookingConfirmPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/payment/callback" element={<ProtectedRoute><PaymentCallbackPage /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="cinemas" element={<AdminCinemas />} />
        <Route path="showtimes" element={<AdminShowtimes />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="revenue" element={<AdminRevenue />} />
      </Route>
    </Routes>
  );
}