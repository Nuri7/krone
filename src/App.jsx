import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AppLayout from './components/layout/AppLayout';

// Pages
import Home from './pages/Home';
import Reserve from './pages/Reserve';
import Rooms from './pages/Rooms';
import MenuPage from './pages/MenuPage';
import Story from './pages/Story';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import BookingReturn from './pages/BookingReturn';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-stone-400 text-sm">Krone Langenburg</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/story" element={<Story />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/booking-return" element={<BookingReturn />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App