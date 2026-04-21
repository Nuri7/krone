import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, Check, ExternalLink } from 'lucide-react';
import { SITE, INQUIRY_TYPES } from '@/lib/siteData';
import { FadeUp } from '@/components/shared/Animations';
import { supabase, isSupabaseConfigured } from '@/api/supabaseClient';
import { toast } from 'sonner';

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', type:'general', message:'' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('contact_inquiries').insert(form);
      }
      setSent(true);
      toast.success('Message sent!');
    } catch { toast.error('Something went wrong.'); }
    finally { setSubmitting(false); }
  }

  return (
    <div className="bg-charcoal pt-24 sm:pt-28 pb-20">
      <section className="px-5 mb-14">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-light text-ivory mb-4">Get in Touch</h1>
          <p className="text-ivory/40 font-body text-base max-w-lg mx-auto">
            Questions, reservations, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-5 mb-12">
        <div className="max-w-2xl mx-auto">
          <a href={`https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener noreferrer"
            className="glass-card rounded-2xl p-6 flex items-center gap-4 hover-lift group block">
            <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center text-xl flex-shrink-0">💬</div>
            <div>
              <h3 className="text-ivory font-body font-medium group-hover:text-[#25D366] transition-colors">Chat on WhatsApp</h3>
              <p className="text-ivory/30 text-sm font-body">Quick questions? We usually respond within 2 hours.</p>
            </div>
          </a>
        </div>
      </section>

      <section className="px-5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, label: "Address", value: SITE.address.full, href: SITE.maps_url },
              { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone}` },
              { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
            ].map((item, i) => (
              <a key={i} href={item.href} target={item.icon === MapPin ? '_blank' : undefined}
                className="glass-card rounded-xl p-4 flex items-start gap-3 hover-lift group block">
                <item.icon className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-ivory/30 text-xs font-body mb-0.5">{item.label}</p>
                  <p className="text-ivory/60 text-sm font-body group-hover:text-ivory transition-colors">{item.value}</p>
                </div>
              </a>
            ))}
            <div className="glass-card rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <div className="text-sm font-body space-y-1">
                  <p className="text-ivory/30 text-xs mb-1">Opening Hours</p>
                  <p className="text-ivory/20">Monday — Closed</p>
                  <p className="text-ivory/50">Tue–Sat: 12:00–14:30 · 17:30–22:00</p>
                  <p className="text-ivory/50">Sunday: 12:00–20:00</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="glass-card rounded-2xl p-8 text-center">
                <Check className="w-10 h-10 text-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl text-ivory mb-2">Message Sent!</h3>
                <p className="text-ivory/40 font-body text-sm">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-4">
                <h2 className="font-display text-2xl text-ivory mb-2">Send a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Name *</label>
                    <input type="text" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-dark" /></div>
                  <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Email *</label>
                    <input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-dark" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Phone</label>
                    <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="input-dark" /></div>
                  <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Regarding</label>
                    <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="input-dark">
                      {INQUIRY_TYPES.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                    </select></div>
                </div>
                <div><label className="text-ivory/40 text-xs font-body tracking-wider uppercase mb-1.5 block">Message *</label>
                  <textarea required value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                    className="input-dark min-h-[120px] resize-none" placeholder="How can we help?" /></div>
                <button type="submit" disabled={submitting}
                  className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold flex items-center justify-center gap-2">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-3.5 h-3.5" /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="px-5 mt-14">
        <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden aspect-[2/1]">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=${SITE.maps_embed_key}&q=Hauptstra%C3%9Fe+24%2C+74595+Langenburg`}
            className="w-full h-full border-0" allowFullScreen loading="lazy" title="Location" />
        </div>
      </section>
    </div>
  );
}
