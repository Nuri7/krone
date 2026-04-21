import { FileText } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function GuestDocuments() {
  const { user } = useAuth();
  if (!user) return <div className="bg-charcoal min-h-screen pt-32 px-5 text-center text-ivory/40">Please log in.</div>;

  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl text-ivory mb-8">Documents</h1>
        <div className="glass-card rounded-2xl p-8 text-center">
          <FileText className="w-8 h-8 text-gold/30 mx-auto mb-4" />
          <p className="text-ivory/40 font-body text-sm">No documents yet. Invoices and confirmations will appear here.</p>
        </div>
      </div>
    </div>
  );
}
