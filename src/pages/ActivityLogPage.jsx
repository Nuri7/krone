import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { Activity, RefreshCw, Search, Filter, XCircle } from 'lucide-react';

const ADMIN_EMAILS = ['oammesso@gmail.com', 'omarouardaoui0@gmail.com', 'norevok@gmail.com'];

const ACTION_COLORS = {
  reservation_created: 'text-blue-400 bg-blue-950/40 border-blue-800/30',
  reservation_confirmed: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/30',
  reservation_cancelled: 'text-red-400 bg-red-950/40 border-red-800/30',
  reservation_completed: 'text-ivory/40 bg-ivory/5 border-ivory/10',
  reservation_no_show: 'text-red-400/60 bg-red-950/20 border-red-900/20',
  booking_intent_created: 'text-purple-400 bg-purple-950/40 border-purple-800/30',
  booking_intent_redirected: 'text-purple-300 bg-purple-950/30 border-purple-800/20',
  contact_inquiry_submitted: 'text-sky-400 bg-sky-950/40 border-sky-800/30',
  guest_message_sent: 'text-pink-400 bg-pink-950/40 border-pink-800/30',
  guest_document_uploaded: 'text-amber-400 bg-amber-950/40 border-amber-800/30',
  guest_document_reviewed: 'text-amber-300 bg-amber-950/30 border-amber-800/20',
  guest_profile_updated: 'text-teal-400 bg-teal-950/40 border-teal-800/30',
  admin_login: 'text-gold bg-gold/10 border-gold/20',
  admin_status_change: 'text-gold/80 bg-gold/8 border-gold/15',
  admin_export: 'text-ivory/50 bg-ivory/5 border-ivory/10',
  site_settings_changed: 'text-orange-400 bg-orange-950/40 border-orange-800/30',
  user_login: 'text-ivory/40 bg-ivory/5 border-ivory/10',
  user_logout: 'text-ivory/30 bg-ivory/5 border-ivory/10',
};

const UNIQUE_ACTIONS = [
  'reservation_created', 'reservation_confirmed', 'reservation_cancelled',
  'reservation_completed', 'reservation_no_show',
  'booking_intent_created', 'booking_intent_redirected',
  'contact_inquiry_submitted', 'guest_message_sent',
  'guest_document_uploaded', 'guest_document_reviewed',
  'guest_profile_updated', 'admin_login', 'admin_status_change',
  'site_settings_changed', 'user_login', 'user_logout',
];

function ActionBadge({ action }) {
  const cls = ACTION_COLORS[action] || 'text-ivory/40 bg-ivory/5 border-ivory/10';
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-body font-medium border tracking-wider whitespace-nowrap ${cls}`}>
      {action.replace(/_/g, ' ')}
    </span>
  );
}

export default function ActivityLogPage() {
  const navigate = useNavigate();
  const [access, setAccess] = useState('loading');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u || (!ADMIN_EMAILS.includes(u.email) && u.role !== 'admin')) {
        setAccess('denied');
        return;
      }
      setAccess('granted');
      loadLogs();
    }).catch(() => setAccess('denied'));
  }, []);

  async function loadLogs() {
    setLoading(true);
    const data = await base44.entities.ActivityLog.list('-performed_at', 200);
    setLogs(data);
    setLoading(false);
  }

  const filtered = logs.filter(l => {
    const matchesSearch = !search ||
      l.actor_email?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_ref?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = !filterAction || l.action === filterAction;
    return matchesSearch && matchesAction;
  });

  if (access === 'loading') {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (access === 'denied') {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-5">
        <div className="text-center glass-card border border-red-900/30 rounded-2xl p-10 max-w-sm">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-light text-ivory mb-2">Zugang verweigert</h1>
          <button onClick={() => navigate('/')} className="mt-6 px-6 py-3 btn-gold rounded-full text-xs uppercase tracking-widest font-body font-semibold">Startseite</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-20 pb-16 px-4 sm:px-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between py-6 sm:py-8 gap-4">
          <div>
            <p className="text-gold text-[10px] tracking-[0.4em] uppercase font-body mb-1">Admin</p>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-ivory flex items-center gap-3">
              <Activity className="w-7 h-7 text-gold/60" /> Activity Log
            </h1>
            <p className="text-ivory/30 text-xs font-body mt-1">{logs.length} Einträge gesamt</p>
          </div>
          <button onClick={loadLogs} className="flex items-center gap-2 px-4 py-2 glass-card border border-[#C9A96E]/10 rounded-xl text-ivory/40 hover:text-ivory text-xs font-body transition-colors flex-shrink-0">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Aktualisieren</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/25" />
            <input
              type="text"
              placeholder="Suche nach E-Mail, Beschreibung, Ref …"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#1A1410] border border-[#C9A96E]/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-ivory placeholder-ivory/25 focus:outline-none focus:border-gold/30 font-body"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ivory/25" />
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="bg-[#1A1410] border border-[#C9A96E]/15 rounded-xl pl-9 pr-4 py-2.5 text-sm text-ivory/70 focus:outline-none focus:border-gold/30 font-body appearance-none min-w-[180px]"
            >
              <option value="">Alle Aktionen</option>
              {UNIQUE_ACTIONS.map(a => (
                <option key={a} value={a}>{a.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Log list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-ivory/25 font-body text-sm">Keine Einträge gefunden.</div>
        ) : (
          <div className="space-y-2">
            {filtered.map(log => {
              const expanded = expandedId === log.id;
              return (
                <div key={log.id}
                  className={`glass-card border rounded-xl transition-all ${expanded ? 'border-gold/25' : 'border-[#C9A96E]/08 hover:border-[#C9A96E]/20'}`}>
                  <button
                    onClick={() => setExpandedId(expanded ? null : log.id)}
                    className="w-full text-left p-4"
                  >
                    <div className="flex items-start gap-3 flex-wrap">
                      <ActionBadge action={log.action} />
                      <span className="text-ivory/70 text-sm font-body flex-1 min-w-0 text-left">{log.description}</span>
                      <span className="text-ivory/25 text-xs font-body flex-shrink-0">
                        {log.performed_at ? format(new Date(log.performed_at), 'dd.MM.yy HH:mm') : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-ivory/35 text-xs font-body">{log.actor_email}</span>
                      {log.actor_role && (
                        <span className="text-[10px] text-ivory/20 border border-ivory/10 px-1.5 py-0.5 rounded font-body">{log.actor_role}</span>
                      )}
                      {log.entity_ref && (
                        <span className="text-gold/50 text-xs font-body">· {log.entity_ref}</span>
                      )}
                    </div>
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-[#C9A96E]/08 mt-1">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-body">
                        {log.entity_type && (
                          <div>
                            <span className="text-ivory/25 block mb-0.5">Entity</span>
                            <span className="text-ivory/60">{log.entity_type}</span>
                          </div>
                        )}
                        {log.entity_id && (
                          <div>
                            <span className="text-ivory/25 block mb-0.5">Entity ID</span>
                            <span className="text-ivory/40 font-mono text-[10px] break-all">{log.entity_id}</span>
                          </div>
                        )}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <div className="col-span-2 sm:col-span-3">
                            <span className="text-ivory/25 block mb-1">Metadata</span>
                            <pre className="bg-[#0F0D0B] rounded-lg p-3 text-[10px] text-ivory/40 overflow-x-auto whitespace-pre-wrap">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}