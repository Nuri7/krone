import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Briefcase, UtensilsCrossed, Send, Loader2, Check } from 'lucide-react';
import { SITE, EVENT_TYPES } from '@/lib/siteData';
import { FadeUp } from '@/components/shared/Animations';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';
import { toast } from 'sonner';

const FEATURES = [
  { icon: Heart, title: "Weddings", desc: "Your dream day in a historic setting." },
  { icon: Users, title: "Private Events", desc: "Birthdays, anniversaries, family gatherings." },
  { icon: Briefcase, title: "Corporate", desc: "Professional hospitality in elegant surroundings." },
  { icon: UtensilsCrossed, title: "Private Dining", desc: "Exclusive dining for 20–120 guests." },
];

export default function Weddings() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', event_type:'', date:'', guests:'', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('contact_inquiries').insert({ type:'event', ...form });
      }
      setSent(true);
      toast.success('Enquiry sent!');
    } catch { toast.error('Something went wrong.'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="bg-charcoal">
      <section className="relative h-[60vh] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1800&q=80" alt="Wedding" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal" />
        <div className="absolute inset-0 flex items-end pb-16 px-5">
          <div className="max-w-7xl mx-auto w-full">
            <span className="text-gold text-[10px] tracking-[0.35em] uppercase font-body font-semibold">Celebrate with Us</span>
            <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mt-2">Weddings & Events</h1>
          </div>
        </div>
      </section>

      <section className="py-20 px-5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f,i) => (
            <FadeUp key={f.title} delay={i*60}>
              <div className="glass-card rounded-2xl p-6 text-center hover-lift h-full">
                <f.icon className="w-6 h-6 text-gold mx-auto mb-4" />
                <h3 className="font-display text-xl text-ivory mb-2">{f.title}</h3>
                <p className="text-ivory/35 text-sm font-body">{f.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <section className="py-20 px-5 bg-espresso">
        <div className="max-w-4xl mx-auto">
          <FadeUp><h2 className="font-display text-3xl text-ivory text-center mb-14">How It Works</h2></FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num:"01", title:"Tell Us Your Vision", desc:"Fill out the enquiry form with your ideas." },
              { num:"02", title:"We Plan Together", desc:"Our team will reach out within 48 hours." },
              { num:"03", title:"We Make It Happen", desc:"From menus to décor — we handle everything." },
            ].map((s,i) => (
              <FadeUp key={i} delay={i*80}>
                <div className="text-center">
                  <div className="text-gold font-display text-5xl font-light mb-3 opacity-30">{s.num}</div>
                  <h3 className="font-display text-xl text-ivory mb-2">{s.title}</h3>
                  <p className="text-ivory/35 text-sm font-body">{s.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-5" id="enquiry">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <h2 className="font-display text-3xl text-ivory text-center mb-10">Make an Enquiry</h2>
          </FadeUp>
          {sent ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Check className="w-10 h-10 text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl text-ivory mb-2">Thank You!</h3>
              <p className="text-ivory/40 font-body text-sm">We'll be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Name *</label>
                  <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-dark" /></div>
                <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Email *</label>
                  <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-dark" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Event Type *</label>
                  <select required value={form.event_type} onChange={e=>setForm({...form,event_type:e.target.value})} className="input-dark">
                    <option value="">Select...</option>
                    {EVENT_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                  </select></div>
                <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Expected Guests</label>
                  <input type="number" value={form.guests} onChange={e=>setForm({...form,guests:e.target.value})} className="input-dark" placeholder="e.g. 40" /></div>
              </div>
              <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Message</label>
                <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="input-dark min-h-[100px] resize-none" placeholder="Tell us about your vision..." /></div>
              <button type="submit" disabled={submitting} className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-3.5 h-3.5" /> Send Enquiry</>}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
