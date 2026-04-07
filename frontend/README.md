# MovieBooking Frontend - ReactJS

## Tech Stack
- React 18, Vite 6
- TailwindCSS 3 (dark/light mode)
- React Router v6 (protected routes)
- Redux Toolkit (auth, booking state)
- React Query (server state, caching)
- React Hook Form + Yup (form validation)
- Axios (auto JWT refresh interceptor)
- Recharts (biểu đồ doanh thu)
- React Hot Toast (notifications)
- React Icons (HeroIcons v2)

## Cài đặt & Chạy

```bash
npm install
npm run dev
```

Mở `http://localhost:3000`

## Cấu trúc

```
src/
├── api/            # Axios client + API modules
├── assets/styles/  # TailwindCSS + global styles
├── components/
│   ├── common/     # Loading, Modal, ErrorBoundary, Skeleton
│   ├── layout/     # Navbar, Footer, MainLayout, AdminLayout
│   ├── movie/      # MovieCard
│   └── seat/       # SeatMap (interactive)
├── context/        # ThemeContext (dark/light)
├── pages/
│   ├── auth/       # Login, Register
│   ├── movie/      # MovieList, MovieDetail
│   ├── booking/    # SeatSelection, Checkout, Confirm, MyBookings
│   ├── payment/    # PaymentCallback
│   └── admin/      # Dashboard, Movies, Cinemas, Showtimes, Bookings, Users, Revenue
├── routes/         # AppRoutes, ProtectedRoute, AdminRoute
├── store/slices/   # authSlice, bookingSlice
└── utils/          # formatters, constants
```

## Tính năng
- Responsive mobile-first
- Dark/Light mode toggle
- JWT auto-refresh
- Protected + Admin routes
- Seat map trực quan
- VNPay payment flow
- Revenue charts (Recharts)
- Toast notifications
- Loading skeletons
- Error boundary
