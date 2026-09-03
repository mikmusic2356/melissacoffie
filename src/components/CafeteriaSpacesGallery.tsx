import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sun,
  Flame,
  Coffee,
  Gift,
  ShoppingBag,
  Sparkles,
  Clock,
  MapPin,
  MessageCircle,
  Instagram,
  ArrowRight,
  Maximize2
} from 'lucide-react';

interface SpaceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  tag: string;
  features: string[];
}

export const CafeteriaSpacesGallery: React.FC = () => {
  const { setActiveView } = useApp();
  const [selectedSpace, setSelectedSpace] = useState<SpaceItem | null>(null);

  const spaces: SpaceItem[] = [
    {
      id: 'terraza-mirador',
      title: 'Terraza & Mirador Panorámico 360°',
      subtitle: 'Contempla la cordillera andina y los cafetales en flor',
      description:
        'Un espacio abierto privilegiado a 1.850 metros de altitud, con mesas campestres de madera y vista despejada a los cañones cafeteros. El lugar perfecto para saborear una taza de café recién extraído mientras se respira el aire puro de la montaña.',
      imageUrl: '/images/finca-paisaje-cafetal.jpg',
      tag: 'Espacio Abierto',
      features: ['Vista panorámica', 'Pet friendly', 'Conexión con la naturaleza', 'Servicio a la mesa'],
    },
    {
      id: 'barra-barismo',
      title: 'Barra de Barismo & Métodos de Filtrado',
      subtitle: 'Donde la ciencia y el aroma del café se encuentran',
      description:
        'Equipada con básculas micrométricas, molinos de precisión y drippers para V60, Chemex y AeroPress. Nuestros baristas te explican en vivo los ratios, la molienda y las notas sensoriales de cada microlote.',
      imageUrl: '/images/cata-cafe-miel-taza.jpg',
      tag: 'Barismo Especializado',
      features: ['Métodos V60, Chemex y AeroPress', 'Cata en vivo', 'Café recién molido', 'Baristas capacitadores'],
    },
    {
      id: 'zona-fogatas',
      title: 'Mirador de Fogatas al Atardecer',
      subtitle: 'Calor de leña de café, café caliente y aperitivos bajo las estrellas',
      description:
        'Al caer la tarde, encendemos fogatas en un rincón especial de la terraza con vista al cañón. Ideal para parejas, familias y grupos de amigos que desean compartir masmelos asados, tablas campesinas y cócteles calientes de café con miel.',
      imageUrl: '/images/finca-paisaje-cafetal.jpg',
      tag: 'Tardes & Noches',
      features: ['Leña natural de café', 'Tabla de quesos y panes', 'Masmelos para asar', 'Música acústica'],
    },
    {
      id: 'kiosko-cumpleanos',
      title: 'Kiosko Campestre para Cumpleaños & Eventos',
      subtitle: 'Montajes personalizados rodeados de flores y cafetales',
      description:
        'Celebra fechas memorables con un diseño rústico y acogedor. Ofrecemos letreros conmemorativos, tortas artesanales endulzadas con miel de la finca, pasabocas campesinos y atención exclusiva para tu grupo.',
      imageUrl: '/images/cata-cafe-miel-taza.jpg',
      tag: 'Celebraciones Especiales',
      features: ['Decoración rústica personalizada', 'Torta con miel artesanal', 'Brindis cafetero', 'Zona exclusiva'],
    },
    {
      id: 'tienda-origen',
      title: 'Tienda de la Finca: Café & Productos de Colmena',
      subtitle: 'Lleva a casa el fruto directo de nuestras colmenas y cafetales',
      description:
        'Encuentra en la entrada de la cafetería toda nuestra línea: café tostado en grano o molido, frascos de miel virgen de flor de cafeto, polen silvestre fresco, propóleo puro concentrado y plántulas de café.',
      imageUrl: '/images/frascos-miel-pura-artesanal.jpg',
      tag: 'Directo de la Finca',
      features: ['Café tostado fresco', 'Miel virgen cruda', 'Polen & Propóleo', 'Plántulas de café'],
    },
  ];

  return (
    <div id="espacios-cafeteria" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black">
            <Coffee className="w-3.5 h-3.5" />
            <span>Espacios de Nuestra Cafetería</span>
          </div>
          <h3 className="text-3xl font-black text-[#2D1A0D] font-display">
            Descubre los Rincones de Melifera coffee
          </h3>
          <p className="text-xs sm:text-sm text-[#5C381E] max-w-2xl leading-relaxed">
            Nuestra cafetería es un refugio en la montaña diseñado para conectar con la naturaleza, respirar aire puro y deleitarse con el maridaje de café de origen y miel virgen.
          </p>
        </div>

        {/* Schedule Badge */}
        <div className="p-4 rounded-2xl bg-[#2D1A0D] text-white space-y-1 text-xs shrink-0 border-2 border-[#FFD242]/40 shadow-xs">
          <div className="flex items-center gap-2 font-black text-[#FFD242]">
            <Clock className="w-4 h-4" />
            <span>Horarios de Atención:</span>
          </div>
          <p className="text-[11px] text-amber-100">
            • <strong>Miércoles a viernes:</strong> 10:00 am – 6:00 pm<br />
            • <strong>Sábado, domingo y festivos:</strong> 10:00 am – 10:00 pm
          </p>
        </div>
      </div>

      {/* Grid of Spaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="group rounded-[32px] bg-white border-2 border-amber-100 hover:border-[#FFD242] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Image with Tag */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-900">
                <img
                  src={space.imageUrl}
                  alt={space.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2D1A0D] text-[11px] font-black shadow-xs">
                  {space.tag}
                </span>
                <button
                  onClick={() => setSelectedSpace(space)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer opacity-80 group-hover:opacity-100"
                  title="Ver detalles del espacio"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <h4 className="text-xl font-black text-[#2D1A0D] font-display group-hover:text-amber-900 transition">
                  {space.title}
                </h4>
                <p className="text-xs font-semibold text-[#A16207]">
                  {space.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {space.description}
                </p>

                {/* Features chips */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {space.features.map((feat, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-2.5 py-0.5 rounded-full bg-amber-50 text-[#784A23] font-semibold text-[10px] border border-amber-200/60"
                    >
                      ✓ {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 border-t border-amber-50 flex items-center justify-between gap-2 mt-4">
              <a
                href={`https://wa.me/573043785413?text=${encodeURIComponent(`Hola Melissa, quisiera consultar o reservar para el espacio: ${space.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-bold text-xs transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Reservar por WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedSpace(space)}
                className="p-2 rounded-full bg-amber-100 hover:bg-[#FFD242] text-[#2D1A0D] transition cursor-pointer"
                title="Leer más"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instagram Invitation Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Instagram className="w-3.5 h-3.5" />
            <span>@meliferacoffee en Instagram</span>
          </div>
          <h4 className="text-2xl font-black font-display text-white">
            Comparte tu momento en la cafetería con nosotros
          </h4>
          <p className="text-xs text-white/90 max-w-xl">
            Sube tus fotos disfrutando de un filtrado, el tour de abejas o la fogata al atardecer y menciónanos como <strong>@meliferacoffee</strong>.
          </p>
        </div>

        <a
          href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-full bg-white text-rose-600 hover:bg-rose-50 font-black text-xs transition shadow-lg shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Instagram className="w-4 h-4" />
          <span>Ver Perfil en Instagram</span>
        </a>
      </div>

      {/* Modal Detail */}
      {selectedSpace && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={selectedSpace.imageUrl}
                alt={selectedSpace.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedSpace(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-[#A16207] uppercase tracking-wider">
                  {selectedSpace.tag}
                </span>
                <h3 className="text-2xl font-black text-[#2D1A0D] font-display">
                  {selectedSpace.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {selectedSpace.subtitle}
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedSpace.description}
              </p>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
                <span className="text-xs font-bold text-[#2D1A0D] block">
                  Comodidades y características:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  {selectedSpace.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 font-medium">
                      <span className="text-amber-600 font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`https://wa.me/573043785413?text=${encodeURIComponent(`Hola Melissa, quisiera reservar o consultar sobre ${selectedSpace.title} en Melifera coffee`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs transition text-center flex items-center justify-center gap-2 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reservar por WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedSpace(null)}
                  className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
