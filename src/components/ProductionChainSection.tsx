import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sprout,
  Sun,
  Sparkles,
  Layers,
  Flame,
  Coffee,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Compass,
  Calendar,
  Phone,
  MessageCircle,
  Clock
} from 'lucide-react';

interface ChainStep {
  id: string;
  number: string;
  title: string;
  shortTitle: string;
  category: 'Siembra & Campo' | 'Apicultura & Polen' | 'Procesamiento' | 'Tueste & Preparación' | 'Cafetería & Taza';
  description: string;
  details: string[];
  productOrServiceLink?: {
    type: 'tienda' | 'eventos' | 'cotizaciones' | 'cafeteria';
    label: string;
  };
  imageUrl: string;
  badge: string;
}

export const ProductionChainSection: React.FC = () => {
  const { setActiveView } = useApp();
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const chainSteps: ChainStep[] = [
    {
      id: 'semillero-vivero',
      number: '01',
      title: 'Semillero, Germinación & Plántulas de Café en Almácigo',
      shortTitle: 'Semillero & Plántulas',
      category: 'Siembra & Campo',
      badge: 'Genética Certificada',
      description:
        'Todo comienza seleccionando semillas de variedades superiores: Geisha, Bourbon Rosado y Castillo. Cuidamos cada chapola en camas de arena y las trasplantamos a bolsas de almácigo enriquecidas con micorrizas y compost de pulpa de café. Producimos y comercializamos plántulas vigorosas listas para siembra en finca.',
      details: [
        'Semillas madre seleccionadas por vigor genético y taza',
        'Sustrato orgánico inoculado con micorrizas para un sistema radicular pivotante fuerte',
        'Venta de plántulas de café por lote o unidad para caficultores y proyectos agroecológicos',
      ],
      productOrServiceLink: {
        type: 'tienda',
        label: 'Ver Plántulas de Café en Tienda',
      },
      imageUrl: '/images/vivero-almacigo-cafe.jpg',
    },
    {
      id: 'siembra-suelos',
      number: '02',
      title: 'Siembra en Alta Montaña a 1.850 msnm & Agroforestería',
      shortTitle: 'Siembra & Cultivo',
      category: 'Siembra & Campo',
      badge: 'Agricultura Regenerativa',
      description:
        'Establecemos nuestros cafetales bajo sombrío diverso de guamos, plátano y árboles nativos de la Cordillera Central. La altura de 1.850 msnm permite una maduración lenta de la cereza que concentra mayores azúcares y complejidad ácida.',
      details: [
        'Lotes protegidos con cobertura viva y microbiología de montaña',
        'Fertilización orgánica basada en el compostaje de pulpa de café y biofertilizantes',
        'Trazabilidad geográfica y climática estricta en cada lote de la finca',
      ],
      productOrServiceLink: {
        type: 'eventos',
        label: 'Conocer en Coffee Tour',
      },
      imageUrl: '/images/finca-paisaje-cafetal.jpg',
    },
    {
      id: 'polinizacion-abejas',
      number: '03',
      title: 'Polinización con Abejas Melíferas & Productos de la Colmena',
      shortTitle: 'Polinización Melífera',
      category: 'Apicultura & Polen',
      badge: 'Simbiosis Única',
      description:
        'Integramos colmenas de abejas melíferas directamente entre los cafetales. Durante la floración blanca del cafeto, millones de abejas realizan polinización cruzada: esto incrementa el cuaje de los frutos, la densidad del grano y su dulzor en taza, al tiempo que cosechamos miel virgen pura, polen fresco y propóleo medicinal.',
      details: [
        'Polinización natural que eleva el tamaño, uniformidad y concentración de fructosa en el grano',
        'Cosecha de Miel virgen monovarietal de flor de café sin pasteurizar ni aditivos',
        'Obtención de polen silvestre y propóleo de colmenas libres de pesticidas',
      ],
      productOrServiceLink: {
        type: 'tienda',
        label: 'Comprar Miel, Polen & Propóleo',
      },
      imageUrl: '/images/apicultor-cosecha-miel.jpg',
    },
    {
      id: 'cosecha-selectiva',
      number: '04',
      title: 'Recolección Selectiva Manual Grano a Grano',
      shortTitle: 'Cosecha Selectiva',
      category: 'Siembra & Campo',
      badge: 'Grado Brix Óptimo',
      description:
        'Nuestras recolectoras expertas recorren los surcos cosechando exclusivamente cerezas en el punto máximo de maduración (color rojo vino o amarillo dorado). Evitamos frutos verdes o sobremaduros para garantizar una taza limpia y sin astringencia.',
      details: [
        'Medición en campo de grados Brix (azúcares) antes de la recolección',
        'Recolección manual respetuosa con las ramas productivas del cafeto',
        'Separación en tolva por flotación de impurezas y granos vanos',
      ],
      productOrServiceLink: {
        type: 'eventos',
        label: 'Vivir la Recolección en el Tour',
      },
      imageUrl: '/images/cosecha-cerezas-cafe.jpg',
    },
    {
      id: 'beneficio-fermentacion',
      number: '05',
      title: 'Beneficio Ecológico & Fermentaciones Controladas',
      shortTitle: 'Beneficio & Fermentación',
      category: 'Procesamiento',
      badge: 'Microbiología & Control',
      description:
        'Despulpamos en seco reduciendo al mínimo el uso de agua. Realizamos fermentaciones controladas (Lavado fermentado, Honey reteniendo mucílago rico en azúcares y Naturales en cereza entera) en recipientes sellados con válvulas de escape para destacar notas florales y frutales.',
      details: [
        'Beneficiadero ecológico con ahorro del 95% de agua frente a métodos tradicionales',
        'Procesos Honey (mieloso) que transfieren el dulzor del mucílago directamente al grano',
        'Monitoreo continuo de temperatura, pH y tiempo de fermentación',
      ],
      imageUrl: '/images/cerezas-cafe-maduras.jpg',
    },
    {
      id: 'secado-solar',
      number: '06',
      title: 'Secado Lento en Marquesina Solar & Camas Africanas',
      shortTitle: 'Secado Solar',
      category: 'Procesamiento',
      badge: 'Humedad 10.5% - 11.5%',
      description:
        'El café se distribuye en capas delgadas sobre camas africanas elevadas dentro de marquesinas solares protegidas del rocío andino. Se rastrilla cuidadosamente varias veces al día para un secado uniforme y una conservación impecable de los embriones del grano.',
      details: [
        'Ventilación cruzada constante para prevenir fermentaciones secundarias',
        'Control higrométrico riguroso hasta alcanzar el estándar internacional de exportación',
        'Reposo en pergamino en bodega aclimatada para fijar el perfil sensorial',
      ],
      imageUrl: '/images/semillero-chapolas-cafe.jpg',
    },
    {
      id: 'cafe-verde-tostadores',
      number: '07',
      title: 'Trilla & Café Verde en Grano para Tostadores',
      shortTitle: 'Café Verde para Tostadores',
      category: 'Procesamiento',
      badge: 'Materia Prima de Especialidad',
      description:
        'Trillamos el pergamino retirando la cascarilla y clasificamos mecánicamente por malla y por densidad. Ofrecemos café verde en almendra seleccionado para tostadurías artesanales, escuelas de café y amantes del tueste casero en empaque hermético GrainPro.',
      details: [
        'Clasificación por densidad y selección de almendras libres de broca o defectos primarios',
        'Sacos de 60 kg para tostadurías y presentaciones de café verde en saco hermético',
        'Ficha técnica con curva de beneficio, variedad y puntaje de cata SCA',
      ],
      productOrServiceLink: {
        type: 'cotizaciones',
        label: 'Cotizar Café Verde al por Mayor',
      },
      imageUrl: '/images/producto-cafe-especialidad.jpg',
    },
    {
      id: 'tostion-especialidad',
      number: '08',
      title: 'Tostión Artesanal de Especialidad en la Finca',
      shortTitle: 'Tostión Artesanal',
      category: 'Tueste & Preparación',
      badge: 'Perfil de Tueste Medio',
      description:
        'En nuestra propia sala de tostión aplicamos curvas térmicas diseñadas para cada microlote. Desarrollamos la caramelización de los azúcares naturales aportados por la floración y las abejas sin quemar los aceites aromáticos.',
      details: [
        'Tueste en pequeños baches (microlotes) para asegurar frescura absoluta',
        'Tueste medio que resalta notas a miel, jazmín, caña de azúcar y chocolate de origen',
        'Empaque con válvula desgasificadora unidireccional para preservar aroma y frescura',
      ],
      productOrServiceLink: {
        type: 'tienda',
        label: 'Comprar Café Tostado en Tienda',
      },
      imageUrl: '/images/granos-cafe-tostado-fresco.jpg',
    },
    {
      id: 'metodos-filtrado',
      number: '09',
      title: 'Capacitación en Métodos de Filtrado (V60, Chemex, AeroPress)',
      shortTitle: 'Capacitaciones & Filtrados',
      category: 'Tueste & Preparación',
      badge: 'Educación & Barismo',
      description:
        'Enseñamos a baristas, estudiantes y entusiastas la ciencia del vertido manual. Dominarás el tamaño de molienda micrométrica, la temperatura del agua de vertido, los ratios de café/agua y la turbulencia para extraer cada nota sensorial.',
      details: [
        'V60: Claridad cristalina, acidez brillante y notas florales delicadas',
        'Chemex: Cuerpo limpio y sedoso gracias a su filtro triple espesor',
        'AeroPress: Inmersión y presión suave que otorga cuerpo denso y dulzor acaramelado',
      ],
      productOrServiceLink: {
        type: 'eventos',
        label: 'Inscribirme en Capacitación',
      },
      imageUrl: '/images/cata-cafe-miel-taza.jpg',
    },
    {
      id: 'cafeteria-taza',
      number: '10',
      title: 'La Taza en Nuestra Cafetería: Coffee Tours, Tours de Abejas & Fogatas',
      shortTitle: 'La Taza & Experiencias',
      category: 'Cafetería & Taza',
      badge: 'De la Siembra a la Taza',
      description:
        'La cadena culmina en nuestra cafetería mirador: una taza perfecta preparada frente a la cordillera. Aquí disfrutas bebidas de café, maridajes con miel y repostería artesanal, además de vivir nuestros Coffee Tours, Tours de Abejas, veladas de Fogatas y celebraciones de cumpleaños.',
      details: [
        'Bebidas de especialidad: Espresso, Cappuccino Melífera con miel, Cold Brew y filtrados',
        'Espacio campestre con terraza panorámica, fogatas al atardecer y kiosko para cumpleaños',
        'Coffee tours y tours apícolas guiados por agrónomos y maestros apicultores',
      ],
      productOrServiceLink: {
        type: 'cafeteria',
        label: 'Ver Menú de Cafetería & Horarios',
      },
      imageUrl: '/images/finca-paisaje-cafetal.jpg',
    },
  ];

  const currentStep = chainSteps[activeStepIndex];

  return (
    <section id="cadena-productiva" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="rounded-[40px] bg-gradient-to-b from-[#2D1A0D] to-[#1F1209] text-white p-8 sm:p-14 shadow-2xl border-2 border-[#FFD242]/30 relative overflow-hidden space-y-10">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD242]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black tracking-wide uppercase shadow-xs">
            <span>🌱 De la Siembra a la Taza ☕</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black font-display leading-tight tracking-tight text-white">
            Toda Nuestra Cadena Productiva en <span className="text-[#FFD242] font-serif italic">Melifera coffee</span>
          </h2>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Conoce paso a paso cómo cuidamos cada etapa: desde la crianza de plántulas en el vivero, la simbiosis con nuestras abejas y la cosecha selectiva, hasta la tostión artesanal, las capacitaciones en métodos de filtrado y la taza servida en nuestra cafetería mirador.
          </p>
        </div>

        {/* Step Selector Pills / Timeline Bar */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-amber-700">
            {chainSteps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStepIndex(idx)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-[#FFD242] text-[#2D1A0D] border-[#FFD242] shadow-lg scale-105'
                      : 'bg-white/10 text-amber-100 hover:bg-white/20 border-white/10'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isSelected ? 'bg-[#2D1A0D] text-[#FFD242]' : 'bg-amber-400/30 text-amber-200'
                  }`}>
                    {idx + 1}
                  </span>
                  <span>{step.shortTitle}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Step Showcase Card */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#3D2513]/70 p-6 sm:p-10 rounded-[32px] border border-[#FFD242]/30 shadow-inner">
          {/* Left Column: Information and Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-black text-[#FFD242] font-display">
                Paso {currentStep.number} / 10
              </span>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/10 text-amber-200 border border-white/15">
                {currentStep.category}
              </span>
              <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#FFD242]/20 text-[#FFD242] border border-[#FFD242]/40">
                {currentStep.badge}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white font-display leading-snug">
              {currentStep.title}
            </h3>

            <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
              {currentStep.description}
            </p>

            {/* Checklist of highlights */}
            <div className="space-y-2.5 pt-2">
              {currentStep.details.map((detail, dIdx) => (
                <div key={dIdx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#FFD242] shrink-0 mt-0.5" />
                  <span>{detail}</span>
                </div>
              ))}
            </div>

            {/* Action buttons & Next/Prev Navigation */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              {currentStep.productOrServiceLink && (
                <button
                  onClick={() => setActiveView(currentStep.productOrServiceLink!.type)}
                  className="px-5 py-2.5 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-xs hover:bg-[#ecc030] transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>{currentStep.productOrServiceLink.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              <a
                href="https://wa.me/573043785413?text=Hola%20Melissa,%20quisiera%20consultar%20sobre%20la%20etapa%20de:%20"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consultar por WhatsApp</span>
              </a>

              <div className="ml-auto flex items-center gap-2">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  disabled={activeStepIndex === chainSteps.length - 1}
                  onClick={() => setActiveStepIndex((prev) => Math.min(chainSteps.length - 1, prev + 1))}
                  className="px-3.5 py-2 rounded-xl bg-[#FFD242] text-[#2D1A0D] hover:bg-[#ecc030] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High Quality Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-[28px] overflow-hidden border-2 border-[#FFD242]/40 shadow-2xl aspect-4/3 sm:aspect-square bg-[#2D1A0D]">
              <img
                src={currentStep.imageUrl}
                alt={currentStep.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2D1A0D] via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-xs">
                <span className="text-[#FFD242] font-black block">Finca Melifera coffee</span>
                <span className="text-white text-[11px] font-medium">{currentStep.shortTitle} • 1.850 msnm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fast Overview Grid of All 10 Steps */}
        <div className="relative z-10 pt-4 border-t border-white/10">
          <h4 className="text-sm font-bold text-amber-200 uppercase tracking-wider mb-4">
            Resumen visual del recorrido productivo:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {chainSteps.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-3 rounded-2xl text-left border transition cursor-pointer ${
                  activeStepIndex === idx
                    ? 'bg-[#FFD242] text-[#2D1A0D] border-[#FFD242] font-extrabold shadow-sm'
                    : 'bg-white/5 hover:bg-white/10 text-amber-100/90 border-white/10'
                }`}
              >
                <div className="text-[10px] font-black opacity-75">{step.number}</div>
                <div className="font-bold truncate mt-0.5">{step.shortTitle}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
