import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/lib/AuthContext';
import { queryClient } from '@/lib/queryClient';
import AppLayout from '@/components/layout/AppLayout';

// Public pages
import Home from '@/pages/Home';
import Restaurant from '@/pages/Restaurant';
import MenuPage from '@/pages/MenuPage';
import Reserve from '@/pages/Reserve';
import Rooms from '@/pages/Rooms';
import Story from '@/pages/Story';
import Weddings from '@/pages/Weddings';
import Gallery from '@/pages/Gallery';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import Events from '@/pages/Events';
import Legal from '@/pages/Legal';
import BookingReturn from '@/pages/BookingReturn';

// Account pages
import GuestAccount from '@/pages/account/GuestAccount';
import GuestProfile from '@/pages/account/GuestProfile';
import GuestDocuments from '@/pages/account/GuestDocuments';
import GuestMessages from '@/pages/account/GuestMessages';
import GuestReservations from '@/pages/account/GuestReservations';

// Admin pages
import Admin from '@/pages/admin/Admin';
import AdminCalendar from '@/pages/admin/AdminCalendar';
import AdminMenu from '@/pages/admin/AdminMenu';
import AdminEvents from '@/pages/admin/AdminEvents';
import Dashboard from '@/pages/admin/Dashboard';
import ActivityLog from '@/pages/admin/ActivityLog';

// Auth
import Login from '@/pages/Login';

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

              {/* Guest Account */}
              <Route path="/account" element={<GuestAccount />} />
              <Route path="/account/profile" element={<GuestProfile />} />
              <Route path="/account/documents" element={<GuestDocuments />} />
              <Route path="/account/messages" element={<GuestMessages />} />
              <Route path="/account/reservations" element={<GuestReservations />} />

              {/* Admin */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/calendar" element={<AdminCalendar />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activity-log" element={<ActivityLog />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}