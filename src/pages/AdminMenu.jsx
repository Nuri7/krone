import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plus, Pencil, Trash2, Check, X, Star, Eye, EyeOff, RefreshCw } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const CATEGORIES = [
  { id: 'starters', de: 'Vorspeisen', en: 'Starters' },
  { id: 'mains', de: 'Pasta & Hauptgerichte', en: 'Mains' },
  { id: 'meat_fish', de: 'Fleisch & Fisch', en: 'Meat & Fish' },
  { id: 'sides', de: 'Beilagen', en: 'Sides' },
  { id: 'desserts', de: 'Desserts', en: 'Desserts' },
  { id: 'drinks', de: 'Getränke', en: 'Drinks' },
];

const EMPTY_ITEM = {
  category: 'mains', name_de: '', name_en: '', name_it: '',
  description_de: '', description_en: '', description_it: '',
  price: '', price_variant: '', price_variant_label_de: '', price_variant_label_en: '',
  is_vegetarian: false, is_vegan: false, is_featured: false, is_active: true,
  sort_order: 0, allergens: [], image_url: ''
};

const inputCls = "w-full bg-[#0F0D0B] border border-[#C9A96E]/15 rounded-xl px-3 py-2 text-sm text-ivory font-body focus:outline-none focus:border-gold/30 placeholder-ivory/20";

