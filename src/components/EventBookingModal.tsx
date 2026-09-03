import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  CheckCircle2,
  QrCode,
  ShieldCheck,
  Download,
  Mail,
  Phone,
  User,
  Check,
  CalendarCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FarmEvent, EventScheduleSlot } from '../types';

export const EventBookingModal: React.FC = () => {
  const {
    selectedEventForBooking,
    setSelectedEventForBooking,
    createBooking,
    currentUser,
    lastConsultedEmail,
    setLastConsultedEmail,
    setActiveView,
  } = useApp();

  // Contact Info (Name, Phone, Email first as requested)
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || lastConsultedEmail || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pse' | 'nequi' | 'farm_cash'>('farm_cash');

  const [isBooked, setIsBooked] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<any>(null);

  const event = selectedEventForBooking;

  // Available slots configured by the admin
  const availableSlotsList: EventScheduleSlot[] = useMemo(() => {
    if (!event) return [];
    if (event.availableSlots && event.availableSlots.length > 0) {
      return event.availableSlots;
    }
    return [
      {
        id: `slot-default-${event.id}`,
        date: event.date,
        time: event.time,
        capacity: event.capacity,
        bookedSpots: event.bookedSpots,
        available: true,
      },
    ];
  }, [event]);

  // Selected date/time slot state
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  useEffect(() => {
    if (availableSlotsList.length > 0) {
      const openSlot = availableSlotsList.find((s) => ((s.capacity || 10) - (s.bookedSpots || 0)) > 0) || availableSlotsList[0];
      setSelectedSlotId(openSlot.id);
    }
  }, [availableSlotsList]);

  const selectedSlot = useMemo(() => {
    return availableSlotsList.find((s) => s.id === selectedSlotId) || availableSlotsList[0];
  }, [availableSlotsList, selectedSlotId]);

  const slotCapacity = selectedSlot?.capacity || event?.capacity || 10;
  const slotBooked = selectedSlot?.bookedSpots || 0;
  const slotAvailableSpots = Math.max(0, slotCapacity - slotBooked);

  const [attendeesCount, setAttendeesCount] = useState(1);

  if (!event) return null;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const totalAmount = event.pricePerPerson * attendeesCount;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (attendeesCount > slotAvailableSpots && slotAvailableSpots > 0) return;

    const chosenDate = selectedSlot?.date || event.date;
    const chosenTime = selectedSlot?.time || event.time;

    const booking = createBooking({
      eventId: event.id,
      eventTitle: event.title,
      eventDate: chosenDate,
      eventTime: chosenTime,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      attendeesCount,
      totalPaid: totalAmount,
      paymentMethod: 'farm_cash',
      paymentStatus: 'pending',
      specialRequests: specialRequests || undefined,
    });

    setCreatedBooking(booking);
    setIsBooked(true);
  };

  const handleClose = () => {
    setIsBooked(false);
    setSelectedEventForBooking(null);
  };

  const downloadCalendarFile = () => {
    const chosenDate = selectedSlot?.date || event.date;
    const chosenTime = selectedSlot?.time || event.time;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Hacienda Monteverde Melifera//Eventos//ES
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
DTSTART:${chosenDate.replace(/-/g, '')}T090000Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reserva-${createdBooking?.id || event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('es-CO', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-white rounded-[24px] sm:rounded-[32px] max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-0.5 rounded-full bg-[#6F4E37] text-white">
              Reserva & Agendamiento Oficial
            </span>
            <h2 className="text-base sm:text-lg font-bold mt-1 text-white font-display line-clamp-1">{event.title}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-slate-700/50"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked && createdBooking ? (
          /* Success Screen */
          <div className="p-4 sm:p-8 text-center space-y-5 overflow-y-auto flex-1">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">¡Reserva Confirmada con Éxito!</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                Tu agendamiento para la fecha y horario seleccionados quedó registrado y vinculado a tu correo electrónico.
              </p>
            </div>

            {/* Digital Ticket Card */}
            <div className="p-4 sm:p-6 rounded-[24px] bg-slate-50 border border-slate-200 text-left space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#6F4E37] tracking-wider">
                      Reserva Finca Monteverde
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Vigente para ir
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base font-display truncate">{createdBooking.eventTitle}</h4>
                  
                  <div className="flex flex-wrap gap-2.5 text-xs text-slate-600 mt-2">
                    <span className="flex items-center gap-1 font-semibold text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                      {createdBooking.eventDate}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-[#0F172A] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                      {createdBooking.eventTime}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-[#6F4E37]" />
                      {event.location}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Radicado</span>
                  <span className="text-xs font-mono text-[#6F4E37] font-black">
                    {createdBooking.id}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-500 block text-[10px]">Titular:</span>
                  <span className="font-bold truncate block">{createdBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Correo de Consulta:</span>
                  <span className="font-bold text-[#6F4E37] truncate block">
                    {createdBooking.customerEmail}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Cupos:</span>
                  <span className="font-bold block">{createdBooking.attendeesCount} persona(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Pago en Finca:</span>
                  <span className="font-bold text-[#6F4E37] block">{formatCOP(createdBooking.totalPaid)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs text-left sm:text-center">
              <p className="font-bold flex items-center justify-center gap-1.5 text-amber-950">
                <Mail className="w-4 h-4 text-[#6F4E37]" />
                Consulta de Reservas con tu Correo
              </p>
              <p className="text-[11px] text-amber-800 mt-1">
                Con tu correo <strong>{createdBooking.customerEmail}</strong> puedes entrar en cualquier momento a la pestaña <strong>"Mis Reservas"</strong> para ver tus eventos vigentes para ir y los que ya pasaron.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-1">
              <button
                onClick={downloadCalendarFile}
                className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0F172A] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#6F4E37]" />
                <span>Guardar Calendario (.ics)</span>
              </button>

              <button
                onClick={() => {
                  setLastConsultedEmail(createdBooking.customerEmail);
                  handleClose();
                  setActiveView('mis-reservas');
                }}
                className="py-2.5 px-5 rounded-full bg-[#0F172A] text-[#FFD242] text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#FFD242]" />
                <span>Ver Mis Reservas (con Correo)</span>
              </button>

              <button
                onClick={handleClose}
                className="py-2.5 px-4 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition-colors cursor-pointer shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* Booking Checkout Form: Step 1 (Datos de contacto) -> Step 2 (Elección de Fechas y Hora disponibles) -> Step 3 (Pago) */
          <form onSubmit={handleBookingSubmit} className="p-4 sm:p-7 space-y-6 overflow-y-auto flex-1">
            {/* Event snapshot summary banner */}
            <div className="flex gap-4 p-4 rounded-[24px] bg-slate-50 border border-slate-100">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-100"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37]">
                  {event.season}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 truncate font-display">{event.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                    Duración: {event.durationHours} horas
                  </span>
                  <span>•</span>
                  <span className="truncate">{event.location}</span>
                </div>
                <p className="text-xs font-bold text-[#6F4E37] mt-1.5">
                  {formatCOP(event.pricePerPerson)} <span className="text-[10px] text-slate-400 font-normal">/ persona</span>
                </p>
              </div>
            </div>

            {/* SECCIÓN 1: DATOS DEL CLIENTE (Nombre, Teléfono y Correo primero) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Paso 1: Tus Datos Personales
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  Sin contraseñas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Nombre */}
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#6F4E37]" />
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Camila Ospina o Juan Gómez"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                  />
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#6F4E37]" />
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Con este correo consultarás tus eventos vigentes y pasados.
                  </p>
                </div>

                {/* Teléfono Móvil / WhatsApp */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#6F4E37]" />
                    Teléfono Móvil / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+57 310 123 4567"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Para recordatorios de llegada y clima en la finca.
                  </p>
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: ELECCIÓN DE FECHAS DISPONIBLES PROGRAMADAS POR EL ADMINISTRADOR */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Paso 2: Elige Fecha y Horario Disponible
                  </h4>
                </div>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                  {availableSlotsList.length} opciones habilitadas por el admin
                </span>
              </div>

              <p className="text-xs text-slate-600">
                Selecciona una de las fechas y horarios disponibles configurados por el administrador para este evento:
              </p>

              {/* Slots selector cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {availableSlotsList.map((slot) => {
                  const isSelected = slot.id === selectedSlot?.id;
                  const slotCap = slot.capacity || event.capacity;
                  const slotBk = slot.bookedSpots || 0;
                  const slotLeft = Math.max(0, slotCap - slotBk);
                  const isFull = slotLeft === 0;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-[#6F4E37] bg-amber-50/70 ring-2 ring-[#6F4E37] shadow-xs'
                          : isFull
                          ? 'border-slate-200 bg-slate-100/60 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 bg-white hover:border-[#6F4E37]/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                            <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                            <span className="capitalize">{formatDateLabel(slot.date)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{slot.time}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#6F4E37] text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <span className={isFull ? 'text-red-600 font-bold' : slotLeft <= 3 ? 'text-amber-700 font-bold' : 'text-emerald-700 font-semibold'}>
                          {isFull ? '¡Cupos Agotados!' : `${slotLeft} cupos disponibles`}
                        </span>
                        {slot.notes && (
                          <span className="text-slate-400 truncate max-w-[120px]">{slot.notes}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Asistentes para la fecha escogida */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Número de Asistentes:</span>
                  <span className="text-[11px] text-slate-500">
                    Para la fecha: <strong className="text-slate-700">{selectedSlot?.date}</strong> a las <strong className="text-slate-700">{selectedSlot?.time}</strong>
                  </span>
                </div>

                <div className="flex items-center border border-slate-200 rounded-full bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setAttendeesCount(Math.max(1, attendeesCount - 1))}
                    className="px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3.5 text-xs font-bold text-slate-900">{attendeesCount}</span>
                  <button
                    type="button"
                    onClick={() => setAttendeesCount(Math.min(slotAvailableSpots, attendeesCount + 1))}
                    disabled={attendeesCount >= slotAvailableSpots}
                    className="px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Requerimientos dietarios */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Notas especiales o requerimientos dietarios (Opcional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Ej. Alergias, intolerancias alimentarias o solicitudes especiales para el tour..."
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                />
              </div>
            </div>

            {/* SECCIÓN 3: MODALIDAD DE PAGO */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#6F4E37] text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Paso 3: Método de Pago
                  </h4>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6F4E37] text-white flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-900 block">Pago Presencial en la Finca</span>
                  <span className="text-[11px] text-slate-600">
                    Tu reserva queda 100% asegurada. Pagas en efectivo o transferencia directamente al llegar a la experiencia en la finca.
                  </span>
                </div>
              </div>
            </div>

            {/* Total and CTA */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Fecha elegida: <strong className="text-slate-800">{selectedSlot?.date}</strong> ({selectedSlot?.time})
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    Total a pagar en la finca ({attendeesCount} {attendeesCount === 1 ? 'persona' : 'personas'}):
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-[#0F172A] font-display">{formatCOP(totalAmount)}</span>
              </div>

              <button
                type="submit"
                disabled={slotAvailableSpots === 0}
                className="w-full py-3.5 px-4 rounded-full bg-[#6F4E37] text-white font-bold text-sm hover:bg-[#5C3F2C] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Reserva (Pagar en la Finca)</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tu reserva queda asociada a tu correo para consultarla cuando desees sin clave.</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
