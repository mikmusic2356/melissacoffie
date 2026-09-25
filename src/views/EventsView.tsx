import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Coffee,
  Layers,
  ChevronLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { EventSeason, FarmEvent } from '../types';

export const EventsView: React.FC = () => {
  const { events, setSelectedEventForBooking, setActiveView, copyShareLink } = useApp();
  const [selectedSeason, setSelectedSeason] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSeason]);

  const seasons: EventSeason[] = [
    'Temporada de Cosecha',
    'Temporada de Floración',
    'Temporada Seca / Verano',
    'Temporada Anual',
  ];

  const filteredEvents = events.filter((evt) => {
    if (selectedSeason === 'all') return true;
    return evt.season === selectedSeason;
  });

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner */}
      <div className="rounded-[32px] bg-[#0F172A] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden border border-[#FFD242]/20">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#2D1A0D]" />
            <span>Sistema de Agendamiento Pro</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight tracking-tight text-[#FFD242]">
            Eventos & Experiencias de Temporada
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Vive la magia de la cordillera andina. Reserva y paga tus cupos en talleres de catación, rutas apícolas y atardeceres musicales directamente en nuestra plataforma con confirmación digital inmediata.
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#FFD242]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Season Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 sm:p-3 rounded-full bg-white border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto px-1">
          <button
            onClick={() => setSelectedSeason('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedSeason === 'all'
                ? 'bg-[#6F4E37] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas las temporadas ({events.length})
          </button>
          {seasons.map((season) => {
            const isSelected = selectedSeason === season;
            return (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#6F4E37] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {season}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setActiveView('mis-reservas')}
          className="text-xs font-bold text-[#6F4E37] hover:text-slate-900 transition flex items-center gap-1.5 cursor-pointer px-4"
        >
          <span>Ver mis reservas activas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Events List & Pagination */}
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((evt) => {
              const availableSpots = Math.max(0, evt.capacity - evt.bookedSpots);
              const percentBooked = Math.round((evt.bookedSpots / evt.capacity) * 100);

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row group"
                >
                  {/* Media image */}
                  <div className="md:w-5/12 relative aspect-16/10 md:aspect-auto overflow-hidden bg-slate-100">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#0F172A]/90 text-amber-300 shadow-xs backdrop-blur-xs">
                        {evt.season}
                      </span>
                    </div>
                  </div>

                  {/* Event Content Details */}
                  <div className="md:w-7/12 p-6 sm:p-7 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#6F4E37]" />
                          {evt.date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#6F4E37]" />
                          {evt.time} ({evt.durationHours}h)
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xl font-display leading-tight group-hover:text-[#6F4E37] transition">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {evt.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                        <MapPin className="w-4 h-4 text-[#6F4E37] shrink-0" />
                        <span className="truncate font-medium">{evt.location}</span>
                      </div>

                      {/* Included bullets */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Incluye en la Experiencia:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {evt.included.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-100"
                            >
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Capacity bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-600 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#6F4E37]" />
                            <span>Cupos totales ({evt.capacity} personas)</span>
                          </span>
                          <span className={availableSpots > 0 ? 'text-emerald-700 font-bold' : 'text-rose-600 font-bold'}>
                            {availableSpots > 0 ? `${availableSpots} disponibles` : '¡Agotado!'}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-500 to-[#6F4E37] rounded-full transition-all"
                            style={{ width: `${percentBooked}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">
                          Inversión por persona
                        </span>
                        <span className="text-xl font-extrabold text-[#0F172A] font-display">
                          {formatCOP(evt.pricePerPerson)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyShareLink(`#evento/${evt.id}`, evt.title)}
                          className="p-2.5 rounded-full bg-slate-100 hover:bg-[#FFD242] hover:text-[#2D1A0D] text-slate-700 transition cursor-pointer shadow-2xs"
                          title="Copiar enlace para compartir evento"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedEventForBooking(evt)}
                          disabled={availableSpots === 0}
                          className="px-5 py-2.5 rounded-full bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#5C3F2C] transition-colors flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-40"
                        >
                          <span>{availableSpots > 0 ? 'Reservar & Pagar' : 'Cupos Agotados'}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Pagination controls */}
        {Math.ceil(filteredEvents.length / itemsPerPage) > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
            <span className="text-xs text-slate-500 font-medium">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEvents.length)} de {filteredEvents.length} eventos
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>

              {Array.from({ length: Math.ceil(filteredEvents.length / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-[#2D1A0D] text-[#FFD242] shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(Math.ceil(filteredEvents.length / itemsPerPage), p + 1));
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                disabled={currentPage >= Math.ceil(filteredEvents.length / itemsPerPage)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                aria-label="Página siguiente"
              >
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Private Events Banner */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#6F4E37] uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Eventos Privados & Corporativos</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 font-display">
            ¿Deseas una fecha privada para tu empresa o grupo familiar?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Habilitamos la cafetería y mirador de la finca para talleres cerrados de barismo, matrimonios campesinos íntimos o días de bienestar corporativo con almuerzo tradicional en leña.
          </p>
        </div>

        <button
          onClick={() => setActiveView('contacto')}
          className="px-6 py-3.5 rounded-full bg-[#0F172A] text-white font-bold text-xs hover:bg-slate-800 transition whitespace-nowrap shadow-sm cursor-pointer"
        >
          Consultar Fecha Privada
        </button>
      </div>
    </div>
  );
};