export default function AdminMenu() {
  const [access, setAccess] = useState('loading');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('starters');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) { setAccess('denied'); return; }
      setAccess('granted');
      loadItems();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadItems() {
    setLoading(true);
    const all = await base44.entities.MenuItem.list('sort_order', 500).catch(() => []);
    setItems(all);
    setLoading(false);
  }

  async function saveItem() {
    if (!editingItem?.name_de || !editingItem?.price) return;
    setSaving(true);
    const data = { ...editingItem, price: parseFloat(editingItem.price) || 0, price_variant: parseFloat(editingItem.price_variant) || undefined, sort_order: parseInt(editingItem.sort_order) || 0 };
    if (data.id) {
      await base44.entities.MenuItem.update(data.id, data);
    } else {
      await base44.entities.MenuItem.create(data);
    }
    setSaving(false);
    setShowForm(false);
    setEditingItem(null);
    await loadItems();
  }

  async function toggleActive(item) {
    await base44.entities.MenuItem.update(item.id, { is_active: !item.is_active });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_active: !i.is_active } : i));
  }

  async function toggleFeatured(item) {
    await base44.entities.MenuItem.update(item.id, { is_featured: !item.is_featured });
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_featured: !i.is_featured } : i));
  }

  async function deleteItem(id) {
    if (!confirm('Diesen Menüeintrag wirklich löschen?')) return;
    setDeletingId(id);
    await base44.entities.MenuItem.delete(id);
    setItems(prev => prev.filter(i => i.id !== id));
    setDeletingId(null);
  }

  if (access === 'loading') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>;
  if (access === 'denied') return <div className="min-h-screen bg-charcoal flex items-center justify-center"><p className="text-red-400 font-body">Zugang verweigert</p></div>;

  const catItems = items.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 pb-20 lg:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-5">

        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8 gap-3">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory">Speisekarte verwalten</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/admin" className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-gold text-xs font-body transition-colors">← Admin</Link>
            <button onClick={loadItems} className="px-3 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs transition-colors"><RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /></button>
            <button onClick={() => { setEditingItem({ ...EMPTY_ITEM, category: activeCategory }); setShowForm(true); }}
              className="flex items-center gap-1.5 px-4 py-2 btn-gold rounded-xl text-xs font-body font-semibold tracking-widest uppercase">
              <Plus className="w-3.5 h-3.5" /> Neues Gericht
            </button>
          </div>
        </div>

        {/* Item Form Modal */}
        {showForm && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4">
            <div className="glass-card border border-[#C9A96E]/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-light text-ivory">{editingItem.id ? 'Gericht bearbeiten' : 'Neues Gericht'}</h2>
                <button onClick={() => { setShowForm(false); setEditingItem(null); }}><X className="w-5 h-5 text-ivory/40 hover:text-ivory" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Kategorie</label>
                  <select value={editingItem.category} onChange={e => setEditingItem(p => ({ ...p, category: e.target.value }))} className={inputCls}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.de}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Name (DE) *</label>
                    <input type="text" value={editingItem.name_de} onChange={e => setEditingItem(p => ({ ...p, name_de: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Name (EN)</label>
                    <input type="text" value={editingItem.name_en || ''} onChange={e => setEditingItem(p => ({ ...p, name_en: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Name (IT)</label>
                    <input type="text" value={editingItem.name_it || ''} onChange={e => setEditingItem(p => ({ ...p, name_it: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beschreibung (DE)</label>
                    <textarea rows={3} value={editingItem.description_de || ''} onChange={e => setEditingItem(p => ({ ...p, description_de: e.target.value }))} className={inputCls + ' resize-none'} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beschreibung (EN)</label>
                    <textarea rows={3} value={editingItem.description_en || ''} onChange={e => setEditingItem(p => ({ ...p, description_en: e.target.value }))} className={inputCls + ' resize-none'} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Beschreibung (IT)</label>
                    <textarea rows={3} value={editingItem.description_it || ''} onChange={e => setEditingItem(p => ({ ...p, description_it: e.target.value }))} className={inputCls + ' resize-none'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Preis (€) *</label>
                    <input type="number" step="0.1" value={editingItem.price} onChange={e => setEditingItem(p => ({ ...p, price: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Preis 2 (€)</label>
                    <input type="number" step="0.1" value={editingItem.price_variant || ''} onChange={e => setEditingItem(p => ({ ...p, price_variant: e.target.value }))} className={inputCls} placeholder="Optional" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Variante Label DE</label>
                    <input type="text" value={editingItem.price_variant_label_de || ''} onChange={e => setEditingItem(p => ({ ...p, price_variant_label_de: e.target.value }))} className={inputCls} placeholder="z.B. mit Parmesan" />
                  </div>
                  <div>
                    <label className="text-ivory/40 text-[10px] uppercase tracking-widest font-body mb-1.5 block">Reihenfolge</label>
                    <input type="number" value={editingItem.sort_order || 0} onChange={e => setEditingItem(p => ({ ...p, sort_order: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-4">
                  {[
                    { key: 'is_active', label: 'Aktiv' },
                    { key: 'is_featured', label: 'Featured' },
                    { key: 'is_vegetarian', label: 'Vegetarisch' },
                    { key: 'is_vegan', label: 'Vegan' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <div onClick={() => setEditingItem(p => ({ ...p, [key]: !p[key] }))}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${editingItem[key] ? 'bg-gold border-gold' : 'border-[#C9A96E]/20'}`}>
                        {editingItem[key] && <Check className="w-3 h-3 text-charcoal" />}
                      </div>
                      <span className="text-ivory/60 text-sm font-body">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="flex-1 py-3 glass-card border border-[#C9A96E]/15 rounded-xl text-ivory/40 text-sm font-body">Abbrechen</button>
                <button onClick={saveItem} disabled={saving} className="flex-1 py-3 btn-gold rounded-xl text-sm font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Check className="w-4 h-4" /> Speichern</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="flex gap-1 bg-espresso rounded-xl p-1 mb-6 border border-[#C9A96E]/10 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(cat => {
            const count = items.filter(i => i.category === cat.id).length;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 py-2 px-3 rounded-lg text-xs font-body tracking-widest uppercase transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-gold text-charcoal font-semibold' : 'text-ivory/40 hover:text-ivory'}`}>
                {cat.de}
                {count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-charcoal/20 text-charcoal' : 'bg-ivory/10 text-ivory/50'}`}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* Items list */}
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" /></div>
        ) : catItems.length === 0 ? (
          <div className="text-center py-16 glass-card border border-[#C9A96E]/08 rounded-2xl">
            <p className="text-ivory/30 text-sm font-body mb-4">Keine Einträge in dieser Kategorie.</p>
            <button onClick={() => { setEditingItem({ ...EMPTY_ITEM, category: activeCategory }); setShowForm(true); }}
              className="text-gold/60 hover:text-gold text-xs font-body tracking-widest uppercase">+ Ersten Eintrag hinzufügen</button>
          </div>
        ) : (
          <div className="space-y-2">
            {catItems.map(item => (
              <div key={item.id} className={`glass-card border rounded-xl p-4 transition-all ${item.is_active ? 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20' : 'border-[#C9A96E]/04 opacity-50'}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-body text-sm text-ivory">{item.name_de}</span>
                      {item.is_featured && <Star className="w-3.5 h-3.5 text-gold fill-gold/40" />}
                      {item.is_vegetarian && <span className="text-[10px] font-body text-emerald-400 border border-emerald-800/30 px-1.5 py-0.5 rounded-full">VEG</span>}
                      {item.is_vegan && <span className="text-[10px] font-body text-green-400 border border-green-800/30 px-1.5 py-0.5 rounded-full">VEGAN</span>}
                    </div>
                    {item.description_de && <p className="text-ivory/35 text-xs font-body line-clamp-1">{item.description_de}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-ivory font-body text-sm font-medium">{item.price?.toFixed(2)} €</span>
                    <button onClick={() => toggleFeatured(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_featured ? 'text-gold' : 'text-ivory/20 hover:text-gold/50'}`} title="Featured"><Star className="w-3.5 h-3.5" /></button>
                    <button onClick={() => toggleActive(item)} className={`p-1.5 rounded-lg transition-colors ${item.is_active ? 'text-emerald-400' : 'text-ivory/20'}`} title={item.is_active ? 'Deaktivieren' : 'Aktivieren'}>
                      {item.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => { setEditingItem({ ...item }); setShowForm(true); }} className="p-1.5 text-ivory/30 hover:text-gold rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteItem(item.id)} disabled={deletingId === item.id} className="p-1.5 text-ivory/20 hover:text-red-400 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
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