import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/AuthContext';
import { queryClient } from '@/lib/queryClient';
import AppLayout from '@/components/layout/AppLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

// Eagerly loaded public pages (critical path)
import Home from '@/pages/Home';
import Restaurant from '@/pages/Restaurant';
import MenuPage from '@/pages/MenuPage';
import Reserve from '@/pages/Reserve';
import Rooms from '@/pages/Rooms';

// Lazy loaded public pages (secondary)
const Story = lazy(() => import('@/pages/Story'));
const Weddings = lazy(() => import('@/pages/Weddings'));
const Gallery = lazy(() => import('@/pages/Gallery'));
const Contact = lazy(() => import('@/pages/Contact'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Events = lazy(() => import('@/pages/Events'));
const Legal = lazy(() => import('@/pages/Legal'));
const BookingReturn = lazy(() => import('@/pages/BookingReturn'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Lazy loaded account pages
const GuestAccount = lazy(() => import('@/pages/account/GuestAccount'));
const GuestProfile = lazy(() => import('@/pages/account/GuestProfile'));
const GuestDocuments = lazy(() => import('@/pages/account/GuestDocuments'));
const GuestMessages = lazy(() => import('@/pages/account/GuestMessages'));
const GuestReservations = lazy(() => import('@/pages/account/GuestReservations'));

// Lazy loaded admin pages
const Admin = lazy(() => import('@/pages/admin/Admin'));
const AdminCalendar = lazy(() => import('@/pages/admin/AdminCalendar'));
const AdminMenu = lazy(() => import('@/pages/admin/AdminMenu'));
const AdminEvents = lazy(() => import('@/pages/admin/AdminEvents'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ActivityLog = lazy(() => import('@/pages/admin/ActivityLog'));

function PageLoader() {
  return (
    <div className="bg-charcoal min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-ivory/30 text-xs font-body tracking-wider">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#1A1410',
                border: '1px solid rgba(201,169,110,0.2)',
                color: '#F5EFE3',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
            }}
          />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<AppLayout />}>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurant" element={<Restaurant />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/story" element={<Story />} />
                <Route path="/weddings" element={<Weddings />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/events" element={<Events />} />
                <Route path="/legal" element={<Legal />} />
                <Route path="/privacy" element={<Legal />} />
                <Route path="/booking-return" element={<BookingReturn />} />
                <Route path="/login" element={<Login />} />

                {/* Guest Account — requires login */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/account" element={<GuestAccount />} />
                  <Route path="/account/profile" element={<GuestProfile />} />
                  <Route path="/account/documents" element={<GuestDocuments />} />
                  <Route path="/account/messages" element={<GuestMessages />} />
                  <Route path="/account/reservations" element={<GuestReservations />} />
                </Route>

                {/* Admin — requires admin role */}
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/calendar" element={<AdminCalendar />} />
                  <Route path="/admin/menu" element={<AdminMenu />} />
                  <Route path="/admin/events" element={<AdminEvents />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/activity-log" element={<ActivityLog />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}