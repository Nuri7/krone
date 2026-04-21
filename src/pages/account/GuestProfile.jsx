import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';

export default function GuestProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('profiles').upsert({ id: user.id, ...form });
      }
      toast.success('Profile updated!');
    } catch { toast.error('Failed to save.'); }
    finally { setSaving(false); }
  }

  if (!user) return <div className="bg-charcoal min-h-screen pt-32 px-5 text-center text-ivory/40">Please log in.</div>;

  return (
    <div className="bg-charcoal min-h-screen pt-24 sm:pt-28 pb-20 px-5">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-4xl text-ivory mb-8">My Profile</h1>
        <form onSubmit={handleSave} className="glass-card rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Email</label>
            <input type="email" value={user.email} disabled className="input-dark opacity-50" />
          </div>
          <div>
            <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Full Name</label>
            <input type="text" value={form.full_name} onChange={e=>setForm({...form,full_name:e.target.value})} className="input-dark" />
          </div>
          <div>
            <label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Phone</label>
            <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-dark" />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-3.5 h-3.5" /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
