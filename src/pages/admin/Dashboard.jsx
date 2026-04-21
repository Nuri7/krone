import { BarChart3 } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-4xl text-ivory mb-8">Dashboard</h1>
        <div className="glass-card rounded-2xl p-8 text-center">
          <BarChart3 className="w-10 h-10 text-gold/30 mx-auto mb-4" />
          <p className="text-ivory/40 font-body text-sm">Analytics dashboard will show reservation stats, revenue, and guest insights from Supabase.</p>
        </div>
      </div>
    </div>
  );
}
