import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, Check, X, Calendar, Clock, Users, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const EMPTY_EVENT = {
  title_de: '', title_en: '', title_it: '',
  description_de: '', description_en: '', description_it: '',
  event_date: format(new Date(), 'yyyy-MM-dd'), event_time: '19:00', event_end_time: '22:00',
  event_type: 'dinner', location_de: 'Kulinarium by Ammesso',
  price_per_person: '', max_guests: '', current_guests: 0,
  is_published: false, is_sold_out: false, booking_required: true,
  image_url: '', internal_notes: ''
};

const TYPE_LABELS = {
  dinner: 'Dinner Event', brunch: 'Brunch', wine_evening: 'Weinabend',
  live_music: 'Live Musik', private: 'Privat', seasonal: 'Saisonal', other: 'Sonstiges'
};

const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 placeholder-ivory/20";

export default function AdminEvents() {
  const [access, setAccess] = useState('loading');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) { setAccess('denied'); return; }
      setAccess('granted');
      loadEvents();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadEvents() {
    setLoading(true);
    const all = await base44.entities.Event.list('-event_date', 200).catch(() => []);
    setEvents(all);
    setLoading(false);
  }

  async function saveEvent() {
    if (!editingEvent?.title_de || !editingEvent?.event_date) return;
    setSaving(true);
    const data = {
      ...editingEvent,
      price_per_person: parseFloat(editingEvent.price_per_person) || 0,
      max_guests: parseInt(editingEvent.max_guests) || 0,
      current_guests: parseInt(editingEvent.current_guests) || 0,
    };
    if (data.id) {
      await base44.entities.Event.update(data.id, data);
    } else {
      await base44.entities.Event.create(data);
    }
    setSaving(false);
    setShowForm(false);
    setEditingEvent(null);
    await loadEvents();
  }

  async function togglePublished(event) {
    await base44.entities.Event.update(event.id, { is_published: !event.is_published });
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, is_published: !e.is_published } : e));
  }

  async function deleteEvent(id) {
    if (!confirm('Event wirklich löschen?')) return;
    await base44.entities.Event.delete(id);
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  if (access === 'loading') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  if (access === 'denied') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><p className="text-red-400 font-body">Zugang verweigert</p></div>;

  const today = new Date().toISOString().split('T')[0];
  const filtered = events.filter(e => {
    if (filter === 'upcoming') return e.event_date >= today;
    if (filter === 'past') return e.event_date < today;
    if (filter === 'published') return e.is_published;
    if (filter === 'draft') return !e.is_published;
    return true;
  });

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 pb-20 lg:pb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Events verwalten</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">← Admin</Link>
            <button onClick={loadEvents} className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs transition-colors"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={() => { setEditingEvent({ ...EMPTY_EVENT }); setShowForm(true); }}
              className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
              <Plus className="w-3.5 h-3.5" /> Neues Event
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4">
            <div className="glass-card border border-[#C9A96E]/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-ivory">{editingEvent.id ? 'Event bearbeiten' : 'Neues Event'}</h2>
                <button onClick={() => { setShowForm(false); setEditingEvent(null); }}><X className="w-5 h-5 text-ivory/40" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Titel (DE) *</label>
                    <input type="text" value={editingEvent.title_de} onChange={e => setEditingEvent(p => ({ ...p, title_de: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Titel (EN)</label>
                    <input type="text" value={editingEvent.title_en || ''} onChange={e => setEditingEvent(p => ({ ...p, title_en: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Titel (IT)</label>
                    <input type="text" value={editingEvent.title_it || ''} onChange={e => setEditingEvent(p => ({ ...p, title_it: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beschreibung (DE)</label>
                    <textarea rows={3} value={editingEvent.description_de || ''} onChange={e => setEditingEvent(p => ({ ...p, description_de: e.target.value }))} className={inputCls + ' resize-none'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Datum *</label>
                    <input type="date" value={editingEvent.event_date} onChange={e => setEditingEvent(p => ({ ...p, event_date: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beginn</label>
                    <input type="time" value={editingEvent.event_time || ''} onChange={e => setEditingEvent(p => ({ ...p, event_time: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Ende</label>
                    <input type="time" value={editingEvent.event_end_time || ''} onChange={e => setEditingEvent(p => ({ ...p, event_end_time: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Art</label>
                    <select value={editingEvent.event_type} onChange={e => setEditingEvent(p => ({ ...p, event_type: e.target.value }))} className={inputCls}>
                      {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Preis / Person (€)</label>
                    <input type="number" step="0.5" value={editingEvent.price_per_person || ''} onChange={e => setEditingEvent(p => ({ ...p, price_per_person: e.target.value }))} className={inputCls} placeholder="0 = kostenlos" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Max. Gäste</label>
                    <input type="number" value={editingEvent.max_guests || ''} onChange={e => setEditingEvent(p => ({ ...p, max_guests: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Angemeldet</label>
                    <input type="number" value={editingEvent.current_guests || 0} onChange={e => setEditingEvent(p => ({ ...p, current_guests: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Bild URL</label>
                  <input type="url" value={editingEvent.image_url || ''} onChange={e => setEditingEvent(p => ({ ...p, image_url: e.target.value }))} className={inputCls} placeholder="https://..." />
                </div>
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Interne Notizen</label>
                  <textarea rows={2} value={editingEvent.internal_notes || ''} onChange={e => setEditingEvent(p => ({ ...p, internal_notes: e.target.value }))} className={inputCls + ' resize-none'} />
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'is_published', label: 'Veröffentlicht' },
                    { key: 'is_sold_out', label: 'Ausgebucht' },
                    { key: 'booking_required', label: 'Anmeldung erforderlich' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer" onClick={() => setEditingEvent(p => ({ ...p, [key]: !p[key] }))}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${editingEvent[key] ? 'bg-gold border-gold' : 'border-[#C9A96E]/20'}`}>
                        {editingEvent[key] && <Check className="w-3 h-3 text-charcoal" />}
                      </div>
                      <span className="text-ivory/60 text-sm font-body">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowForm(false); setEditingEvent(null); }} className="flex-1 py-3 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                <button onClick={saveEvent} disabled={saving} className="flex-1 py-3 btn-gold rounded-xl text-sm font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Speichern</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-1 bg-espresso rounded-xl p-1 mb-6 border border-[#C9A96E]/10 overflow-x-auto no-scrollbar">
          {[
            { id: 'upcoming', label: 'Kommend' },
            { id: 'past', label: 'Vergangen' },
            { id: 'published', label: 'Veröffentlicht' },
            { id: 'draft', label: 'Entwurf' },
            { id: 'all', label: 'Alle' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`flex-shrink-0 py-2 px-3 rounded-lg text-xs font-body tracking-widest uppercase transition-all whitespace-nowrap ${filter === f.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass-card border border-[#C9A96E]/08 rounded-2xl">
            <p className="text-ivory/30 text-sm font-body mb-4">Keine Events in dieser Ansicht.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(event => (
              <div key={event.id} className={`glass-card border rounded-xl p-4 transition-all ${event.is_published ? 'border-[#C9A96E]/10' : 'border-[#C9A96E]/04 opacity-60'} hover:border-[#C9A96E]/25`}>
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-ivory">{event.title_de}</span>
                      {event.is_published ? (
                        <span className="text-[10px] font-body text-emerald-400 border border-emerald-800/30 px-2 py-0.5 rounded-full">Veröffentlicht</span>
                      ) : (
                        <span className="text-[10px] font-body text-ivory/30 border border-ivory/10 px-2 py-0.5 rounded-full">Entwurf</span>
                      )}
                      {event.is_sold_out && <span className="text-[10px] font-body text-red-400 border border-red-800/30 px-2 py-0.5 rounded-full">Ausgebucht</span>}
                      <span className="text-[10px] font-body text-gold/60">{TYPE_LABELS[event.event_type]}</span>
                    </div>
                    <div className="flex items-center gap-3 text-ivory/40 text-xs font-body flex-wrap">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{event.event_date}</span>
                      {event.event_time && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.event_time}</span>}
                      {event.max_guests > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.current_guests || 0}/{event.max_guests}</span>}
                      {event.price_per_person > 0 && <span>{event.price_per_person?.toFixed(2)} € / Person</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => togglePublished(event)} className={`p-1.5 rounded-lg transition-colors ${event.is_published ? 'text-emerald-400' : 'text-ivory/20 hover:text-emerald-400'}`} title="Veröffentlicht umschalten">
                      {event.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { setEditingEvent({ ...event }); setShowForm(true); }} className="p-1.5 text-ivory/30 hover:text-gold rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteEvent(event.id)} className="p-1.5 text-ivory/20 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}