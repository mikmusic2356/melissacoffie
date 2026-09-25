import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Navigation, Compass, Sparkles, Coffee, Eye, Instagram, MessageCircle } from 'lucide-react';

interface FarmPhoto {
  src: string;
  title: string;
  category: string;
  caption: string;
  alt: string;
}

export const ContactView: React.FC = () => {
  const { addToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'informacion_general',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Gallery supporting finca-paisaje-cafetal.jpg
  const farmGallery: FarmPhoto[] = [
    {
      src: '/images/finca-paisaje-cafetal.jpg',
      title: 'Paisaje Cafetero & Hacienda',
      category: 'Vista Principal',
      caption: 'Cafetales de ladera a 1.650 msnm cobijados por bosque andino y corredores biológicos.',
      alt: 'Paisaje panorámico de la finca cafetera y cafetales en la montaña',
    },
    {
      src: '/images/colmena-cerca-cafetal.jpg',
      title: 'Apiarios Integrados al Cafetal',
      category: 'Polinización',
      caption: 'Colmenas ubicadas a escasos metros de los cafetos para polinizar cada floración.',
      alt: 'Colmenas de abejas contiguas a las plantas de café',
    },
    {
      src: '/images/cata-cafe-miel-taza.jpg',
      title: 'Laboratorio de Calidad & Barra de Catación',
      category: 'Experiencia Sensorial',
      caption: 'Degustación guiada de microlotes premiados maridados con miel virgen de la finca.',
      alt: 'Mesa de catación con taza de café de especialidad y miel',
    },
    {
      src: '/images/cosecha-cerezas-cafe.jpg',
      title: 'Recolección Selectiva Grano a Grano',
      category: 'Cosecha Manual',
      caption: 'Cosecha artesanal en punto óptimo de maduración para conservar azúcares naturales.',
      alt: 'Manos cosechando cerezas de café maduras en la planta',
    },
    {
      src: '/images/apicultor-cosecha-miel.jpg',
      title: 'Manejo Apícola Regenerativo',
      category: 'Apiarios Vivos',
      caption: 'Inspección de bastidores con traje protector durante la cosecha respetuosa de miel.',
      alt: 'Apicultor con traje protector cosechando miel de la colmena',
    },
    {
      src: '/images/frascos-miel-pura-artesanal.jpg',
      title: 'Miel Virgen & Café en la Tienda',
      category: 'Productos de Origen',
      caption: 'Disponibles para degustar y comprar directamente en la cafetería de la hacienda.',
      alt: 'Frascos de miel pura artesanal y productos de café',
    },
  ];

  const [selectedPhoto, setSelectedPhoto] = useState<FarmPhoto>(farmGallery[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    addToast({
      type: 'success',
      title: 'Mensaje enviado',
      message: 'Gracias por escribirnos. Un anfitrión de la finca se pondrá en contacto pronto.',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Banner - Fondo Azul con Letras Amarillo de la Marca (#FFD242) */}
      <div className="rounded-[36px] bg-[#0F172A] text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden border-2 border-[#FFD242]/30">
        {/* Supporting backdrop image using finca-paisaje-cafetal.jpg */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none scale-105"
          style={{ backgroundImage: "url('/images/finca-paisaje-cafetal.jpg')" }}
        />
        {/* Contrast Gradients so yellow typography stands out vibrantly */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/70 pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black uppercase tracking-wider shadow-md">
            <span>🐝</span>
            <span>Atención Directa & Visitas</span>
          </div>

          {/* Letra Amarillo de la Marca (#FFD242) sobre el fondo azul */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display leading-tight text-[#FFD242]">
            Contáctanos & Planea tu Visita
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-2xl">
            Estamos a tu disposición para responder consultas sobre{' '}
            <strong className="text-[#FFD242] font-extrabold">compras mayoristas de café y miel</strong>, agendamiento de{' '}
            <strong className="text-[#FFD242] font-extrabold">catas y tours en los apiarios</strong>, o indicaciones paso a paso para{' '}
            <strong className="text-[#FFD242] font-extrabold">llegar a la finca</strong>.
          </p>

          {/* Highlight badges on blue banner */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-[#FFD242]/40 text-[#FFD242] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD242]" />
              <span>Respuesta en menos de 24h</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-[#FFD242]/40 text-[#FFD242] text-xs font-bold">
              <Coffee className="w-3.5 h-3.5 text-[#FFD242]" />
              <span>Visitas guiadas al cafetal</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-[#FFD242]/40 text-[#FFD242] text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-[#FFD242]" />
              <span>Cordillera Central, Colombia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Info & Photos on Left, Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact info cards & Photo Showcase */}
        <div className="lg:col-span-6 space-y-6">
          {/* Farm Contact Details & Company Official Info */}
          <div className="p-8 rounded-[32px] bg-white border-2 border-amber-100 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/30 px-3 py-1 rounded-full">
                  Ficha Oficial de la Empresa
                </span>
                <h3 className="font-black text-2xl text-[#2D1A0D] font-display mt-1">
                  Melifera coffee
                </h3>
              </div>
              <span className="text-[11px] font-bold text-[#2D1A0D] bg-[#FFD242] px-3.5 py-1.5 rounded-full shadow-xs">
                Contacto Directo
              </span>
            </div>

            {/* Persona de Contacto & Canales */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#784A23] block">Persona de Contacto:</span>
                  <strong className="text-base text-[#2D1A0D] font-extrabold font-display">Melissa Moreno</strong>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white text-[#A16207] font-bold border border-amber-200">
                  Melifera coffee
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <a
                  href="https://wa.me/573043785413?text=Hola%20Melissa,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20Melifera%20coffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp: 304 378 5413</span>
                </a>
                <a
                  href="mailto:meliferacoffe@gmail.com"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#2D1A0D] hover:bg-[#3E2714] text-[#FFD242] font-bold text-xs transition shadow-xs"
                >
                  <Mail className="w-4 h-4" />
                  <span>meliferacoffe@gmail.com</span>
                </a>
              </div>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-50 transition">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="block text-[#2D1A0D] font-bold text-sm">Línea WhatsApp Oficial:</strong>
                  <span className="text-slate-800 font-semibold block">304 378 5413 (Melissa Moreno)</span>
                  <span className="text-slate-500 block text-[11px]">Atención de pedidos de café, productos de colmena y reservas</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-50 transition">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <strong className="block text-[#2D1A0D] font-bold text-sm">Correo Electrónico:</strong>
                  <a href="mailto:meliferacoffe@gmail.com" className="text-amber-900 font-bold hover:underline block text-xs">
                    meliferacoffe@gmail.com
                  </a>
                  <span className="text-slate-500 block text-[11px]">Cotizaciones de café verde, plántulas y eventos especiales</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-50 transition">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-[#2D1A0D] font-bold text-sm">Ubicación Finca & Cafetería:</strong>
                  <span className="text-slate-600 leading-relaxed">
                    Vereda El Silencio, Km 4 Vía San Juan de Arama, Cordillera Central, Colombia (1.650 msnm).
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-amber-50/40 hover:bg-amber-50 transition">
                <div className="w-10 h-10 rounded-2xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-[#2D1A0D] font-bold text-sm">Horario de Atención:</strong>
                  <span className="text-slate-700 font-semibold block">
                    • Miércoles a viernes: 10:00 am – 6:00 pm
                  </span>
                  <span className="text-slate-700 font-semibold block">
                    • Sábado, domingo y festivos: 10:00 am – 10:00 pm
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-1">
                    Lunes y martes: labores de campo, siembra y mantenimiento apícola (atención con reserva previa).
                  </span>
                </div>
              </div>

              {/* Redes Sociales Oficiales: Instagram */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-pink-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block text-[#2D1A0D] font-bold text-sm">Redes Sociales Oficiales</strong>
                    <a
                      href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 font-extrabold text-xs block transition"
                    >
                      @meliferacoffee (Meliferacoffee)
                    </a>
                    <span className="text-slate-500 block text-[11px]">Fotos del cafetal, colmenas, barismo y eventos</span>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Seguir en Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* 1. Cuéntenos sobre su empresa - Módulo Oficial */}
          <div className="p-8 rounded-[32px] bg-[#FAF6EE] border-2 border-amber-200 space-y-6">
            <div className="space-y-1 border-b border-amber-200/70 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/40 px-3 py-1 rounded-full">
                Perfil Corporativo
              </span>
              <h3 className="text-xl font-black text-[#2D1A0D] font-display mt-1">
                Cuéntenos sobre su empresa
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs">
                <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display flex items-center gap-2">
                  <span className="text-[#A16207]">☕</span> ¿A qué se dedica su empresa?
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  "Nos dedicamos a la producción, comercialización y preparación de cafés especiales, así como a la apicultura y la obtención de productos naturales de la colmena. Cuidamos cada etapa de nuestros procesos para ofrecer productos de excelente calidad."
                </p>
              </div>

              <div className="space-y-1.5 p-4 rounded-2xl bg-white border border-amber-100 shadow-2xs">
                <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display flex items-center gap-2">
                  <span className="text-[#A16207]">🌱</span> ¿Qué productos, materias primas o servicios ofrece?
                </h4>
                <p className="text-slate-700 leading-relaxed text-xs">
                  "Ofrecemos plántulas de café, café verde para tostadores, café tostado y diferentes bebidas en nuestra cafetería. Como apicultores, también contamos con miel, polen y propóleo. Además, realizamos capacitaciones en métodos de filtrado como V60, Chemex y AeroPress, y ofrecemos coffee tours y tours de abejas, en los que las personas pueden conocer de cerca el proceso del café, el mundo de la apicultura y la importancia de las abejas para el medioambiente."
                </p>
              </div>
            </div>
          </div>

          {/* Lo que ofrecemos / Nuestro negocio consiste en */}
          <div className="p-8 rounded-[32px] bg-white border-2 border-[#FFD242] shadow-sm space-y-6">
            <div className="space-y-1 border-b border-amber-100 pb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2D1A0D] bg-[#FFD242] px-3 py-1 rounded-full font-bold">
                Portafolio Integral
              </span>
              <h3 className="text-xl font-black text-[#2D1A0D] font-display mt-1">
                Nuestro Negocio Consiste En
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 text-xs">
              {/* Productos de Café */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-[#2D1A0D] font-extrabold text-sm font-display">
                  <span className="w-7 h-7 rounded-lg bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center text-xs">☕</span>
                  <span>Productos de café:</span>
                </div>
                <ul className="space-y-1.5 pl-9 text-slate-700 font-medium">
                  <li className="list-disc">Café tostado de especialidad.</li>
                  <li className="list-disc">Plántulas de café de diferentes variedades.</li>
                  <li className="list-disc">Café verde para tostadores.</li>
                </ul>
              </div>

              {/* Productos de la Colmena */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-[#2D1A0D] font-extrabold text-sm font-display">
                  <span className="w-7 h-7 rounded-lg bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center text-xs font-black">🍯</span>
                  <span>Productos de la colmena:</span>
                </div>
                <ul className="space-y-1.5 pl-9 text-slate-700 font-medium">
                  <li className="list-disc">Miel de abejas.</li>
                  <li className="list-disc">Polen.</li>
                  <li className="list-disc">Propóleo.</li>
                </ul>
              </div>

              {/* Servicios y Experiencias */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-2 text-[#2D1A0D] font-extrabold text-sm font-display">
                  <span className="w-7 h-7 rounded-lg bg-[#6F4E37] text-white flex items-center justify-center text-xs">✨</span>
                  <span>Servicios y experiencias:</span>
                </div>
                <ul className="space-y-1.5 pl-9 text-slate-700 font-medium">
                  <li className="list-disc">Capacitaciones en preparación de café y métodos de filtrado.</li>
                  <li className="list-disc">Coffee tours para conocer el proceso del café desde la siembra hasta la taza.</li>
                  <li className="list-disc">Tours de abejas para conocer la apicultura, el funcionamiento de las colmenas y la importancia de las abejas.</li>
                  <li className="list-disc">Reservaciones del servicio de fogatas.</li>
                  <li className="list-disc">Reservaciones para decoraciones de cumpleaños.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Transportation advice card */}
          <div className="p-6 rounded-[28px] bg-amber-50/60 border-2 border-amber-200 space-y-3 text-xs">
            <div className="flex items-center gap-2 text-[#2D1A0D]">
              <Compass className="w-5 h-5 text-[#A16207]" />
              <h4 className="font-extrabold text-sm font-display text-[#2D1A0D]">¿Cómo llegar a la Finca?</h4>
            </div>
            <p className="text-slate-700 leading-relaxed">
              La vía principal se encuentra pavimentada hasta el desvío a la vereda. Los últimos 2.5 km son carreteable destapado en excelente estado, transitable por automóviles particulares, camperos y camionetas. Contamos con parqueadero privado vigilado en la cafetería.
            </p>
          </div>

          {/* Official Farm Photo Showcase supporting finca-paisaje-cafetal.jpg */}
          <div className="rounded-[32px] bg-white border-2 border-[#FFD242] p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/30 px-3 py-0.5 rounded-full">
                  Galería de Ubicación
                </span>
                <h4 className="font-extrabold text-base text-[#2D1A0D] font-display mt-1">
                  Conoce la Finca Antes de Tu Llegada
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Haz clic para explorar los espacios
              </span>
            </div>

            {/* Featured Selected Photo */}
            <div className="relative rounded-2xl overflow-hidden aspect-16/10 border-2 border-amber-200 shadow-sm bg-slate-900 group">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-5 text-white">
                <span className="text-[10px] uppercase font-black text-[#FFD242] tracking-wider mb-1">
                  {selectedPhoto.category}
                </span>
                <h5 className="font-bold text-base text-white font-display leading-snug">
                  {selectedPhoto.title}
                </h5>
                <p className="text-xs text-amber-100/90 line-clamp-2 mt-1">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>

            {/* Supporting Thumbnail Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-700 block">
                Fotos de apoyo del cafetal, apiarios y laboratorio:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {farmGallery.map((photo, idx) => {
                  const isActive = selectedPhoto.src === photo.src;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhoto(photo)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                        isActive
                          ? 'border-[#FFD242] ring-2 ring-[#FFD242] scale-105 shadow-md'
                          : 'border-slate-200 hover:border-amber-300 opacity-75 hover:opacity-100'
                      }`}
                      title={photo.title}
                    >
                      <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-[#FFD242]/20 flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 text-[#2D1A0D] drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-6 bg-white rounded-[32px] border-2 border-amber-100 p-8 sm:p-10 shadow-sm flex flex-col justify-between">
          {isSubmitted ? (
            <div className="p-10 text-center space-y-5 my-auto">
              <div className="w-20 h-20 rounded-3xl bg-[#FFD242]/30 text-[#A16207] mx-auto flex items-center justify-center border-2 border-[#FFD242]">
                <CheckCircle2 className="w-10 h-10 text-[#2D1A0D]" />
              </div>
              <h3 className="text-3xl font-black text-[#2D1A0D] font-display">
                ¡Mensaje Recibido!
              </h3>
              <p className="text-xs sm:text-sm text-[#5C381E] max-w-md mx-auto leading-relaxed">
                Gracias por escribirnos. Nuestro equipo en la hacienda responderá a tu solicitud por correo electrónico o WhatsApp en menos de 24 horas.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'informacion_general', message: '' });
                  }}
                  className="px-8 py-3 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black hover:bg-[#F5C72E] transition-all cursor-pointer shadow-md"
                >
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1 border-b border-amber-100 pb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/30 px-3 py-0.5 rounded-full">
                  Formulario Directo
                </span>
                <h3 className="font-black text-2xl text-[#2D1A0D] font-display pt-1">
                  Envíanos un Mensaje
                </h3>
                <p className="text-xs text-[#5C381E]">
                  Diligencia tus datos y nos pondremos en contacto contigo prontamente.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#2D1A0D] block mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Cristian Medina"
                    className="w-full p-3.5 text-xs rounded-2xl border-2 border-amber-100 bg-amber-50/20 focus:border-[#FFD242] focus:bg-white focus:ring-2 focus:ring-[#FFD242]/50 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#2D1A0D] block mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="cristian@ejemplo.com"
                      className="w-full p-3.5 text-xs rounded-2xl border-2 border-amber-100 bg-amber-50/20 focus:border-[#FFD242] focus:bg-white focus:ring-2 focus:ring-[#FFD242]/50 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#2D1A0D] block mb-1">
                      Teléfono Móvil / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+57 300 000 0000"
                      className="w-full p-3.5 text-xs rounded-2xl border-2 border-amber-100 bg-amber-50/20 focus:border-[#FFD242] focus:bg-white focus:ring-2 focus:ring-[#FFD242]/50 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D1A0D] block mb-1">
                    Motivo de Contacto
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3.5 text-xs rounded-2xl border-2 border-amber-100 bg-amber-50/20 font-medium focus:border-[#FFD242] focus:bg-white focus:ring-2 focus:ring-[#FFD242]/50 focus:outline-none transition"
                  >
                    <option value="informacion_general">Información General de la Finca</option>
                    <option value="mayoristas">Compras Mayoristas de Café & Miel (B2B)</option>
                    <option value="eventos_privados">Reserva de Catas & Eventos Privados</option>
                    <option value="cafeteria">Consulta de Menú & Cafetería</option>
                    <option value="visitas">Planificación de Visita en Grupo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2D1A0D] block mb-1">
                    Mensaje Detallado *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos en qué podemos ayudarte (fechas estimadas de visita, volumen requerido de café o miel, etc.)..."
                    className="w-full p-3.5 text-xs rounded-2xl border-2 border-amber-100 bg-amber-50/20 focus:border-[#FFD242] focus:bg-white focus:ring-2 focus:ring-[#FFD242]/50 focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-xs hover:bg-[#F5C72E] transition-all flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg cursor-pointer transform active:scale-98"
                >
                  <Send className="w-4 h-4 text-[#2D1A0D]" />
                  <span>Enviar Consulta a la Finca</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

