import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useLang } from '@/lib/useLang';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Calendar, Users, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

export default function Dashboard() {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    pendingReservations: 0,
    cancelledReservations: 0,
    totalBookingIntents: 0,
    guestMessages: 0,
  });
  const [chartData, setChartData] = useState({
    reservationTrend: [],
    reservationStatus: [],
    bookingStatus: [],
    activityByDay: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      setLoading(true);
      const [reservations, intents, messages] = await Promise.all([
        base44.entities.Reservation.list('-created_date', 500).catch(() => []),
        base44.entities.BookingIntent.list('-created_date', 500).catch(() => []),
        base44.entities.GuestMessage.list('-created_date', 500).catch(() => []),
      ]);

      // Calculate metrics
      const confirmed = reservations.filter(r => r.status === 'confirmed').length;
      const pending = reservations.filter(r => r.status === 'pending').length;
      const cancelled = reservations.filter(r => r.status === 'cancelled').length;

      setMetrics({
        totalReservations: reservations.length,
        confirmedReservations: confirmed,
        pendingReservations: pending,
        cancelledReservations: cancelled,
        totalBookingIntents: intents.length,
        guestMessages: messages.length,
      });

      // Prepare chart data - Last 14 days
      const today = new Date();
      const activityByDay = [];
      for (let i = 13; i >= 0; i--) {
        const date = startOfDay(subDays(today, i));
        const dateStr = format(date, 'yyyy-MM-dd');
        const resCount = reservations.filter(r => r.created_date?.startsWith(dateStr)).length;
        const intentCount = intents.filter(i => i.created_date?.startsWith(dateStr)).length;
        activityByDay.push({
          date: format(date, 'MMM dd'),
          reservations: resCount,
          bookings: intentCount,
        });
      }

      // Reservation status breakdown
      const reservationStatus = [
        { name: lang === 'de' ? 'Bestätigt' : lang === 'en' ? 'Confirmed' : 'Confermato', value: confirmed, color: '#10b981' },
        { name: lang === 'de' ? 'Ausstehend' : lang === 'en' ? 'Pending' : 'In attesa', value: pending, color: '#f59e0b' },
        { name: lang === 'de' ? 'Abgesagt' : lang === 'en' ? 'Cancelled' : 'Annullato', value: cancelled, color: '#ef4444' },
      ];

      // Booking intent status
      const redirected = intents.filter(i => i.status === 'redirected').length;
      const syncedConfirmed = intents.filter(i => i.status === 'synced_confirmed').length;
      const bookingStatus = [
        { name: lang === 'de' ? 'Weitergeleitet' : 'Redirected', value: redirected, color: '#3b82f6' },
        { name: lang === 'de' ? 'Synchronisiert' : 'Synced', value: syncedConfirmed, color: '#8b5cf6' },
        { name: lang === 'de' ? 'Sonstiges' : 'Other', value: intents.length - redirected - syncedConfirmed, color: '#6b7280' },
      ];

      setChartData({
        reservationTrend: activityByDay,
        reservationStatus,
        bookingStatus,
        activityByDay,
      });
      setLoading(false);
    } catch (error) {
      console.error('Dashboard load error:', error);
      setLoading(false);
    }
  }

  const C = {
    de: {
      title: 'Dashboard',
      subtitle: 'Plattformleistung & Aktivitätsübersicht',
      metrics: 'Schlüsselmetriken',
      charts: 'Aktivitätsanalyse',
      total_reservations: 'Gesamtreservierungen',
      confirmed: 'Bestätigt',
      pending: 'Ausstehend',
      cancelled: 'Abgesagt',
      total_intents: 'Buchungsintents',
      messages: 'Gästenachrichten',
      activity_trend: 'Aktivitätstrend (14 Tage)',
      status_breakdown: 'Reservierungsstatus',
      booking_breakdown: 'Buchungsstatus',
    },
    en: {
      title: 'Dashboard',
      subtitle: 'Platform Performance & Activity Overview',
      metrics: 'Key Metrics',
      charts: 'Activity Analytics',
      total_reservations: 'Total Reservations',
      confirmed: 'Confirmed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      total_intents: 'Booking Intents',
      messages: 'Guest Messages',
      activity_trend: 'Activity Trend (14 Days)',
      status_breakdown: 'Reservation Status',
      booking_breakdown: 'Booking Status',
    },
    it: {
      title: 'Dashboard',
      subtitle: 'Panoramica delle prestazioni e dell\'attività',
      metrics: 'Metriche chiave',
      charts: 'Analitiche di attività',
      total_reservations: 'Prenotazioni totali',
      confirmed: 'Confermato',
      pending: 'In attesa',
      cancelled: 'Annullato',
      total_intents: 'Intenti di prenotazione',
      messages: 'Messaggi ospiti',
      activity_trend: 'Tendenza attività (14 giorni)',
      status_breakdown: 'Status prenotazione',
      booking_breakdown: 'Status prenotazione',
    },
  };
  const c = C[lang] || C.de;

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ivory/30 text-sm font-body">…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal text-ivory pt-16 sm:pt-20 pb-28 lg:pb-10 px-4 sm:px-5">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-light text-ivory mb-2">{c.title}</h1>
          <p className="text-ivory/40 font-body text-sm">{c.subtitle}</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <MetricCard
            icon={Calendar}
            label={c.total_reservations}
            value={metrics.totalReservations}
            color="text-blue-400"
          />
          <MetricCard
            icon={CheckCircle}
            label={c.confirmed}
            value={metrics.confirmedReservations}
            color="text-emerald-400"
          />
          <MetricCard
            icon={Clock}
            label={c.pending}
            value={metrics.pendingReservations}
            color="text-amber-400"
          />
          <MetricCard
            icon={Users}
            label={c.total_intents}
            value={metrics.totalBookingIntents}
            color="text-purple-400"
          />
          <MetricCard
            icon={MessageSquare}
            label={c.messages}
            value={metrics.guestMessages}
            color="text-pink-400"
          />
          <MetricCard
            icon={TrendingUp}
            label={c.cancelled}
            value={metrics.cancelledReservations}
            color="text-red-400"
          />
        </div>

        {/* Charts */}
        <div className="space-y-6">

          {/* Activity Trend Chart */}
          <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6">
            <h2 className="font-display text-2xl font-light text-ivory mb-6">{c.activity_trend}</h2>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" height={300} minWidth={500}>
                <LineChart data={chartData.reservationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,110,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(245,239,227,0.4)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(245,239,227,0.4)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1410', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px' }}
                    labelStyle={{ color: '#F5EFE3' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="reservations" stroke="#3b82f6" strokeWidth={2} name={lang === 'de' ? 'Reservierungen' : 'Reservations'} />
                  <Line type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} name={lang === 'de' ? 'Buchungen' : 'Bookings'} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Charts - Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Reservation Status */}
            <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6">
              <h3 className="font-display text-xl font-light text-ivory mb-6">{c.status_breakdown}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData.reservationStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.reservationStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1410', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px', color: '#F5EFE3' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Booking Status */}
            <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6">
              <h3 className="font-display text-xl font-light text-ivory mb-6">{c.booking_breakdown}</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData.bookingStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,169,110,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(245,239,227,0.4)" style={{ fontSize: '12px' }} />
                  <YAxis stroke="rgba(245,239,227,0.4)" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1A1410', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '8px', color: '#F5EFE3' }}
                  />
                  <Bar dataKey="value" fill="#C9A96E" radius={[8, 8, 0, 0]}>
                    {chartData.bookingStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card border border-[#C9A96E]/10 rounded-2xl p-6 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full bg-[#1A1410] border border-[#C9A96E]/10 flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-ivory/40 text-xs font-body uppercase tracking-wider mb-1">{label}</p>
        <p className="font-display text-3xl font-light text-ivory">{value}</p>
      </div>
    </div>
  );
}