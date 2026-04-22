import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Shield, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-charcoal min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requireAdmin && !isAdmin) {
    return (
      <div className="bg-charcoal min-h-screen pt-32 px-5 text-center">
        <Shield className="w-10 h-10 text-gold/30 mx-auto mb-4" />
        <h1 className="font-display text-3xl text-ivory mb-2">Admin Access Required</h1>
        <p className="text-ivory/40 font-body text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  return <Outlet />;
}
