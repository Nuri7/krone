import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { CheckCircle, ArrowLeft, Save } from 'lucide-react';

export default function GuestProfile() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '',
    address_street: '', address_city: '', address_zip: '', address_country: 'Deutschland',
    dietary_notes: '', preferences: '', language: lang,
    newsletter_opt_in: false, gdpr_consent: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async auth => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      const existing = await base44.entities.GuestProfile.filter({ user_email: u.email }).catch(() => []);
      if (existing.length > 0) {
        setProfile(existing[0]);
        setForm(f => ({ ...f, ...existing[0] }));
      } else {
        // Pre-fill from auth name
        const parts = (u.full_name || '').split(' ');
        setForm(f => ({ ...f, first_name: parts[0] || '', last_name: parts.slice(1).join(' ') || '' }));
      }
      setLoading(false);
    });
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const data = { ...form, user_email: user.email, gdpr_consent_date: form.gdpr_consent ? new Date().toISOString() : undefined };
    if (profile) {
      await base44.entities.GuestProfile.update(profile.id, data);
    } else {
      const np = await base44.entities.GuestProfile.create(data);
      setProfile(np);
    }
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const c = {
    de: { title: 'Profil & Einstellungen', save: 'Speichern', saved: 'Gespeichert', back: 'Zurück zum Konto', first: 'Vorname', last: 'Nachname', phone: 'Telefon', street: 'Straße & Hausnummer', city: 'Stadt', zip: 'PLZ', country: 'Land', dietary: 'Ernährungshinweise / Allergien', prefs: 'Bevorzugungen & Wünsche', lang_label: 'Bevorzugte Sprache', newsletter: 'Ich möchte den Newsletter erhalten', gdpr: 'Ich stimme der Verarbeitung meiner Daten gemäß Datenschutzerklärung zu *' },
    en: { title: 'Profile & Settings', save: 'Save', saved: 'Saved', back: 'Back to Account', first: 'First Name', last: 'Last Name', phone: 'Phone', street: 'Street & Number', city: 'City', zip: 'ZIP Code', country: 'Country', dietary: 'Dietary Notes / Allergies', prefs: 'Preferences & Wishes', lang_label: 'Preferred Language', newsletter: 'I would like to receive the newsletter', gdpr: 'I agree to the processing of my data per the Privacy Policy *' },
    it: { title: 'Profilo e impostazioni', save: 'Salva', saved: 'Salvato', back: 'Torna al profilo', first: 'Nome', last: 'Cognome', phone: 'Telefono', street: 'Via e numero civico', city: 'Città', zip: 'CAP', country: 'Paese', dietary: 'Note alimentari / allergie', prefs: 'Preferenze e desideri', lang_label: 'Lingua preferita', newsletter: 'Desidero ricevere la newsletter', gdpr: 'Acconsento al trattamento dei miei dati secondo la Privacy Policy *' },
  };
  const t = c[lang] || c.de;

  const inputClass = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-4 py-3 text-sm text-ivory font-body focus:outline-none focus:border-gold/40 transition-colors";

  if (loading) return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-7 h-7 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-28 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-xl mx-auto">
        <Link to="/account" className="flex items-center gap-2 text-ivory/30 hover:text-ivory text-xs font-body tracking-widest uppercase mb-6 sm:mb-8 transition-colors mt-4">
          <ArrowLeft className="w-3.5 h-3.5" /> {t.back}
        </Link>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory mb-6 sm:mb-8">{t.title}</h1>

        <form onSubmit={handleSave} className="space-y-5">
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.first}</label>
                <input type="text" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.last}</label>
                <input type="text" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.phone}</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 space-y-4">
            <p className="text-ivory/30 text-[10px] tracking-[0.3em] uppercase font-body mb-1">
              {lang === 'de' ? 'Adresse' : lang === 'en' ? 'Address' : 'Indirizzo'}
            </p>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.street}</label>
              <input type="text" value={form.address_street} onChange={e => setForm(f => ({ ...f, address_street: e.target.value }))} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.zip}</label>
                <input type="text" value={form.address_zip} onChange={e => setForm(f => ({ ...f, address_zip: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.city}</label>
                <input type="text" value={form.address_city} onChange={e => setForm(f => ({ ...f, address_city: e.target.value }))} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.country}</label>
              <input type="text" value={form.address_country} onChange={e => setForm(f => ({ ...f, address_country: e.target.value }))} className={inputClass} />
            </div>
          </div>

          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.dietary}</label>
              <textarea rows={2} value={form.dietary_notes} onChange={e => setForm(f => ({ ...f, dietary_notes: e.target.value }))} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.prefs}</label>
              <textarea rows={2} value={form.preferences} onChange={e => setForm(f => ({ ...f, preferences: e.target.value }))} className={`${inputClass} resize-none`} />
            </div>
          </div>

          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.newsletter_opt_in} onChange={e => setForm(f => ({ ...f, newsletter_opt_in: e.target.checked }))}
                className="mt-0.5 accent-gold" />
              <span className="text-ivory/50 text-xs font-body leading-relaxed">{t.newsletter}</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={form.gdpr_consent} onChange={e => setForm(f => ({ ...f, gdpr_consent: e.target.checked }))}
                className="mt-0.5 accent-gold" />
              <span className="text-ivory/50 text-xs font-body leading-relaxed">{t.gdpr}</span>
            </label>
          </div>

          <button type="submit" disabled={saving}
            className="w-full py-4 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
            {saved ? <><CheckCircle className="w-4 h-4" /> {t.saved}</> : saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> {t.save}</>}
          </button>
        </form>
      </div>
    </div>
  );
}