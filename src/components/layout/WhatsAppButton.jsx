import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { SITE } from '@/lib/siteData';

export default function WhatsAppButton() {
  const [expanded, setExpanded] = useState(false);

  const waUrl = `https://wa.me/${SITE.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Krone Langenburg!')}`;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-[45]">
      {/* Expanded tooltip */}
      {expanded && (
        <div className="absolute bottom-14 right-0 bg-white rounded-2xl shadow-2xl p-4 w-64 animate-fade-in">
          <button
            onClick={() => setExpanded(false)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-stone-400 hover:text-stone-600 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="text-stone-800 font-body text-sm font-medium mb-1">Chat with us!</p>
          <p className="text-stone-500 font-body text-xs mb-3">
            Questions about reservations, rooms or events? We usually respond within 2 hours.
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-body font-semibold tracking-wider"
          >
            <Send className="w-3.5 h-3.5" /> Open WhatsApp
          </a>
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all animate-pulse-gold"
        aria-label="Chat on WhatsApp"
      >
        <span className="text-lg">💬</span>
      </button>
    </div>
  );
}
