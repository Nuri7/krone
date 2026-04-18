import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { FileText, Upload, Download, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
  { id: 'id_document', de: 'Ausweisdokument', en: 'ID Document', it: 'Documento d\'identità' },
  { id: 'invoice_data', de: 'Rechnungsdaten', en: 'Invoice Data', it: 'Dati fattura' },
  { id: 'event_attachment', de: 'Event-Anhang', en: 'Event Attachment', it: 'Allegato evento' },
  { id: 'verification', de: 'Verifizierung', en: 'Verification', it: 'Verifica' },
  { id: 'special_request', de: 'Sonderwunsch', en: 'Special Request', it: 'Richiesta speciale' },
  { id: 'other', de: 'Sonstiges', en: 'Other', it: 'Altro' },
];

const STATUS_LABELS = {
  uploaded: { de: 'Hochgeladen', en: 'Uploaded', it: 'Caricato', color: 'text-ivory/50' },
  under_review: { de: 'In Prüfung', en: 'Under Review', it: 'In revisione', color: 'text-gold' },
  approved: { de: 'Genehmigt', en: 'Approved', it: 'Approvato', color: 'text-emerald-400' },
  rejected: { de: 'Abgelehnt', en: 'Rejected', it: 'Rifiutato', color: 'text-red-400' },
};

export default function GuestDocuments() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [form, setForm] = useState({ category: 'other', description: '' });
  const fileRef = useRef(null);

  useEffect(() => {
    base44.auth.isAuthenticated().then(async auth => {
      if (!auth) { base44.auth.redirectToLogin(window.location.href); return; }
      const u = await base44.auth.me();
      setUser(u);
      const d = await base44.entities.GuestDocument.filter({ user_email: u.email }, '-created_date', 30).catch(() => []);
      setDocs(d);
      setLoading(false);
    });
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    const fd = new FormData();
    fd.append('file', file);
    fd.append('category', form.category);
    fd.append('description', form.description);
    const res = await base44.functions.invoke('guestDocumentUpload', fd);
    if (res.data?.error) {
      setUploadError(res.data.error);
    } else {
      setUploadSuccess(true);
      const updated = await base44.entities.GuestDocument.filter({ user_email: user.email }, '-created_date', 30).catch(() => []);
      setDocs(updated);
      fileRef.current.value = '';
      setForm({ category: 'other', description: '' });
      setTimeout(() => setUploadSuccess(false), 4000);
    }
    setUploading(false);
  }

  async function handleDownload(doc) {
    const res = await base44.functions.invoke('guestDocumentAccess', { document_id: doc.id });
    if (res.data?.signed_url) window.open(res.data.signed_url, '_blank');
  }

  const c = {
    de: { title: 'Meine Dokumente', back: 'Zurück zum Konto', upload_title: 'Dokument hochladen', category: 'Kategorie', desc: 'Beschreibung (optional)', file: 'Datei auswählen', submit: 'Hochladen', empty: 'Noch keine Dokumente hochgeladen', size: 'Max. 10 MB · PDF, JPG, PNG, Word', download: 'Herunterladen' },
    en: { title: 'My Documents', back: 'Back to Account', upload_title: 'Upload Document', category: 'Category', desc: 'Description (optional)', file: 'Choose File', submit: 'Upload', empty: 'No documents uploaded yet', size: 'Max 10 MB · PDF, JPG, PNG, Word', download: 'Download' },
    it: { title: 'I miei documenti', back: 'Torna al profilo', upload_title: 'Carica documento', category: 'Categoria', desc: 'Descrizione (opzionale)', file: 'Scegli file', submit: 'Carica', empty: 'Nessun documento caricato', size: 'Max 10 MB · PDF, JPG, PNG, Word', download: 'Scarica' },
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

        {/* Upload form */}
        <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-5 sm:p-6 mb-6">
          <h2 className="text-ivory/40 text-[10px] tracking-[0.3em] uppercase font-body mb-5">{t.upload_title}</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.category}</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputClass}>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {lang === 'de' ? cat.de : lang === 'en' ? cat.en : cat.it}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.desc}</label>
              <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className="block text-ivory/40 text-[10px] tracking-[0.25em] uppercase font-body mb-1.5">{t.file}</label>
              <input type="file" ref={fileRef} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                className="w-full text-ivory/50 text-sm font-body file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-[#C9A96E]/20 file:text-xs file:font-body file:text-gold/70 file:bg-transparent file:cursor-pointer hover:file:border-gold/40" />
              <p className="text-ivory/25 text-xs font-body mt-1">{t.size}</p>
            </div>

            {uploadError && (
              <div className="bg-red-950/40 border border-red-900/30 rounded-xl p-3 flex gap-2 text-sm text-red-300 font-body">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {uploadError}
              </div>
            )}
            {uploadSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-800/30 rounded-xl p-3 flex gap-2 text-sm text-emerald-300 font-body">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {lang === 'de' ? 'Dokument erfolgreich hochgeladen.' : lang === 'en' ? 'Document uploaded successfully.' : 'Documento caricato con successo.'}
              </div>
            )}

            <button type="submit" disabled={uploading}
              className="w-full py-3.5 btn-gold rounded-full text-xs tracking-[0.15em] uppercase font-body font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {uploading ? <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" /> : <><Upload className="w-3.5 h-3.5" /> {t.submit}</>}
            </button>
          </form>
        </div>

        {/* Document list */}
        {docs.length === 0 ? (
          <div className="glass-card border border-[#C9A96E]/08 rounded-xl p-8 text-center">
            <p className="text-ivory/30 text-sm font-body mb-2">{t.empty}</p>
            <p className="text-ivory/20 text-xs font-body">
              {lang === 'de' ? 'Laden Sie Dokumente hoch, die wir für Ihren Aufenthalt benötigen.' : lang === 'en' ? 'Upload documents we need for your stay.' : 'Caricate i documenti necessari per il vostro soggiorno.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {docs.map(doc => {
              const statusInfo = STATUS_LABELS[doc.status] || STATUS_LABELS.uploaded;
              const catInfo = CATEGORIES.find(c => c.id === doc.category);
              return (
                <div key={doc.id} className="glass-card border border-[#C9A96E]/08 rounded-xl p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-gold/40 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-ivory/80 text-sm font-body truncate">{doc.original_filename}</p>
                      <p className="text-ivory/30 text-xs font-body mt-0.5">
                        {catInfo ? (lang === 'de' ? catInfo.de : lang === 'en' ? catInfo.en : catInfo.it) : doc.category}
                        {doc.created_date ? ` · ${format(new Date(doc.created_date), 'dd.MM.yy')}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-body ${statusInfo.color}`}>{statusInfo[lang] || statusInfo.de}</span>
                    <button onClick={() => handleDownload(doc)}
                      className="p-2 text-ivory/30 hover:text-gold transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}