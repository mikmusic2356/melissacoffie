import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  FileText,
  CheckCircle2,
  XCircle,
  Search,
  Mail,
  Phone,
  User,
  X,
  History,
  Sparkles,
  CalendarCheck2,
  CalendarX,
  Info,
  ArrowRight
} from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    bookings,
    quotes,
    cancelBooking,
    currentUser,
    setActiveView,
    lastConsultedEmail,
    setLastConsultedEmail,
  } = useApp();

  // Search input state by EMAIL as requested (starts empty so user must input their email)
  const [emailInput, setEmailInput] = useState(lastConsultedEmail || '');
  const [activeSearchEmail, setActiveSearchEmail] = useState(lastConsultedEmail || '');
  const [activeTab, setActiveTab] = useState<'reservas' | 'cotizaciones'>('reservas');
  const [bookingTimeFilter, setBookingTimeFilter] = useState<'all' | 'vigentes' | 'pasados'>('all');
  const [selectedTicketToView, setSelectedTicketToView] = useState<any>(null);

  // Sync if lastConsultedEmail changes externally
  useEffect(() => {
    if (lastConsultedEmail && !activeSearchEmail) {
      setEmailInput(lastConsultedEmail);
      setActiveSearchEmail(lastConsultedEmail);
    }
  }, [lastConsultedEmail]);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    setActiveSearchEmail(cleanEmail);
    setLastConsultedEmail(cleanEmail);
  };

  const handleClear = () => {
    setEmailInput('');
    setActiveSearchEmail('');
    setLastConsultedEmail('');
  };

  // Filter bookings ONLY for the searched email (Strict privacy: if no search, returns empty)
  const matchedBookings = useMemo(() => {
    if (!activeSearchEmail) return [];
    const target = activeSearchEmail.trim().toLowerCase();
    return bookings.filter((b) => {
      const email = (b.customerEmail || '').trim().toLowerCase();
      const code = (b.id || '').toLowerCase();
      return email === target || code === target;
    });
  }, [bookings, activeSearchEmail]);

  // Today reference date for past vs upcoming
  const todayStr = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Partition bookings into Vigentes para ir vs Ya Pasaron
  const isBookingUpcoming = (b: any) => {
    if (b.status === 'cancelled') return false;
    if (b.eventDate < todayStr) return false;
    return true;
  };

  const upcomingBookings = useMemo(() => {
    return matchedBookings.filter((b) => isBookingUpcoming(b));
  }, [matchedBookings, todayStr]);

  const pastBookings = useMemo(() => {
    return matchedBookings.filter((b) => !isBookingUpcoming(b));
  }, [matchedBookings, todayStr]);

  // Apply sub-filter (Todos, Vigentes, Pasados)
  const displayedBookings = useMemo(() => {
    if (bookingTimeFilter === 'vigentes') return upcomingBookings;
    if (bookingTimeFilter === 'pasados') return pastBookings;
    return matchedBookings;
  }, [bookingTimeFilter, upcomingBookings, pastBookings, matchedBookings]);

  // Filter quotes ONLY for the searched email (Strict privacy: if no search, returns empty)
  const filteredQuotes = useMemo(() => {
    if (!activeSearchEmail) return [];
    const target = activeSearchEmail.trim().toLowerCase();
    return quotes.filter((q) => {
      const email = (q.email || '').trim().toLowerCase();
      const code = (q.id || '').toLowerCase();
      return email === target || code === target;
    });
  }, [quotes, activeSearchEmail]);

  // Matched customer info
  const matchedCustomerName =
    matchedBookings[0]?.customerName ||
    filteredQuotes[0]?.customerName;

  const matchedCustomerPhone =
    matchedBookings[0]?.customerPhone ||
    filteredQuotes[0]?.phone;

  // Available sample emails for easy testing
  const existingEmails = useMemo(() => {
    const emails = new Set<string>();
    bookings.forEach((b) => {
      if (b.customerEmail) emails.add(b.customerEmail.toLowerCase());
    });
    quotes.forEach((q) => {
      if (q.email) emails.add(q.email.toLowerCase());
    });
    return Array.from(emails);
  }, [bookings, quotes]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Consultation Banner & Search Card */}
      <div className="bg-white rounded-[28px] sm:rounded-[36px] border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                Consulta con Correo Electrónico
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Sin Contraseñas Requeridas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
              Consulta de Reservas & Pases de Eventos
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
              Digita el <strong>correo electrónico</strong> con el que solicitaste tu reserva para ver de inmediato <strong>cuáles eventos están vigentes para ir</strong> y <strong>cuáles ya pasaron</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView('eventos')}
              className="px-4 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Nueva Experiencia</span>
            </button>
            <button
              onClick={() => setActiveView('cotizaciones')}
              className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#6F4E37]" />
              <span>Cotizar al por Mayor</span>
            </button>
          </div>
        </div>

        {/* Search Bar Form with EMAIL */}
        <form onSubmit={handleSearch} className="pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Ingresa tu correo electrónico registrado (ej. tu_correo@email.com)..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl border-2 border-slate-200 focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/20 focus:outline-none text-sm font-medium transition"
              />
              {emailInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5 rounded-full cursor-pointer"
                  title="Limpiar consulta"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="py-3 px-7 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm shrink-0"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Consultar mis Reservas</span>
            </button>
          </div>
        </form>

        {/* Instructions when not searched yet */}
        {!activeSearchEmail && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-600">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <p>
              Por privacidad y seguridad, tus datos, pases QR y cotizaciones solo se mostrarán una vez ingreses tu correo electrónico arriba.
            </p>
          </div>
        )}

        {/* Current Active Consultation Header */}
        {activeSearchEmail && (
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {matchedCustomerName || 'Cliente Hacienda Monteverde'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px]">
                    {activeSearchEmail}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  {matchedCustomerPhone ? `Tel: ${matchedCustomerPhone}` : 'Historial de reservas vinculadas'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-700">
              <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 font-bold">
                {upcomingBookings.length} Vigente(s) para ir
              </span>
              <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg border border-slate-200 font-medium">
                {pastBookings.length} Pasado(s)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Tabs: Reservas vs Cotizaciones */}
      <div className="flex items-center gap-6 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('reservas')}
          className={`pb-3 text-sm font-bold transition relative cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'reservas'
              ? 'text-[#0F172A]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <Calendar className="w-4 h-4 text-[#6F4E37]" />
          <span>Mis Reservas de Eventos ({matchedBookings.length})</span>
          {activeTab === 'reservas' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37] rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('cotizaciones')}
          className={`pb-3 text-sm font-bold transition relative cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'cotizaciones'
              ? 'text-[#0F172A]'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4 text-[#6F4E37]" />
          <span>Mis Cotizaciones Mayoristas ({filteredQuotes.length})</span>
          {activeTab === 'cotizaciones' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6F4E37] rounded-full" />
          )}
        </button>
      </div>

      {/* TAB 1: RESERVAS DE EVENTOS CON VIGENTES Y YA PASADOS */}
      {activeTab === 'reservas' && (
        <div className="space-y-6">
          {/* Sub-bar to toggle between: Todos, Vigentes para ir, Eventos que ya pasaron */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-slate-100 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                onClick={() => setBookingTimeFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  bookingTimeFilter === 'all'
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Todas ({matchedBookings.length})
              </button>

              <button
                onClick={() => setBookingTimeFilter('vigentes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  bookingTimeFilter === 'vigentes'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100'
                }`}
              >
                <CalendarCheck2 className="w-3.5 h-3.5" />
                <span>Vigentes para ir ({upcomingBookings.length})</span>
              </button>

              <button
                onClick={() => setBookingTimeFilter('pasados')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  bookingTimeFilter === 'pasados'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Eventos que ya pasaron ({pastBookings.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline px-2">
              Hoy: <strong>{todayStr}</strong>
            </span>
          </div>

          {displayedBookings.length === 0 ? (
            <div className="p-12 sm:p-16 text-center bg-white rounded-[32px] border border-slate-100 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-display">
                {activeSearchEmail
                  ? `No se encontraron eventos ${bookingTimeFilter === 'vigentes' ? 'vigentes para ir' : bookingTimeFilter === 'pasados' ? 'pasados' : ''} vinculados a ${activeSearchEmail}`
                  : 'Ingresa tu correo arriba para consultar tus reservas'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {activeSearchEmail
                  ? 'Verifica haber ingresado el mismo correo con el que realizaste la reserva.'
                  : 'Escribe tu dirección de correo electrónico en la barra de búsqueda superior para acceder a tus reservas y pases de eventos.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setActiveView('eventos')}
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#5C3F2C] transition-colors cursor-pointer shadow-sm"
                >
                  Explorar Experiencias & Agendar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedBookings.map((booking) => {
                const isUpcoming = isBookingUpcoming(booking);
                const isCancelled = booking.status === 'cancelled';
                const isPast = !isUpcoming && !isCancelled;

                return (
                  <div
                    key={booking.id}
                    className={`p-6 sm:p-7 rounded-[32px] bg-white border transition shadow-sm hover:shadow-xl flex flex-col justify-between space-y-4 relative ${
                      isCancelled
                        ? 'opacity-60 border-slate-200 bg-slate-50'
                        : isUpcoming
                        ? 'border-emerald-200 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 bg-slate-50/70'
                    }`}
                  >
                    <div>
                      {/* Status header badge */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6F4E37]">
                              {booking.id}
                            </span>
                            {/* Distinct badge for Vigente vs Pasado as requested by user */}
                            {isUpcoming ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                <CalendarCheck2 className="w-3 h-3" />
                                <span>Vigente para ir</span>
                              </span>
                            ) : isCancelled ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                <XCircle className="w-3 h-3" />
                                <span>Cancelada</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1">
                                <History className="w-3 h-3" />
                                <span>Evento que ya pasó</span>
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-slate-900 text-lg leading-tight font-display">
                            {booking.eventTitle}
                          </h3>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-3 pt-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Calendar className="w-4 h-4 text-[#6F4E37] shrink-0" />
                          <span>{booking.eventDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Clock className="w-4 h-4 text-[#6F4E37] shrink-0" />
                          <span>{booking.eventTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Titular registrado:</span>
                          <span className="font-bold text-slate-800 truncate block">{booking.customerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Correo de Consulta:</span>
                          <span className="font-bold text-[#6F4E37] truncate block text-[11px]">
                            {booking.customerEmail || 'No registrado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Cupos asegurados:</span>
                          <span className="font-bold text-slate-800">{booking.attendeesCount} personas</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Total pagado:</span>
                          <span className="font-bold text-slate-900 text-sm font-display">
                            {formatCOP(booking.totalPaid)}
                          </span>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                          <strong>Observaciones:</strong> {booking.specialRequests}
                        </div>
                      )}
                    </div>

                    {/* Actions & Detail trigger */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedTicketToView(booking)}
                        className={`px-4 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                          isUpcoming
                            ? 'bg-[#0F172A] hover:bg-slate-800 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        }`}
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>Ver Detalle de Reserva</span>
                      </button>

                      {isUpcoming && (
                        <button
                          onClick={() => {
                            if (confirm(`¿Estás seguro de cancelar tu reserva para "${booking.eventTitle}"?`)) {
                              cancelBooking(booking.id);
                            }
                          }}
                          className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                        >
                          Cancelar reserva
                        </button>
                      )}

                      {isPast && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          Asistencia Registrada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COTIZACIONES AL POR MAYOR */}
      {activeTab === 'cotizaciones' && (
        <div className="space-y-6">
          {filteredQuotes.length === 0 ? (
            <div className="p-12 sm:p-16 text-center bg-white rounded-[32px] border border-slate-100 space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 font-display">
                {activeSearchEmail
                  ? `No se encontraron cotizaciones asociadas a ${activeSearchEmail}`
                  : 'Ingresa tu correo arriba para consultar tus cotizaciones'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {activeSearchEmail
                  ? 'Si aún no has enviado una solicitud, puedes calcular tarifas al por mayor ahora.'
                  : 'Escribe tu correo en la barra superior para consultar el estado de tus cotizaciones B2B.'}
              </p>
              <div className="pt-2 flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setActiveView('cotizaciones')}
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#5C3F2C] transition-colors cursor-pointer shadow-sm"
                >
                  Crear Cotización al por Mayor
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => {
                const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
                  pendiente: { bg: 'bg-amber-100', text: 'text-amber-900', label: 'En Revisión Admin' },
                  contactado: { bg: 'bg-blue-100', text: 'text-blue-900', label: 'Asesor Asignado' },
                  cotizado: { bg: 'bg-purple-100', text: 'text-purple-900', label: 'Propuesta Formal Enviada' },
                  cerrado: { bg: 'bg-emerald-100', text: 'text-emerald-900', label: 'Orden Aprobada' },
                };
                const badge = statusBadge[quote.status] || statusBadge.pendiente;

                return (
                  <div
                    key={quote.id}
                    className="p-6 rounded-[28px] bg-white border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#6F4E37]">{quote.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} ${badge.text}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(quote.createdAt).toLocaleDateString('es-CO')}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-base sm:text-lg font-display">{quote.productName}</h4>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                        <span>
                          Solicitado por: <strong>{quote.customerName}</strong> ({quote.companyName})
                        </span>
                        <span>•</span>
                        <span>
                          Correo: <strong>{quote.email}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Volumen: <strong>{quote.requestedQuantity} unidades / kg</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Destino: <strong>{quote.city}</strong>
                        </span>
                        {quote.customPackagingNeeded && (
                          <>
                            <span>•</span>
                            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-md">
                              Marca Propia (White Label)
                            </span>
                          </>
                        )}
                      </div>

                      {quote.comments && (
                        <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                          "{quote.comments}"
                        </p>
                      )}
                    </div>

                    <div className="text-left md:text-right md:border-l md:pl-6 md:border-slate-100 shrink-0 w-full md:w-auto">
                      <span className="text-[10px] text-slate-400 block font-medium">Inversión Estimada:</span>
                      <span className="text-xl font-extrabold text-emerald-700 font-display block">
                        {formatCOP(quote.estimatedTotal)}
                      </span>
                      <span className="text-[11px] text-slate-500 block">
                        ({formatCOP(quote.estimatedUnitPrice)} / unidad)
                      </span>
                      <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        Frecuencia: {quote.frequency === 'monthly' ? 'Mensual' : quote.frequency === 'quarterly' ? 'Trimestral' : 'Única'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Ticket Modal without QR */}
      {selectedTicketToView && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedTicketToView(null);
          }}
        >
          <div className="bg-white rounded-[24px] sm:rounded-[32px] max-w-md w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 text-center space-y-5 shadow-2xl border border-slate-100 my-auto animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6F4E37]">
                Comprobante de Reserva
              </span>
              <button
                onClick={() => setSelectedTicketToView(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between gap-2">
                {isBookingUpcoming(selectedTicketToView) ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Vigente para ir
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                    Evento que ya pasó
                  </span>
                )}
                <span className="font-mono text-xs font-black text-[#6F4E37]">
                  {selectedTicketToView.id}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 font-display">{selectedTicketToView.eventTitle}</h3>
              
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                  {selectedTicketToView.eventDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                  {selectedTicketToView.eventTime}
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-2 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Titular:</span>
                  <strong className="text-slate-900">{selectedTicketToView.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Correo Registrado:</span>
                  <strong className="text-[#6F4E37]">{selectedTicketToView.customerEmail}</strong>
                </div>
                {selectedTicketToView.customerPhone && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Teléfono:</span>
                    <strong className="text-slate-800">{selectedTicketToView.customerPhone}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Cupos Reservados:</span>
                  <strong className="text-slate-900">{selectedTicketToView.attendeesCount} persona(s)</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-bold">Pago a Realizar en la Finca:</span>
                  <strong className="text-emerald-700 text-sm font-display">{formatCOP(selectedTicketToView.totalPaid)}</strong>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                ℹ️ Tu reserva está confirmada con tu nombre y correo. Preséntate en la hacienda el día y hora indicados para disfrutar tu experiencia.
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTicketToView(null)}
                className="w-full py-3 rounded-full bg-[#0F172A] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-sm"
              >
                Cerrar Comprobante
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
