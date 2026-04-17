import { useState } from 'react';
import { useLang } from '@/lib/useLang';
import { base44 } from '@/api/base44Client';
import { SITE_DEFAULTS } from '@/lib/siteData';
import { MapPin, Phone, Mail, CheckCircle, Instagram, Facebook } from 'lucide-react';

export default function Contact() {
  const { tr, lang } = useLang();
  const s = SITE_DEFAULTS;
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', message: '', inquiry_type: 'general' });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const TYPES = [
    { id: 'general', label: tr('contact', 'type_general') },
    { id: 'wedding', label: tr('contact', 'type_wedding') },
    { id: 'group', label: tr('contact', 'type_group') },
    { id: 'business', label: tr('contact', 'type_business') },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.ContactInquiry.create({
      ...form,
      language: lang,
      source: 'website',
    });
    base44.functions.invoke('sendContactEmail', {
      ...form, lang,
    }).catch(() => {});
    base44.functions.invoke('notifySlack', {
      type: 'contact',
      name: `${form.first_name} ${form.last_name}`,
      email: form.email,
      inquiry_type: form.inquiry_type,
      message: form.message.slice(0, 200),
    }).catch(() => {});
    setDone(true);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-amber-600 text-xs uppercase tracking-widest font-semibold mb-2">Krone Langenburg by Ammesso</p>
          <h1 className="text-4xl font-light text-stone-800 mb-2">{tr('contact', 'title')}</h1>
          <p className="text-stone-500">{tr('contact', 'subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h2 className="font-semibold text-stone-800 mb-4">{tr('contact', 'address_title')}</h2>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex gap-3">
                  <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>{s.address_street}<br />{s.address_zip} {s.address_city}<br />{s.address_country}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <a href={`tel:${s.phone}`} className="hover:text-amber-600 transition-colors">{s.phone}</a>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${s.email_info}`} className="hover:text-amber-600 transition-colors">{s.email_info}</a>
                </li>
              </ul>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+24%2C+74595+Langenburg"
                target="_blank" rel="noopener noreferrer"
                className="mt-5 block text-center py-3 border border-amber-600 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors text-sm"
              >
                {tr('contact', 'directions')}
              </a>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
              <h2 className="font-semibold text-stone-800 mb-4">{tr('home', 'hours_title')}</h2>
              <ul className="space-y-2 text-sm text-stone-600">
                <li className="flex justify-between"><span>{tr('home', 'monday')}</span><span className="text-stone-400">{tr('home', 'closed')}</span></li>
                <li>
                  <div className="font-medium">{tr('home', 'tue_sat')}</div>
                  <div className="text-stone-400 text-xs">{tr('home', 'lunch')}: 12:00–14:30 · {tr('home', 'dinner')}: 17:30–22:00</div>
                </li>
                <li>
                  <div className="font-medium">{tr('home', 'sunday')}</div>
                  <div className="text-stone-400 text-xs">12:00–20:00</div>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="flex gap-3">
              <a href={s.social_instagram} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-stone-100 text-stone-600 hover:text-amber-600 hover:border-amber-200 transition-colors text-sm shadow-sm">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <a href={s.social_facebook} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white rounded-xl border border-stone-100 text-stone-600 hover:text-amber-600 hover:border-amber-200 transition-colors text-sm shadow-sm">
                <Facebook className="w-4 h-4" /> Facebook
              </a>
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-3">
            {done ? (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-stone-800 mb-2">{tr('contact', 'success')}</h2>
                <p className="text-stone-500 text-sm">{s.email_info}</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Inquiry type */}
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-2">{tr('contact', 'inquiry_type')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {TYPES.map(t => (
                        <button key={t.id} type="button" onClick={() => setForm(f => ({ ...f, inquiry_type: t.id }))}
                          className={`px-3 py-2.5 rounded-xl text-sm border-2 text-left transition-all ${form.inquiry_type === t.id ? 'border-amber-600 bg-amber-50 text-amber-800 font-medium' : 'border-stone-200 text-stone-600'}`}>
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">{tr('contact', 'first_name')} *</label>
                      <input type="text" autoComplete="given-name" required value={form.first_name}
                        onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-1">{tr('contact', 'last_name')} *</label>
                      <input type="text" autoComplete="family-name" required value={form.last_name}
                        onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                        className="w-full border border-stone-200 rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">{tr('contact', 'email')} *</label>
                    <input type="email" autoComplete="email" required value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">{tr('contact', 'phone')}</label>
                    <input type="tel" autoComplete="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-1">{tr('contact', 'message')} *</label>
                    <textarea rows={5} required value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="w-full py-4 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors">
                    {submitting ? tr('common', 'loading') : tr('contact', 'send')}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}