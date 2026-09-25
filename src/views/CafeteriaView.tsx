import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Coffee,
  Sparkles,
  Clock,
  Heart,
  QrCode,
  MapPin,
  Utensils,
  Sun,
  Flame,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Instagram,
  ArrowRight,
  Share2,
} from 'lucide-react';
import { CafeteriaSpacesGallery } from '../components/CafeteriaSpacesGallery';

export const CafeteriaView: React.FC = () => {
  const { cafeteriaMenu, setActiveView, copyShareLink } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'calientes' | 'frias' | 'pasteleria' | 'brunch'>('all');
  const [showQRModal, setShowQRModal] = useState(false);

  const categories = [
    { id: 'all', label: 'Toda la Carta' },
    { id: 'calientes', label: 'Bebidas Calientes de Especialidad' },
    { id: 'frias', label: 'Bebidas Frías & Refrescantes' },
    { id: 'pasteleria', label: 'Repostería con Miel de Finca' },
    { id: 'brunch', label: 'Brunch & Platos Típicos' },
  ];

  const filteredItems = cafeteriaMenu.filter((item) => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
      {/* Hero Header */}
      <div className="rounded-[32px] bg-[#0F172A] text-white p-8 sm:p-14 shadow-xl relative overflow-hidden border border-[#FFD242]/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[url('/images/finca-paisaje-cafetal.jpg')] bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-xs">
            <Coffee className="w-3.5 h-3.5 text-[#2D1A0D]" />
            <span>Cafetería de la Finca Monteverde</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight tracking-tight text-[#FFD242]">
            Nuestra Carta de Cafetería & Brunch
          </h1>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            Un mirador natural entre cafetales donde preparamos tazas de origen con agua de manantial, miel virgen cosechada en nuestros apiarios y recetas campesinas horneadas cada mañana.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-amber-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md border border-[#FFD242]/30 text-[#FFD242] font-semibold">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-[#FFD242]" />
                <span>Horarios:</span>
              </span>
              <span className="text-white text-[11px]">
                Miér - Vie: 10:00 am – 6:00 pm | Sáb, Dom y Festivos: 10:00 am – 10:00 pm
              </span>
            </div>
            <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-2xl backdrop-blur-md border border-[#FFD242]/30 text-[#FFD242] font-semibold">
              <MapPin className="w-3.5 h-3.5 text-[#FFD242]" />
              <span>Mirador Principal de la Finca (1.650 msnm)</span>
            </span>
            <button
              onClick={() => copyShareLink('#menu-cafeteria', 'Carta & Menú Cafetería')}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white px-3.5 py-2 rounded-2xl font-bold backdrop-blur-md transition cursor-pointer border border-white/20 shadow-xs"
              title="Copiar enlace para compartir el menú"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FFD242]" />
              <span>Compartir Menú</span>
            </button>
            <button
              onClick={() => setShowQRModal(true)}
              className="flex items-center gap-1.5 bg-[#FFD242] text-[#2D1A0D] px-3.5 py-2 rounded-2xl font-bold hover:bg-[#F5C72E] transition cursor-pointer shadow-xs"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Ver Menú Digital QR</span>
            </button>
            <a
              href="https://wa.me/573043785413?text=Hola%20Melissa,%20quisiera%20reservar%20mesa%20en%20la%20cafeter%C3%ADa%20de%20Melifera%20coffee"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-[#25D366] text-white px-3.5 py-2 rounded-2xl font-bold hover:bg-[#20bd5a] transition cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Reservar Mesa (WhatsApp)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div id="menu-carta" className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-slate-200 scroll-mt-28">
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#6F4E37] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-5 group"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full sm:w-36 h-36 rounded-2xl object-cover shrink-0 group-hover:scale-103 transition-transform duration-300"
            />

            <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {item.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6F4E37]/10 text-[#6F4E37]"
                    >
                      {badge}
                    </span>
                  ))}
                  {item.isFarmMade && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      Hecho en Finca
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#6F4E37] transition font-display">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Prep: {item.preparationTimeMin} min</span>
                </div>

                <span className="text-base font-black text-[#0F172A] font-display">
                  {formatCOP(item.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Espacios de la Cafetería con Galería Fotográfica y WhatsApp */}
      <div className="pt-8">
        <CafeteriaSpacesGallery />
      </div>

      {/* Ambiance Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 space-y-2 shadow-xs">
          <Sun className="w-6 h-6 text-[#6F4E37]" />
          <h4 className="font-bold text-slate-900 text-sm font-display">Terraza con Vista 360°</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Contempla los cañones andinos mientras disfrutas el aroma a café recién molido.
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 space-y-2 shadow-xs">
          <Flame className="w-6 h-6 text-[#6F4E37]" />
          <h4 className="font-bold text-slate-900 text-sm font-display">Tardes de Fogata</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Los viernes y sábados encendemos fogatas al atardecer con cócteles de café y música acústica.
          </p>
        </div>

        <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 space-y-2 shadow-xs">
          <Calendar className="w-6 h-6 text-[#6F4E37]" />
          <h4 className="font-bold text-slate-900 text-sm font-display">Sede de Nuestros Eventos</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Aquí tienen lugar los talleres sensoriales y maridajes programados por temporadas.
          </p>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-8 text-center space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 font-display">Menú Digital en la Mesa</h3>
            <p className="text-xs text-slate-500">
              Escanea con la cámara de tu celular para consultar la carta actualizada en tu visita a la finca.
            </p>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 inline-block">
              <QrCode className="w-40 h-40 text-[#0F172A] mx-auto" />
              <span className="text-[10px] font-mono font-bold text-slate-400 block mt-2">
                FINCA-MONTEVERDE-MENU-2026
              </span>
            </div>
            <div>
              <button
                onClick={() => setShowQRModal(false)}
                className="px-6 py-2.5 rounded-full bg-[#0F172A] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
