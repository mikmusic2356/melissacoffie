import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ProductionChainSection } from '../components/ProductionChainSection';
import { CafeteriaSpacesGallery } from '../components/CafeteriaSpacesGallery';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  Coffee,
  Layers,
  Calendar,
  ShieldCheck,
  CheckCircle,
  FileText,
  Clock,
  MapPin,
  Heart,
  Quote,
  Leaf,
  Flower2,
  CheckCircle2,
  Droplets,
  SunMedium,
  Instagram,
  MessageCircle
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    events,
    cafeteriaMenu,
    setActiveView,
    setSelectedEventForBooking,
  } = useApp();

  const [activeCategoryTab, setActiveCategoryTab] = useState<'all' | 'cafe' | 'miel'>('all');

  const filteredProducts = products.filter((p) => {
    if (activeCategoryTab === 'all') return true;
    return p.categoryId === activeCategoryTab;
  });

  const featuredEvents = events.slice(0, 3);
  const featuredMenu = cafeteriaMenu.slice(0, 4);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 bg-white">
      {/* 1. Grand Airy Hero */}
      <Hero />

      {/* 2. MANIFIESTO & SIMBIOSIS MELÍFERA COFFIE - Diseño Visual e Informativo con Imagen Oficial */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[36px] bg-[#FCF9F2] border-2 border-[#ECC030]/80 shadow-2xl p-6 sm:p-10 lg:p-14 overflow-hidden">
          {/* Honey glow ambient accents */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD242]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          <div className="relative z-10 space-y-10">
            
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2 rounded-full bg-[#FFD242] border border-[#ECC030] text-[#2D1A0D] text-xs font-black shadow-sm tracking-wider">
                <span>🐝</span>
                <span className="font-black italic text-xs sm:text-sm text-[#2D1A0D]">
                  "Café co-creado con abejas"
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#2D1A0D] font-display">
                Simbiosis en el Cafetal: La Abeja Melífera y el Grano de Especialidad
              </h2>
              <p className="text-xs sm:text-sm text-[#5C381E] font-medium max-w-2xl mx-auto">
                Una relación simbiótica milenaria donde la floración del café nutre a las colmenas y las abejas perfeccionan la calidad de cada grano.
              </p>
            </div>

            {/* Central Two-Column Visual & Educational Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* Left Column: Official Graphic Showcase Copilot_20260902_210333.png */}
              <div className="lg:col-span-5">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-[#FFD242]/40 via-amber-400/20 to-[#3E2714]/30 rounded-[32px] blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="relative rounded-[28px] overflow-hidden border-2 border-[#FFD242] shadow-2xl bg-[#1A0E05]">
                    <img
                      src="/images/Copilot_20260902_210333.png"
                      alt="Las abejas melíferas en convivencia con las flores de café y la sostenibilidad ambiental"
                      className="w-full h-auto max-h-[560px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src !== '/Copilot_20260902_210333.png') {
                          target.src = '/Copilot_20260902_210333.png';
                        }
                      }}
                    />

                    {/* Floating Badge Top Left */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#2D1A0D]/90 backdrop-blur-md border border-[#FFD242] text-[#FFD242] text-xs font-black shadow-lg">
                      <Flower2 className="w-3.5 h-3.5 text-[#FFD242]" />
                      <span>Apis mellifera & Flor de Cafeto</span>
                    </div>

                    {/* Floating Eco-Badge Top Right */}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-lg">
                      <Leaf className="w-3.5 h-3.5" />
                      <span>Ecosistema Vivo</span>
                    </div>

                    {/* Bottom Card Caption */}
                    <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-[#1A0E05]/95 backdrop-blur-md border border-[#FFD242]/70 text-white shadow-xl">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-black text-[#FFD242] flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#FFD242]" />
                          Polinización & Convivencia
                        </span>
                        <span className="text-[10px] font-bold text-amber-200 bg-[#FFD242]/20 px-2 py-0.5 rounded-md">
                          100% Sostenible
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-200 mt-1 leading-tight font-medium">
                        Abejas obreras polinizando la flor blanca del cafeto arábica, garantizando el cuajado perfecto de la cereza.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: User Manifesto Text & Impact Highlights */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Core Manifesto Card */}
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white border-2 border-amber-200/90 shadow-sm space-y-4">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#3E2714] text-[#FFD242] border-2 border-[#FFD242] flex items-center justify-center shrink-0 shadow-sm">
                      <Quote className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#A16207]">
                        Compromiso Ambiental y de Calidad
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-[#2D1A0D] font-display">
                        El Valor de la Polinización Cruzada
                      </h4>
                    </div>
                  </div>

                  {/* Primary Requested Quote */}
                  <p className="text-base sm:text-lg lg:text-xl font-bold text-[#2D1A0D] leading-relaxed font-display">
                    "Las abejas melíferas, en su convivencia con las flores de café, no solo garantizan una <span className="bg-[#FFD242]/40 px-2.5 py-0.5 rounded-lg text-[#2D1A0D] font-extrabold">mayor producción de granos de alta calidad</span>, sino que también contribuyen a la conservación de los ecosistemas asociados a los cafetales, promoviendo la <span className="text-[#3E2714] underline decoration-[#FFD242] decoration-4 underline-offset-4">biodiversidad y la sostenibilidad ambiental</span>."
                  </p>

                  {/* Complementary Brand Statements */}
                  <div className="pt-2 space-y-3 border-t border-amber-100">
                    <p className="text-sm sm:text-base font-medium text-[#4A2E18] leading-relaxed font-serif italic">
                      "Nuestro café está diseñado para aquellos que aprecian la complejidad de los sabores y la belleza de las tradiciones."
                    </p>

                    <div className="pt-1">
                      <p className="text-xs sm:text-sm font-black text-[#2D1A0D] tracking-wide inline-block px-4 py-2.5 rounded-2xl bg-[#FFD242]/20 border border-[#FFD242] shadow-2xs">
                        "Si eres un explorador del sabor, un amante de la sostenibilidad y buscas una conexión más profunda con tu café, <span className="text-[#3E2714] font-extrabold underline decoration-[#FFD242]">este es tu lugar</span>."
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Informative Metric Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-[#FFD242] transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h5 className="font-extrabold text-[#2D1A0D] text-xs font-display">Mayor Calidad</h5>
                    <p className="text-[11px] text-[#5C381E] mt-1 leading-snug">
                      Granos hasta 18% más densos y mayor concentración de azúcares naturales por fecundación integral.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-[#FFD242] transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <h5 className="font-extrabold text-[#2D1A0D] text-xs font-display">Biodiversidad</h5>
                    <p className="text-[11px] text-[#5C381E] mt-1 leading-snug">
                      La presencia de abejas reactiva el corredor biológico andino y regenera la flora nativa circundante.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-2xs hover:border-[#FFD242] transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-xs mb-2 shadow-2xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h5 className="font-extrabold text-[#2D1A0D] text-xs font-display">Cero Pesticidas</h5>
                    <p className="text-[11px] text-[#5C381E] mt-1 leading-snug">
                      El bienestar de nuestras colmenas exige un cultivo 100% libre de agroquímicos dañinos o neonicotinoides.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Scientific and Agronomic Explanation: How bees improve coffee */}
            <div className="pt-8 border-t-2 border-amber-200/80 text-left">
              <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/30 px-3 py-1 rounded-full">
                  Ciencia & Sabor de Origen
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#2D1A0D] font-display">
                  ¿Cómo las colmenas mejoran la calidad de nuestro café?
                </h3>
                <p className="text-xs sm:text-sm text-[#5C381E]">
                  Ubicar las colmenas a pocos metros de nuestros cafetos arábica desencadena un ciclo natural que eleva el perfil de taza:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Step 1 */}
                <div className="rounded-2xl bg-white border-2 border-amber-200/90 shadow-xs hover:border-[#FFD242] transition-all overflow-hidden flex flex-col">
                  <div className="relative aspect-16/9 overflow-hidden bg-amber-50">
                    <img
                      src="/images/colmena-cerca-cafetal.jpg"
                      alt="Colmenas contiguas al cafetal"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-xs shadow-xs">
                      01
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display mb-1">
                      Colmenas Contiguas
                    </h4>
                    <p className="text-xs text-[#5C381E] leading-relaxed">
                      Instalamos apiarios a menos de 50m de los cafetales. Cuando el cafeto florece por 48 horas, las abejas polinizan cada flor sin demora.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-2xl bg-white border-2 border-amber-200/90 shadow-xs hover:border-[#FFD242] transition-all overflow-hidden flex flex-col">
                  <div className="relative aspect-16/9 overflow-hidden bg-amber-50">
                    <img
                      src="/images/cerezas-cafe-maduras.jpg"
                      alt="Cerezas de café maduras fecundadas por abejas"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center font-black text-xs shadow-xs">
                      02
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display mb-1">
                      Polinización Cruzada
                    </h4>
                    <p className="text-xs text-[#5C381E] leading-relaxed">
                      El polen transferido de flor en flor estimula un cuajado completo del fruto. Se reduce a cero los granos vanos, asegurando cerezas sanas.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-2xl bg-white border-2 border-amber-200/90 shadow-xs hover:border-[#FFD242] transition-all overflow-hidden flex flex-col">
                  <div className="relative aspect-16/9 overflow-hidden bg-amber-50">
                    <img
                      src="/images/cosecha-cerezas-cafe.jpg"
                      alt="Cosecha de café con granos de alta densidad"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-xs shadow-xs">
                      03
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display mb-1">
                      + Azúcares & Grano Denso
                    </h4>
                    <p className="text-xs text-[#5C381E] leading-relaxed">
                      Las cerezas polinizadas desarrollan un mucílago más rico en azúcares naturales (grados Brix) y un grano hasta 18% más denso y uniforme.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="rounded-2xl bg-white border-2 border-amber-200/90 shadow-xs hover:border-[#FFD242] transition-all overflow-hidden flex flex-col">
                  <div className="relative aspect-16/9 overflow-hidden bg-amber-50">
                    <img
                      src="/images/granos-cafe-tostado-fresco.jpg"
                      alt="Taza SCA 88+ y granos tostados frescos"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center font-black text-xs shadow-xs">
                      04
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display mb-1">
                      Taza de alta calidad
                    </h4>
                    <p className="text-xs text-[#5C381E] leading-relaxed">
                      Al tostar, el grano carameliza con notas florales a jazmín y miel silvestre. Paralelamente, la colmena produce miel pura de cafeto.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2.5 NUESTRA EMPRESA: Melifera coffee - Datos Oficiales & Portafolio */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-[#FAF6EE] border-2 border-[#FFD242] p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#FFD242]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-amber-200/80 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black">
                  <span>🐝</span>
                  <span>Empresa Oficial</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-[#2D1A0D] font-display">
                  Melifera coffee
                </h3>
                <p className="text-sm sm:text-base text-[#5C381E] max-w-2xl leading-relaxed">
                  Nos dedicamos a la producción, comercialización y preparación de cafés especiales, así como a la apicultura y la obtención de productos naturales de la colmena. Cuidamos cada etapa de nuestros procesos para ofrecer productos de excelente calidad.
                </p>
              </div>

              {/* Direct Contact Card with Melissa Moreno */}
              <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs space-y-3 shrink-0 lg:min-w-[320px]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#A16207] uppercase tracking-wider">Atención Personalizada</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFD242] text-[#2D1A0D] font-bold">Oficial</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Persona de contacto:</span>
                  <strong className="text-base text-[#2D1A0D] font-black font-display">Melissa Moreno</strong>
                </div>
                <div className="space-y-2 pt-1 text-xs">
                  <a
                    href="https://wa.me/573043785413?text=Hola%20Melissa,%20quisiera%20informaci%C3%B3n%20sobre%20Melifera%20coffee"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold transition shadow-2xs"
                  >
                    <span>WhatsApp: 304 378 5413</span>
                  </a>
                  <a
                    href="mailto:meliferacoffe@gmail.com"
                    className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#2D1A0D] hover:bg-[#3E2714] text-[#FFD242] font-bold transition shadow-2xs"
                  >
                    <span>meliferacoffe@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Tres Pilares: Lo que Ofrecemos */}
            <div className="space-y-4">
              <h4 className="text-xl font-black text-[#2D1A0D] font-display">
                Nuestro Negocio Consiste En:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Café */}
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center font-bold text-lg">
                      ☕
                    </div>
                    <h5 className="font-extrabold text-[#2D1A0D] text-base font-display">
                      Productos de café:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A16207]" />
                        <span>Café tostado de especialidad</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A16207]" />
                        <span>Plántulas de café de diferentes variedades</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#A16207]" />
                        <span>Café verde para tostadores</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setActiveView('tienda')}
                    className="w-full mt-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#2D1A0D] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-200"
                  >
                    <span>Explorar Catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A16207]" />
                  </button>
                </div>

                {/* 2. Colmena */}
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-bold text-lg">
                      🍯
                    </div>
                    <h5 className="font-extrabold text-[#2D1A0D] text-base font-display">
                      Productos de la colmena:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Miel de abejas pura y virgen</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Polen silvestre multivitamínico</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Propóleo natural concentrado</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setActiveView('tienda')}
                    className="w-full mt-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#2D1A0D] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 border border-amber-200"
                  >
                    <span>Ver Miel & Polen</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                </div>

                {/* 3. Servicios & Experiencias */}
                <div className="p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-xs space-y-3 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#2D1A0D] flex items-center justify-center font-bold text-lg">
                      ✨
                    </div>
                    <h5 className="font-extrabold text-[#2D1A0D] text-base font-display">
                      Servicios y experiencias:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Capacitaciones en filtrados (V60, Chemex, AeroPress)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Coffee tours (de la siembra a la taza)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Tours de abejas y colmenas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Reservaciones del servicio de fogatas</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        <span>Decoraciones para cumpleaños</span>
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setActiveView('eventos')}
                    className="w-full mt-4 py-2 rounded-xl bg-[#FFD242] hover:bg-[#ecc030] text-[#2D1A0D] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Reservar Experiencias</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TODA LA CADENA PRODUCTIVA: DE LA SIEMBRA A LA TAZA */}
      <ProductionChainSection />

      {/* 3. Marketplace Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#3E2714]">
              <Sparkles className="w-4 h-4 text-[#FFD242]" />
              <span>Cosecha & Catálogo Melífera</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D1A0D] mt-1 font-display">
              Productos de Nuestra Finca
            </h2>
            <p className="text-sm text-[#5C381E] mt-1 max-w-xl">
              Microlotes de café arábica y miel virgen de cafeto disponibles para compra individual o cotización mayorista.
            </p>
          </div>

          {/* Category Filter Pills in Honey Yellow & Coffee */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-amber-50 border border-amber-200/80">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCategoryTab === 'all'
                  ? 'bg-[#FFD242] text-[#2D1A0D] shadow-xs border border-[#ECC030]'
                  : 'text-[#4A2E18] hover:bg-[#FFD242]/20 hover:text-[#2D1A0D]'
              }`}
            >
              Todos ({products.length})
            </button>
            <button
              onClick={() => setActiveCategoryTab('cafe')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCategoryTab === 'cafe'
                  ? 'bg-[#FFD242] text-[#2D1A0D] shadow-xs border border-[#ECC030]'
                  : 'text-[#4A2E18] hover:bg-[#FFD242]/20 hover:text-[#2D1A0D]'
              }`}
            >
              ☕ Cafés Especiales
            </button>
            <button
              onClick={() => setActiveCategoryTab('miel')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer ${
                activeCategoryTab === 'miel'
                  ? 'bg-[#FFD242] text-[#2D1A0D] shadow-xs border border-[#ECC030]'
                  : 'text-[#4A2E18] hover:bg-[#FFD242]/20 hover:text-[#2D1A0D]'
              }`}
            >
              🍯 Mieles & Colmena
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View full store CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setActiveView('tienda')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFD242] text-[#2D1A0D] font-extrabold text-sm hover:bg-[#f0c330] transition shadow-md hover:shadow-lg cursor-pointer border border-[#f0c330]"
          >
            <span>Ver todo el catálogo en el Marketplace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Wholesale Callout & B2B Calculator Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[36px] bg-[#2D1A0D] text-white p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden border-2 border-[#FFD242]/30">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#FFD242]/10 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] inline-block shadow-xs">
                Canal Mayorista & Cafeterías
              </span>
              <h3 className="text-2xl sm:text-4xl font-black font-display leading-tight text-white">
                ¿Tienes una cafetería, tostaduría o restaurante?
              </h3>
              <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
                Adquiere café en verde o tostado en bultos de 25kg / 50kg con perfiles personalizados de tostión, y miel virgen en cuñetes o frascos institucionales con descuentos por volumen de hasta el 38%.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="flex items-center gap-2 text-amber-100">
                  <CheckCircle className="w-4 h-4 text-[#FFD242] shrink-0" />
                  <span>Envíos a todo el país</span>
                </div>
                <div className="flex items-center gap-2 text-amber-100">
                  <CheckCircle className="w-4 h-4 text-[#FFD242] shrink-0" />
                  <span>Empaque y rotulado</span>
                </div>
                <div className="flex items-center gap-2 text-amber-100">
                  <CheckCircle className="w-4 h-4 text-[#FFD242] shrink-0" />
                  <span>Ficha técnica SCA y trazabilidad</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-white/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFD242] text-[#2D1A0D] mx-auto flex items-center justify-center shadow-xs font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-lg text-white font-display">
                Cotizador Mayorista Inmediato
              </h4>
              <p className="text-xs text-amber-100/80">
                Calcula precios según kilos o volumen, consulta con tu cédula o NIT y recibe seguimiento en tiempo real.
              </p>
              <button
                onClick={() => setActiveView('cotizaciones')}
                className="w-full py-3.5 px-5 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-xs hover:bg-[#f0c330] transition flex items-center justify-center gap-2 cursor-pointer shadow-md border border-[#f0c330]"
              >
                <span>Abrir Formulario de Cotización</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Seasonal Events & Pro Booking Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#3E2714]">
              <Calendar className="w-4 h-4 text-[#FFD242]" />
              <span>Experiencias & Agendamiento</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2D1A0D] mt-1 font-display">
              Talleres & Catas en la Finca
            </h2>
            <p className="text-sm text-[#5C381E] mt-1 max-w-xl">
              Recorre cafetales, ponte el traje de apicultor o aprende a catar cafés de especialidad. Reserva y paga tu cupo en línea con tu cédula.
            </p>
          </div>

          <button
            onClick={() => setActiveView('eventos')}
            className="text-xs font-bold text-[#3E2714] hover:text-[#2D1A0D] transition flex items-center gap-1.5 cursor-pointer bg-amber-50 px-4 py-2 rounded-full border border-amber-200"
          >
            <span>Ver todo el calendario de fechas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.map((evt) => {
            const available = Math.max(0, evt.capacity - evt.bookedSpots);
            return (
              <div
                key={evt.id}
                className="group bg-white rounded-[32px] border-2 border-amber-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-amber-50">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black bg-[#2D1A0D] text-white">
                      {evt.season}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FFD242] text-[#2D1A0D] shadow-2xs">
                      {available > 0 ? `${available} cupos libres` : 'Agotado'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-[#5C381E] font-semibold mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#3E2714]" />
                        {evt.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#3E2714]" />
                        {evt.time}
                      </span>
                    </div>

                    <h3 className="font-bold text-[#2D1A0D] text-lg leading-snug group-hover:text-[#3E2714] transition font-display">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#5C381E] mt-2 line-clamp-2">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#5C381E] block font-medium">Por asistente:</span>
                      <span className="text-lg font-black text-[#2D1A0D] font-display">
                        {formatCOP(evt.pricePerPerson)}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedEventForBooking(evt)}
                      className="px-4 py-2 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black hover:bg-[#f0c330] transition flex items-center gap-1.5 cursor-pointer shadow-xs border border-[#f0c330]"
                    >
                      <span>Reservar & Pagar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Cafetería de la Finca Spotlight */}
      <section className="bg-[#FFFDF7] py-16 border-y-2 border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-2xs">
                <Coffee className="w-3.5 h-3.5" />
                <span>Cafetería Melifera coffee</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#2D1A0D] font-display leading-tight">
                Donde el café se marida con la miel fresca
              </h2>
              <p className="text-sm text-[#5C381E] leading-relaxed">
                En el corazón de la finca se encuentra nuestra terraza cafetera con vista a los panales y cafetales. Disfruta métodos de filtrado con agua de manantial, bebidas con miel cruda y repostería artesanal.
              </p>

              <div className="p-5 rounded-[24px] bg-white border border-amber-200/70 shadow-sm space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-[#2D1A0D]">
                  <MapPin className="w-4 h-4 text-[#3E2714]" />
                  <span>Terraza Panorámica Melifera coffee (1.650 msnm)</span>
                </div>
                <div className="space-y-1 text-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-[#A16207]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Horario de Atención:</span>
                  </div>
                  <p className="text-xs leading-relaxed">
                    • <strong>Miércoles a viernes:</strong> 10:00 am – 6:00 pm<br />
                    • <strong>Sábado, domingo y festivos:</strong> 10:00 am – 10:00 pm
                  </p>
                  <p className="text-[11px] text-slate-500 pt-0.5">
                    Estacionamiento gratuito y área pet-friendly.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setActiveView('cafeteria')}
                  className="px-6 py-3 rounded-full bg-[#3E2714] text-white font-extrabold text-xs hover:bg-[#2D1A0D] transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>Ver Carta Completa & Precios</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD242]" />
                </button>

                <a
                  href="https://wa.me/573043785413?text=Hola%20Melissa,%20quisiera%20reservar%20una%20mesa%20en%20la%20cafeter%C3%ADa%20de%20Melifera%20coffee"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition flex items-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: 304 378 5413</span>
                </a>
              </div>
            </div>

            {/* Menu preview cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredMenu.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-[24px] bg-white border-2 border-amber-100 shadow-sm flex items-center gap-4 hover:shadow-md transition"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#FFD242] text-[#2D1A0D]">
                        {item.badges[0] || 'Melífera'}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#2D1A0D] text-xs truncate font-display">{item.name}</h4>
                    <p className="text-[11px] text-[#5C381E] line-clamp-1 mt-0.5">{item.description}</p>
                    <span className="text-xs font-black text-[#3E2714] mt-1 block">
                      {formatCOP(item.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Galería de Espacios de la Cafetería */}
          <div className="mt-16 pt-12 border-t border-amber-200/60">
            <CafeteriaSpacesGallery />
          </div>
        </div>
      </section>

      {/* 7. Testimonials & Community Voice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#3E2714]">
            Comunidad Melifera coffee
          </span>
          <h2 className="text-3xl font-black text-[#2D1A0D] font-display">
            Lo que dicen quienes nos visitan y compran
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-7 rounded-[32px] bg-white border-2 border-amber-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <Quote className="w-8 h-8 text-[#FFD242]" />
            <p className="text-xs text-[#5C381E] leading-relaxed italic">
              "Compramos el microlote Geisha para nuestra barra de café. Los clientes quedan fascinados con las notas a jazmín y miel de cafeto, además de la trazabilidad tan transparente de las colmenas."
            </p>
            <div className="pt-3 border-t border-amber-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFD242] flex items-center justify-center font-black text-xs text-[#2D1A0D]">
                DR
              </div>
              <div>
                <h5 className="font-bold text-[#2D1A0D] text-xs">David Restrepo</h5>
                <span className="text-[10px] text-[#5C381E]">Dueño de Cafetería de Especialidad</span>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-[32px] bg-white border-2 border-amber-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <Quote className="w-8 h-8 text-[#FFD242]" />
            <p className="text-xs text-[#5C381E] leading-relaxed italic">
              "El taller de cata sensorial y luego la ruta de la miel con traje de apicultor fue inolvidable. Consultar mi reserva con la cédula sin tener que crear contraseñas fue facilísimo."
            </p>
            <div className="pt-3 border-t border-amber-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#3E2714] flex items-center justify-center font-black text-xs text-[#FFD242]">
                MP
              </div>
              <div>
                <h5 className="font-bold text-[#2D1A0D] text-xs">María Paula Gómez</h5>
                <span className="text-[10px] text-[#5C381E]">Visitante de Fin de Semana</span>
              </div>
            </div>
          </div>

          <div className="p-7 rounded-[32px] bg-white border-2 border-amber-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
            <Quote className="w-8 h-8 text-[#FFD242]" />
            <p className="text-xs text-[#5C381E] leading-relaxed italic">
              "La miel pura de flor de café es otro nivel, nunca había probado una miel tan aromática. Compré el panal fresco y ahora soy cliente fiel en cada cosecha."
            </p>
            <div className="pt-3 border-t border-amber-100 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFD242] flex items-center justify-center font-black text-xs text-[#2D1A0D]">
                AF
              </div>
              <div>
                <h5 className="font-bold text-[#2D1A0D] text-xs">Andrés Felipe Castro</h5>
                <span className="text-[10px] text-[#5C381E]">Comprador Particular</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
