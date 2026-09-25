import React from 'react';
import { Coffee, MapPin, Phone, Mail, Clock, Heart, ShieldCheck, Award, Sparkles, Instagram, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  const handleNav = (view: any) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1F1208] text-amber-100/80 pt-16 pb-12 border-t-2 border-[#FFD242]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top banner highlights in Honey and Coffee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 mb-12 border-b border-amber-900/50">
          <div className="flex items-start gap-4 p-6 rounded-[28px] bg-[#2C190C] border border-[#FFD242]/25 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD242] flex items-center justify-center text-[#2D1A0D] font-black shrink-0 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Café de Altura SCA 88+</h4>
              <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
                Polinizado por abejas melíferas en cafetales a 1.650 msnm con cosecha manual.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-[28px] bg-[#2C190C] border border-[#FFD242]/25 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD242] flex items-center justify-center text-[#2D1A0D] font-black shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Miel Cruda de Flor de Café</h4>
              <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
                100% virgen, sin pasteurizar, rica en enzimas y notas florales de nuestra montaña.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-[28px] bg-[#2C190C] border border-[#FFD242]/25 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD242] flex items-center justify-center text-[#2D1A0D] font-black shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Consulta Fácil por Correo</h4>
              <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
                Consulta tus reservas de eventos y cotizaciones al instante con tu correo electrónico.
              </p>
            </div>
          </div>
        </div>

        {/* Official Photography Strip: La Vida en Melífera */}
        <div className="pb-12 mb-12 border-b border-amber-900/50 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#FFD242] text-sm">🐝</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">
                Galería Oficial Melífera Coffie
              </h4>
            </div>
            <span className="text-[11px] text-amber-200/60">
              Imágenes reales de nuestros cafetales, apiarios y café de especialidad
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="rounded-2xl overflow-hidden aspect-square border border-[#FFD242]/20 relative group">
              <img
                src="/images/finca-paisaje-cafetal.jpg"
                alt="Cafetales de altura"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-center bg-black/70 text-[#FFD242] py-0.5 rounded-md backdrop-blur-xs">
                La Finca
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-[#FFD242]/20 relative group">
              <img
                src="/images/apicultor-cosecha-miel.jpg"
                alt="Cosecha de miel en apiarios"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-center bg-black/70 text-white py-0.5 rounded-md backdrop-blur-xs">
                Apiarios
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-[#FFD242]/20 relative group">
              <img
                src="/images/cerezas-cafe-maduras.jpg"
                alt="Cerezas de café maduras"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-center bg-black/70 text-white py-0.5 rounded-md backdrop-blur-xs">
                Cerezas
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-[#FFD242]/20 relative group">
              <img
                src="/images/granos-cafe-tostado-fresco.jpg"
                alt="Granos de café tostados"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-center bg-black/70 text-white py-0.5 rounded-md backdrop-blur-xs">
                Tostión
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-[#FFD242]/20 relative group">
              <img
                src="/images/frascos-miel-pura-artesanal.jpg"
                alt="Miel virgen artesanal"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-center bg-black/70 text-[#FFD242] py-0.5 rounded-md backdrop-blur-xs">
                Miel Virgen
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-square border border-[#FFD242]/20 relative group">
              <img
                src="/images/cata-cafe-miel-taza.jpg"
                alt="Cata de café y miel"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[9px] font-bold text-center bg-black/70 text-[#FFD242] py-0.5 rounded-md backdrop-blur-xs">
                En Taza
              </span>
            </div>
          </div>
        </div>

        {/* Navigation columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand story */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#2C190C] border border-[#FFD242]/30 flex items-center justify-center p-1.5 shadow-sm shrink-0">
                <img
                  src="/images/logo_melifera-removebg-preview.png"
                  alt="Melifera Coffee Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white font-display">
                  Melifera <span className="text-[#FFD242] font-serif italic">coffee</span>
                </span>
                <p className="text-xs text-[#FFD242] font-black italic">
                  "Café co-creado con abejas"
                </p>
              </div>
            </div>
            <p className="text-sm text-amber-100/70 leading-relaxed max-w-sm">
              Producción, comercialización y preparación de cafés especiales, apicultura y productos naturales de la colmena. Cuidamos cada etapa de nuestros procesos para ofrecer productos de excelente calidad.
            </p>
            <div className="pt-2 text-xs text-amber-200/80 space-y-2">
              <div className="p-3 rounded-2xl bg-[#2C190C] border border-[#FFD242]/30 space-y-1.5">
                <p className="text-white font-bold flex items-center gap-2">
                  <span className="text-[#FFD242]">🐝</span>
                  <span>Contacto Directo: <strong className="text-[#FFD242]">Melissa Moreno</strong></span>
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://wa.me/573043785413"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp: 304 378 5413</span>
                  </a>
                  <span className="text-amber-700">•</span>
                  <a
                    href="mailto:meliferacoffe@gmail.com"
                    className="flex items-center gap-1.5 text-[#FFD242] hover:underline font-bold transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>meliferacoffe@gmail.com</span>
                  </a>
                </div>
              </div>

              {/* Instagram Card in Footer */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-950/60 to-rose-950/60 border border-pink-500/30">
                <a
                  href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-bold transition"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@meliferacoffee (Instagram)</span>
                </a>
                <span className="text-[10px] text-amber-300/80 font-medium">Síguenos</span>
              </div>

              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FFD242] shrink-0" />
                <span>Vereda El Silencio, Km 4 Vía San Juan de Arama, Cordillera Central</span>
              </p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-2 font-bold text-white">
                  <Clock className="w-4 h-4 text-[#FFD242] shrink-0" />
                  <span>Horario de Atención:</span>
                </p>
                <p className="pl-6 text-amber-200/90 text-[11px] leading-tight">
                  • Miércoles a viernes: 10:00 am – 6:00 pm<br />
                  • Sábado, domingo y festivos: 10:00 am – 10:00 pm
                </p>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Tienda & Café</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('tienda')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Cafés de Especialidad
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tienda')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Miel Virgen de Cafeto
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tienda')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Panales & Propóleo
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('cotizaciones')} className="hover:text-[#FFD242] transition font-bold text-[#FFD242] cursor-pointer">
                  Cotización al por Mayor
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('cafeteria')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Menú de la Cafetería
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Agendamiento y Eventos */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Experiencias</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('eventos')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Cata Sensorial Melífera
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('eventos')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Ruta de la Miel & Apiarios
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('eventos')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Taller de Barismo Andino
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('eventos')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Tour de Polinización & Cosecha
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('mis-reservas')} className="hover:text-[#FFD242] transition font-bold text-[#FFD242] cursor-pointer">
                  Consultar con mi Cédula
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Contacto */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Información Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => handleNav('nosotros')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Abejas & Cafetales
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contacto')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Contáctanos & Ubicación
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('politicas')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Políticas de Privacidad
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('politicas')} className="hover:text-[#FFD242] transition cursor-pointer">
                  Términos de Reservas & Envíos
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-amber-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-amber-200/70">
          <p>© {new Date().getFullYear()} Melifera coffee. Todos los derechos reservados. Producción y Comercialización de Café Especial y Productos de la Colmena.</p>
          <div className="flex items-center gap-4">
            <span>RNT No. 89421</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Polinizado y tostado con orgullo en Colombia <Heart className="w-3.5 h-3.5 text-[#FFD242] fill-[#FFD242]" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
