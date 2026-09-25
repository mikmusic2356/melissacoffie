import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Heart, Award, ShieldCheck, Coffee, Users, ArrowRight, Phone, Mail, CheckCircle2, Flame, Gift, Clock, Instagram } from 'lucide-react';
import { ProductionChainSection } from '../components/ProductionChainSection';

export const AboutView: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Header in Deep Coffee and Honey Yellow */}
      <div className="rounded-[36px] bg-[#1A0E05] text-white p-8 sm:p-14 shadow-2xl relative overflow-hidden border-2 border-[#FFD242]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD242]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-md border border-[#ECC030]">
            <span>🐝</span>
            <span className="font-black italic">"Café co-creado con abejas"</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display leading-tight text-white">
            Melifera <span className="text-[#FFD242] font-serif italic">coffee</span>
          </h1>
          <p className="text-[#FFD242] font-extrabold text-lg sm:text-xl">
            La presencia de nuestras colmenas en el cafetal eleva la calidad del grano y produce miel virgen extraordinaria.
          </p>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Nacimos en las altas laderas andinas a 1.650 metros de altitud con un propósito agronómico claro: integrar apiarios orgánicos directamente en los lotes de café arábica. El resultado es un café con mayor dulzor, densidad y uniformidad, cosechado en armonía con la naturaleza.
          </p>

          {/* Quick Contact Badge on Hero */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-[#FFD242]/30 text-white">
              <span className="text-[#FFD242] font-bold">Contacto:</span>
              <span className="font-semibold">Melissa Moreno</span>
            </div>
            <a
              href="https://wa.me/573043785413"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2 rounded-full font-bold transition shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: 304 378 5413</span>
            </a>
            <a
              href="mailto:meliferacoffe@gmail.com"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#FFD242] px-4 py-2 rounded-full font-bold transition border border-white/20"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>meliferacoffe@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sección 1: Cuéntenos sobre su empresa - Ficha Corporativa Oficial */}
      <div className="rounded-[36px] bg-[#FAF6EE] border-2 border-amber-200 p-8 sm:p-12 space-y-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black mb-2">
              <span>🐝</span>
              <span>Identidad & Propósito</span>
            </div>
            <h2 className="text-3xl font-black text-[#2D1A0D] font-display">
              Cuéntenos sobre su empresa: Melifera coffee
            </h2>
            <p className="text-sm text-[#5C381E] mt-1">
              Información oficial de nuestra empresa, propósito y canales de atención directa.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-1.5 text-xs text-[#2D1A0D] shrink-0">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Empresa: <strong className="font-black text-[#2D1A0D]">Melifera coffee</strong></span>
            </div>
            <p><span className="text-slate-500">Persona de contacto:</span> <strong>Melissa Moreno</strong></p>
            <p className="flex items-center gap-1.5">
              <span className="text-slate-500">WhatsApp:</span>
              <a href="https://wa.me/573043785413" target="_blank" rel="noopener noreferrer" className="font-extrabold text-emerald-600 hover:underline">
                304 378 5413
              </a>
            </p>
            <p><span className="text-slate-500">Correo:</span> <strong>meliferacoffe@gmail.com</strong></p>
            <p className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
              <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />
              <a href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-pink-600 font-bold hover:underline">
                @meliferacoffee
              </a>
            </p>
            <div className="pt-1 text-[11px] text-slate-600 leading-tight border-t border-slate-100">
              <strong className="text-amber-800 block">Horario de atención:</strong>
              <span>Miér-Vie: 10am-6pm | Sáb-Dom y festivos: 10am-10pm</span>
            </div>
          </div>
        </div>

        {/* Las 2 Preguntas Fundamentales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pregunta 1 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD242]/30 text-[#A16207] text-xs font-black">
              <Coffee className="w-3.5 h-3.5" />
              <span>Pregunta 1</span>
            </div>
            <h3 className="text-xl font-black text-[#2D1A0D] font-display">
              ¿A qué se dedica su empresa?
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-[#2D1A0D] text-sm leading-relaxed font-medium">
              "Nos dedicamos a la producción, comercialización y preparación de cafés especiales, así como a la apicultura y la obtención de productos naturales de la colmena. Cuidamos cada etapa de nuestros procesos para ofrecer productos de excelente calidad."
            </div>
          </div>

          {/* Pregunta 2 */}
          <div className="p-6 rounded-3xl bg-white border-2 border-amber-100 shadow-xs space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD242]/30 text-[#A16207] text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pregunta 2</span>
            </div>
            <h3 className="text-xl font-black text-[#2D1A0D] font-display">
              ¿Qué productos, materias primas o servicios ofrece?
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-[#2D1A0D] text-sm leading-relaxed font-medium">
              "Ofrecemos plántulas de café, café verde para tostadores, café tostado y diferentes bebidas en nuestra cafetería. Como apicultores, también contamos con miel, polen y propóleo. Además, realizamos capacitaciones en métodos de filtrado como V60, Chemex y AeroPress, y ofrecemos coffee tours y tours de abejas, en los que las personas pueden conocer de cerca el proceso del café, el mundo de la apicultura y la importancia de las abejas para el medioambiente."
            </div>
          </div>
        </div>

        {/* Sección: Nuestro Negocio Consiste En / Lo que Ofrecemos */}
        <div className="space-y-4 pt-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/40 px-3.5 py-1 rounded-full">
              Portafolio Integral
            </span>
            <h3 className="text-2xl font-black text-[#2D1A0D] font-display">
              Nuestro Negocio Consiste En:
            </h3>
            <p className="text-xs text-[#5C381E]">
              Tres pilares fundamentales: café de origen, derivados puros de la colmena y vivencias educativas en la montaña.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Pilar 1: Productos de Café */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#2D1A0D] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center font-black text-xl shadow-xs">
                  ☕
                </div>
                <h4 className="text-lg font-black text-[#2D1A0D] font-display">
                  Productos de café:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A16207] shrink-0 mt-0.5" />
                    <span><strong>Café tostado de especialidad:</strong> Microlotes Geisha, Bourbon Rosado y Castillo con tueste artesanal en la finca.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A16207] shrink-0 mt-0.5" />
                    <span><strong>Plántulas de café de diferentes variedades:</strong> Almácigos con genética pura y vigor radicular óptimo para siembra.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A16207] shrink-0 mt-0.5" />
                    <span><strong>Café verde para tostadores:</strong> Grano en almendra seleccionado por densidad y humedad controlada (10.5% - 11.5%).</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('tienda')}
                className="w-full py-2.5 rounded-xl bg-[#2D1A0D] hover:bg-[#3E2714] text-[#FFD242] font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ver Productos en Tienda</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pilar 2: Productos de la Colmena */}
            <div className="p-6 rounded-3xl bg-white border-2 border-[#FFD242] shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-xl shadow-xs">
                  🍯
                </div>
                <h4 className="text-lg font-black text-[#2D1A0D] font-display">
                  Productos de la colmena:
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Miel de abejas:</strong> Miel cruda virgen monovarietal de flor de cafeto y bosque nativo, sin pasteurizar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Polen:</strong> Gránulos dorados multivitamínicos recolectados diariamente en las colmenas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Propóleo:</strong> Extracto concentrado natural con potentes propiedades antibacterianas e inmunológicas.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('tienda')}
                className="w-full py-2.5 rounded-xl bg-[#FFD242] hover:bg-[#ecc030] text-[#2D1A0D] font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Ver Miel & Derivados</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pilar 3: Servicios y Experiencias */}
            <div className="p-6 rounded-3xl bg-white border-2 border-amber-300 shadow-sm flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#2D1A0D] flex items-center justify-center font-black text-xl shadow-xs">
                  ✨
                </div>
                <h4 className="text-lg font-black text-[#2D1A0D] font-display">
                  Servicios y experiencias:
                </h4>
                <ul className="space-y-2 text-[11px] text-slate-700">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Capacitaciones en café y filtrados:</strong> Talleres especializados en métodos V60, Chemex y AeroPress.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Coffee tours:</strong> Conoce el proceso del café desde la siembra en semillero hasta la taza servida.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Tours de abejas:</strong> Apicultura práctica, funcionamiento de la colmena e importancia ambiental.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Reservaciones de fogatas:</strong> Veladas íntimas al aire libre con café, miel y aperitivos campesinos.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span><strong>Decoraciones de cumpleaños:</strong> Montajes campestres y celebraciones especiales personalizadas.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setActiveView('eventos')}
                className="w-full py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#2D1A0D] font-black text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reservar Experiencias</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative: How Bees Improve the Coffee */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD242]/30 text-[#2D1A0D] text-xs font-black">
            <Sparkles className="w-3.5 h-3.5 text-[#A16207]" />
            <span>Fundamento Agronómico</span>
          </div>
          <h2 className="text-3xl font-black text-[#2D1A0D] font-display leading-tight">
            ¿Por qué tener colmenas cerca al cultivo mejora la calidad del café?
          </h2>
          <p className="text-[#5C381E] text-sm sm:text-base leading-relaxed">
            La flor del cafeto arábica permanece abierta apenas entre 48 y 72 horas. Cuando las colmenas de <em>Apis mellifera</em> están ubicadas a escasos metros del cultivo, cientos de miles de abejas realizan una polinización cruzada masiva y oportuna.
          </p>
          <p className="text-[#5C381E] text-sm sm:text-base leading-relaxed">
            Esta fecundación completa estimula la producción de azúcares naturales (grados Brix) en el mucílago, reduce el porcentaje de frutos vanos o granos "pasillas", e incrementa el peso y la densidad del grano en un 18%. En taza, esto se traduce en una dulzura acaramelada sobresaliente, acidez brillante y notas a flores de azahar y jazmín.
          </p>

          <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-bold text-[#2D1A0D]">
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-2xs">
              <span className="text-2xl font-black text-[#2D1A0D] block font-display">+18% Densidad</span>
              <span className="text-[#784A23] font-medium">Granos compactos con mejor transferencia térmica al tostar</span>
            </div>
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-2xs">
              <span className="text-2xl font-black text-[#2D1A0D] block font-display">22° Brix</span>
              <span className="text-[#784A23] font-medium">Concentración de azúcares impulsada por la polinización</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative group overflow-hidden rounded-3xl border-2 border-amber-200 shadow-md">
            <img
              src="/images/cerezas-cafe-maduras.jpg"
              alt="Cerezas de café maduras en planta arábica"
              className="object-cover h-64 w-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-2 inset-x-2 p-2 rounded-xl bg-[#1A0E05]/80 backdrop-blur-xs text-white text-[10px] font-bold text-center">
              Cerezas Maduras en Cafetal
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-3xl border-2 border-[#FFD242] shadow-md translate-y-6">
            <img
              src="/images/colmena-cerca-cafetal.jpg"
              alt="Colmenas integradas junto al cultivo de café"
              className="object-cover h-64 w-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-2 inset-x-2 p-2 rounded-xl bg-[#1A0E05]/80 backdrop-blur-xs text-[#FFD242] text-[10px] font-bold text-center">
              Colmenas Junto a los Cafetos
            </div>
          </div>
        </div>
      </div>

      {/* Official Photo Gallery: El Ciclo de Origen Melífera */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/30 px-3 py-1 rounded-full">
            Fotografía Oficial de la Finca
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1A0D] font-display">
            Del Apiario y el Cafetal a la Taza
          </h3>
          <p className="text-xs sm:text-sm text-[#5C381E]">
            Momentos auténticos capturados en nuestra hacienda y apiarios en la cordillera.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Finca Paisaje */}
          <div className="group rounded-3xl bg-white border-2 border-amber-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/finca-paisaje-cafetal.jpg"
                alt="Paisaje de la finca cafetera y bosque"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#1A0E05]/85 text-[#FFD242] text-[10px] font-black backdrop-blur-xs">
                La Montaña
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-1">
              <h4 className="font-bold text-xs text-[#2D1A0D] font-display">Ecosistema Andino</h4>
              <p className="text-[11px] text-[#5C381E] leading-relaxed">
                Cafetales sembrados a 1.650 msnm cobijados por bosque nativo y corredores biológicos.
              </p>
            </div>
          </div>

          {/* Card 2: Apicultor Cosecha */}
          <div className="group rounded-3xl bg-white border-2 border-amber-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/apicultor-cosecha-miel.jpg"
                alt="Maestro apicultor en cosecha de miel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-[10px] font-black">
                Manejo Regenerativo
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-1">
              <h4 className="font-bold text-xs text-[#2D1A0D] font-display">Cosecha Artesanal</h4>
              <p className="text-[11px] text-[#5C381E] leading-relaxed">
                Inspección respetuosa de cada bastidor extrayendo miel virgen sin agredir a la colmena.
              </p>
            </div>
          </div>

          {/* Card 3: Cosecha Café */}
          <div className="group rounded-3xl bg-white border-2 border-amber-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/cosecha-cerezas-cafe.jpg"
                alt="Recolección manual selectiva de café"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#1A0E05]/85 text-[#FFD242] text-[10px] font-black backdrop-blur-xs">
                Selección Grano a Grano
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-1">
              <h4 className="font-bold text-xs text-[#2D1A0D] font-display">Cerezas Óptimas</h4>
              <p className="text-[11px] text-[#5C381E] leading-relaxed">
                Recolección manual exclusiva en punto pico de maduración para conservar azúcares naturales.
              </p>
            </div>
          </div>

          {/* Card 4: Frascos Miel y Café */}
          <div className="group rounded-3xl bg-white border-2 border-[#FFD242] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/frascos-miel-pura-artesanal.jpg"
                alt="Frascos oficiales de miel pura Melífera"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-[10px] font-black shadow-xs">
                Producto Terminado
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between space-y-1">
              <h4 className="font-bold text-xs text-[#2D1A0D] font-display">Miel 100% Pura</h4>
              <p className="text-[11px] text-[#5C381E] leading-relaxed">
                Frascos de vidrio con miel cruda y propóleo listos para consumir o maridar con tu café.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainable Values in Honey & Coffee styling */}
      <div className="p-8 sm:p-12 rounded-[36px] bg-[#FFFDF7] border-2 border-amber-200/80 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-[#A16207]">
            Nuestros Pilares Fundacionales
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#2D1A0D] font-display">
            Simbiosis Ecológica & Comercio Justo
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black">
              🐝
            </div>
            <h4 className="font-extrabold text-[#2D1A0D] text-base font-display">Protección Apícola</h4>
            <p className="text-xs text-[#5C381E] leading-relaxed">
              Cero pesticidas químicos y siembra continua de flores nativas para garantizar nutrición y salud a nuestras colmenas todo el año.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#2D1A0D] text-[#FFD242] flex items-center justify-center font-black">
              ☕
            </div>
            <h4 className="font-extrabold text-[#2D1A0D] text-base font-display">Caficultura de Precisión</h4>
            <p className="text-xs text-[#5C381E] leading-relaxed">
              Recolección 100% manual selectiva de cerezas en su punto óptimo de maduración, secado al sol en marquesinas ventiladas.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black">
              🍯
            </div>
            <h4 className="font-extrabold text-[#2D1A0D] text-base font-display">Miel 100% Virgen</h4>
            <p className="text-xs text-[#5C381E] leading-relaxed">
              Extracción en frío sin calor artificial ni filtrados agresivos, conservando el polen, enzimas y el aroma sutil a jazmín de la flor de cafeto.
            </p>
          </div>
        </div>
      </div>

      {/* Nursery & Germination: The Origin of every plant */}
      <div className="p-8 sm:p-12 rounded-[36px] bg-[#FAF6EE] border-2 border-amber-200 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#A16207] bg-[#FFD242]/40 px-3 py-1 rounded-full">
              Semillero & Vivero de la Finca
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#2D1A0D] font-display">
              El Nacimiento del Cafeto: Genética Pura & Cuidado Agronómico
            </h3>
            <p className="text-xs sm:text-sm text-[#5C381E] leading-relaxed">
              Todo gran café comienza en la semilla. En nuestro vivero propio cuidamos el vigor radicular y la sanidad biológica de cada chapola antes de su siembra definitiva en los lotes rodeados de colmenas.
            </p>
          </div>
          <div className="text-xs font-bold text-[#A16207] bg-white px-4 py-2.5 rounded-2xl border border-amber-200 shadow-2xs shrink-0">
            🌱 Variedades Geisha, Bourbon Rosado & Castillo
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white border-2 border-amber-100 overflow-hidden shadow-xs hover:border-[#FFD242] transition-all group">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/semillero-chapolas-cafe.jpg"
                alt="Germinación de chapolas de café en semillero"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1A0E05]/85 text-[#FFD242] text-[10px] font-black backdrop-blur-xs">
                Fase 1 • Germinación
              </span>
            </div>
            <div className="p-5 space-y-1.5">
              <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display">Semillero de Arena de Río</h4>
              <p className="text-xs text-[#5C381E] leading-relaxed">
                Selección de las semillas más densas. Brotan tras 45 días como "fósforos" y "chapolas" vigorosas.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border-2 border-amber-100 overflow-hidden shadow-xs hover:border-[#FFD242] transition-all group">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/vivero-almacigo-cafe.jpg"
                alt="Vivero y almácigo de plántulas de café"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-[10px] font-black shadow-xs">
                Fase 2 • Almácigo
              </span>
            </div>
            <div className="p-5 space-y-1.5">
              <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display">Nutrición & Sombra Regulada</h4>
              <p className="text-xs text-[#5C381E] leading-relaxed">
                Trasplante a bolsas individuales con compost de pulpa de café y micorrizas nativas bajo polisombra.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white border-2 border-amber-100 overflow-hidden shadow-xs hover:border-[#FFD242] transition-all group">
            <div className="relative aspect-4/3 overflow-hidden bg-amber-50">
              <img
                src="/images/vivero-raiz-plantula-cafe.jpg"
                alt="Inspección de raíz pivotante de plántula de café"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#1A0E05]/85 text-[#FFD242] text-[10px] font-black backdrop-blur-xs">
                Fase 3 • Raíz Fuerte
              </span>
            </div>
            <div className="p-5 space-y-1.5">
              <h4 className="font-extrabold text-[#2D1A0D] text-sm font-display">Vigor Radicular Óptimo</h4>
              <p className="text-xs text-[#5C381E] leading-relaxed">
                Inspección de raíz pivotante recta y libre de nematodos antes de la siembra en ladera.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cadena Productiva Completa: De la Siembra a la Taza */}
      <ProductionChainSection />

      {/* Call to Action Bar */}
      <div className="p-8 sm:p-12 rounded-[36px] bg-[#1A0E05] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border-2 border-[#FFD242]">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-2xl font-black font-display text-white">¿Quieres probar nuestro café co-creado con abejas?</h3>
          <p className="text-xs sm:text-sm text-amber-100/90">
            Descubre nuestras variedades en la tienda online o solicita una cotización institucional con precios al por mayor.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setActiveView('tienda')}
            className="px-6 py-3 rounded-xl bg-[#FFD242] text-[#2D1A0D] font-black text-xs hover:bg-[#ecc030] transition cursor-pointer shadow-md"
          >
            Comprar Café & Miel
          </button>
          <button
            onClick={() => setActiveView('cotizaciones')}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer border border-white/20"
          >
            Cotizar Mayorista
          </button>
        </div>
      </div>
    </div>
  );
};
