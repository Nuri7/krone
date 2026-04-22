import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StickyMobileCTA from './StickyMobileCTA';
import WhatsAppButton from './WhatsAppButton';
import { useScrollProgress } from '@/hooks/useResponsive';

export default function AppLayout() {
  const location = useLocation();
  const progress = useScrollProgress();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  // Hide footer on admin pages
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <StickyMobileCTA />
      <WhatsAppButton />
    </>
  );
}
