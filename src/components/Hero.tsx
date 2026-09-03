import React, { useState, useRef } from 'react';
import { ArrowRight, Sparkles, Coffee, Calendar, ShieldCheck, ShoppingBag, FileText, Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { setActiveView, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Exact uploaded file location requested by the user
  const DEFAULT_HERO = '/images/Honey_dipper_on_coffee_beans_202609022103.jpeg';
  const FALLBACK_HERO = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=85';
  
  // Primary image source initialized with uploaded file
  const [heroImage, setHeroImage] = useState<string>(() => {
    const saved = localStorage.getItem('melifera_hero_image');
    if (saved && (saved.startsWith('data:image/') || saved.includes('Honey_dipper_on_coffee_beans'))) {
      return saved;
    }
    return DEFAULT_HERO;
  });

  const [imageLoadedSuccessfully, setImageLoadedSuccessfully] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Formato Inválido', 'Por favor selecciona un archivo de imagen válido (JPEG, PNG, WebP).', 'warning');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setHeroImage(dataUrl);
        localStorage.setItem('melifera_hero_image', dataUrl);
        showToast('Portada Actualizada', 'La imagen de portada ha sido fijada con éxito.', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageError = () => {
    if (heroImage !== DEFAULT_HERO) {
      setHeroImage(DEFAULT_HERO);
    } else if (heroImage !== FALLBACK_HERO) {
      setHeroImage(FALLBACK_HERO);
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem('melifera_hero_image');
    setHeroImage(DEFAULT_HERO);
    showToast('Restablecido', 'Se restableció la imagen predeterminada de portada.', 'info');
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#180D05] text-white border-b-4 border-[#FFD242]">
      {/* Full-bleed Hero Background Cover Image showing honey dipper and roasted coffee beans */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Melífera Coffie - Portada Miel y Café"
          className="w-full h-full object-cover object-center scale-100 filter brightness-95 contrast-105 transition-all duration-700"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src !== DEFAULT_HERO) {
              target.src = DEFAULT_HERO;
            }
          }}
        />
        {/* Subtle, soft protective vignette so the photo is fully visible and vibrant while maintaining crisp text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#120701]/90 via-[#180D05]/50 to-[#180D05]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120701]/85 via-transparent to-black/30" />
      </div>

      {/* Background Honeycomb Geometric Grid */}
      <div className="absolute inset-0 bg-honeycomb-grid opacity-15 pointer-events-none z-1" />

      {/* Radiant Honey Glow Accents */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FFD242]/20 rounded-full blur-[120px] pointer-events-none z-1" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#D49E00]/25 rounded-full blur-[130px] pointer-events-none z-1" />

      {/* Raining / Floating Coffee Beans Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-1">
        {/* Coffee Bean Particle 1 */}
        <div className="absolute top-12 left-[15%] opacity-70 animate-float-slow">
          <div className="w-7 h-5 bg-[#3B2211] rounded-full rotate-45 border border-[#FFD242]/40 shadow-md flex items-center justify-center">
            <div className="w-full h-[1.5px] bg-[#180D05] rotate-12" />
          </div>
        </div>

        {/* Coffee Bean Particle 2 */}
        <div className="absolute top-28 left-[45%] opacity-60 animate-float-delayed">
          <div className="w-8 h-5.5 bg-[#4A2E18] rounded-full -rotate-12 border border-[#FFD242]/30 shadow-md flex items-center justify-center">
            <div className="w-full h-[1.5px] bg-[#180D05] -rotate-6" />
          </div>
        </div>

        {/* Coffee Bean Particle 3 */}
        <div className="absolute top-8 right-[25%] opacity-75 animate-float-slow">
          <div className="w-6 h-4 bg-[#3E2413] rounded-full rotate-60 border border-[#FFD242]/50 shadow-md flex items-center justify-center">
            <div className="w-full h-[1.5px] bg-[#180D05] rotate-30" />
          </div>
        </div>

        {/* Coffee Bean Particle 4 */}
        <div className="absolute bottom-16 left-[30%] opacity-50 animate-float-delayed">
          <div className="w-7 h-4.5 bg-[#331B0B] rounded-full -rotate-45 border border-[#FFD242]/30 shadow-md flex items-center justify-center">
            <div className="w-full h-[1.5px] bg-[#180D05] -rotate-25" />
          </div>
        </div>

        {/* Golden Honey Droplet 1 */}
        <div className="absolute top-20 right-[40%] opacity-80 animate-float-slow">
          <div className="w-3.5 h-5 bg-gradient-to-b from-[#FFD242] to-[#E5A500] rounded-b-full rounded-t-sm shadow-lg shadow-[#FFD242]/40" />
        </div>
        {/* Golden Honey Droplet 2 */}
        <div className="absolute top-44 left-[10%] opacity-70 animate-float-delayed">
          <div className="w-4 h-6 bg-gradient-to-b from-[#FFD242] to-[#E5A500] rounded-b-full rounded-t-sm shadow-lg shadow-[#FFD242]/40" />
        </div>
      </div>

      {/* Main Full-Width Horizontal Container */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Core Message & Direct Product Offering */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Phrase Badge in Honey Yellow - NO 'Slogan' word */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-lg shadow-[#FFD242]/20 border border-[#FFF0A0]">
              <span className="text-base select-none">🐝</span>
              <span className="font-black italic text-xs sm:text-sm tracking-tight text-[#2D1A0D]">
                "Café co-creado con abejas"
              </span>
            </div>

            {/* Main Headline with Prominent Yellow & Contrast */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.12] font-display">
                Café Co-Creado <br className="hidden sm:inline" />
                <span className="text-[#FFD242] drop-shadow-sm font-serif italic">
                  con Abejas Melíferas
                </span>
              </h1>
              
              {/* Core Brand Concept Description requested by user */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#2A1709]/90 border-2 border-[#FFD242]/70 text-left space-y-2.5 shadow-lg">
                <div className="flex items-center gap-2 text-[#FFD242] font-black text-xs uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#FFD242]" />
                  <span>El Concepto: ¿Por qué las colmenas mejoran nuestro café?</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                  Tener las <strong>colmenas directamente dentro y alrededor del cultivo</strong> transforma la calidad del grano: la polinización intensiva de nuestras abejas melíferas incrementa los azúcares naturales (grados Brix), reduce los frutos deformes y genera un café más denso, aromático y con mayor puntaje en taza (SCA 88+). Al mismo tiempo, cosechamos su miel virgen pura.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="flex items-center gap-1.5 text-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD242]" />
                    <span>Granos +18% más densos y uniformes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD242]" />
                    <span>Notas florales a jazmín y miel silvestre</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The 2 Pillars Explicitly Stating What We Sell */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
              {/* Pillar 1: Pure Honey */}
              <div 
                onClick={() => setActiveView('tienda')}
                className="p-4 rounded-2xl bg-[#281508]/90 border-2 border-[#FFD242] hover:bg-[#341B0A] transition-all cursor-pointer shadow-md group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-110 transition-transform">
                    🍯
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FFD242] tracking-wider block">
                      Producto 01
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#FFD242] transition-colors">
                      Miel Virgen de Cafeto
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-amber-100/80 leading-snug">
                  100% pura, sin pasteurizar, recolectada en época de floración del café. Notas a jazmín y frutos dorados.
                </p>
              </div>

              {/* Pillar 2: Specialty Coffee */}
              <div 
                onClick={() => setActiveView('tienda')}
                className="p-4 rounded-2xl bg-[#281508]/90 border-2 border-[#FFD242]/70 hover:border-[#FFD242] hover:bg-[#341B0A] transition-all cursor-pointer shadow-md group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-black text-lg shadow-xs group-hover:scale-110 transition-transform">
                    ☕
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#FFD242] tracking-wider block">
                      Producto 02
                    </span>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#FFD242] transition-colors">
                      Café de Especialidad
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-amber-100/80 leading-snug">
                  Variedades Geisha, Bourbon y Tabi con puntajes SCA mayores a 88. Tueste medio artesanal en grano o molido.
                </p>
              </div>
            </div>

            {/* Call to Actions with High Visibility Yellow Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => setActiveView('tienda')}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-[#FFD242] hover:bg-[#ffca2b] text-[#2D1A0D] font-black text-xs sm:text-sm shadow-lg shadow-[#FFD242]/30 flex items-center gap-2 cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 border border-[#FFF0A0]"
              >
                <ShoppingBag className="w-4 h-4 text-[#2D1A0D]" />
                <span>Ver Tienda (Miel & Café)</span>
                <ArrowRight className="w-4 h-4 text-[#2D1A0D]" />
              </button>

              <button
                onClick={() => setActiveView('cotizaciones')}
                className="px-5 sm:px-6 py-3.5 rounded-xl bg-[#2D1A0D] hover:bg-[#3D2211] text-[#FFD242] font-black text-xs sm:text-sm border-2 border-[#FFD242] shadow-sm flex items-center gap-2 cursor-pointer transition-all duration-200"
              >
                <FileText className="w-4 h-4 text-[#FFD242]" />
                <span>Cotizar al por Mayor</span>
              </button>

              <button
                onClick={() => setActiveView('eventos')}
                className="px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/20 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5 text-[#FFD242]" />
                <span>Agendar Cata</span>
              </button>
            </div>
          </div>

          {/* Right Column: Panoramic Visual Composition (Bee, Dripping Honey over Coffee Beans, Honeycomb) */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative w-full max-w-xl mx-auto">
              
              {/* Golden Ambient Backdrop Aura */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#FFD242]/40 via-[#FFD242]/20 to-[#FFD242]/40 rounded-[36px] blur-xl" />

              {/* Main Composite Card */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative rounded-[32px] overflow-hidden border-2 transition-all ${
                  isDragging ? 'border-amber-300 ring-4 ring-[#FFD242]/50 scale-[1.01]' : 'border-[#FFD242]'
                } bg-[#221206] shadow-2xl`}
              >
                
                {/* Horizontal Panoramic Image: Honey Dripping Over Fresh Roasted Coffee Beans */}
                <div className="relative aspect-16/10 sm:aspect-16/9 w-full overflow-hidden bg-black">
                  <img
                    id="hero-cover-image"
                    src={heroImage}
                    alt="Miel dorada pura vertida sobre granos de café tostados y panal con abeja melífera"
                    className="w-full h-full object-cover opacity-95 hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    onLoad={() => setImageLoadedSuccessfully(true)}
                  />
                  
                  {/* Drag and Drop Active Overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-[#1A0D05]/80 backdrop-blur-sm border-2 border-dashed border-[#FFD242] flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in duration-200">
                      <Upload className="w-12 h-12 text-[#FFD242] animate-bounce mb-2" />
                      <p className="text-white font-black text-sm">Suelta tu imagen aquí</p>
                      <p className="text-xs text-amber-200/80 mt-1">Se convertirá inmediatamente en la nueva portada hero</p>
                    </div>
                  )}

                  {/* Subtle Coffee and Honey overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A0D05] via-transparent to-[#1A0D05]/30 pointer-events-none" />

                  {/* Top Left Floating Tag */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#2D1A0D]/90 backdrop-blur-md border border-[#FFD242] text-[#FFD242] text-xs font-black shadow-lg">
                    <span className="text-sm">🐝</span>
                    <span>Apis Mellifera & Flor de Cafeto</span>
                  </div>

                  {/* Top Right Quick Upload / Change Cover Pill */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
                      accept="image/*" 
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Cambiar o subir imagen de portada"
                      className="px-2.5 py-1.5 rounded-xl bg-[#2D1A0D]/90 hover:bg-[#3E2714] text-[#FFD242] border border-[#FFD242]/60 hover:border-[#FFD242] text-[11px] font-extrabold flex items-center gap-1.5 shadow-lg cursor-pointer transition-all backdrop-blur-md"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Cambiar Portada</span>
                    </button>
                    {heroImage !== DEFAULT_HERO && (
                      <button
                        type="button"
                        onClick={resetToDefault}
                        title="Restablecer a imagen predeterminada"
                        className="p-1.5 rounded-xl bg-[#2D1A0D]/90 hover:bg-[#3E2714] text-amber-200/80 hover:text-white border border-[#FFD242]/40 text-xs shadow-lg cursor-pointer transition-all backdrop-blur-md"
                      >
                        ↺
                      </button>
                    )}
                  </div>

                  {/* Bottom Center Visual Caption: Explaining the two products */}
                  <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-[#1A0E05]/95 backdrop-blur-md border border-[#FFD242]/60 text-white shadow-xl pointer-events-none">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFD242] animate-ping" />
                        <span className="text-xs font-black text-[#FFD242] uppercase tracking-wider">
                          Portada Oficial Melífera Coffie
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-200/80 bg-[#FFD242]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#FFD242]" />
                        Miel Pura & Café
                      </span>
                    </div>
                    <p className="text-xs text-stone-200 mt-1.5 leading-snug font-medium">
                      Miel virgen recién vertida sobre granos de café tostados artesanalmente, junto al panal de abejas obreras polinizadoras.
                    </p>
                  </div>
                </div>

                {/* Sub-strip with 3 Hexagonal Mini-Features */}
                <div className="p-4 sm:p-5 bg-[#251307] border-t-2 border-[#FFD242]/50 grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  
                  {/* Mini-card 1 */}
                  <div className="p-2.5 rounded-xl bg-[#190C04] border border-[#FFD242]/30 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center text-sm font-black mb-1">
                      🍯
                    </div>
                    <span className="text-[11px] font-extrabold text-white">Miel Cruda</span>
                    <span className="text-[9px] text-[#FFD242] font-semibold">Sin aditivos</span>
                  </div>

                  {/* Mini-card 2 */}
                  <div className="p-2.5 rounded-xl bg-[#190C04] border border-[#FFD242]/30 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center text-sm font-black mb-1">
                      ☕
                    </div>
                    <span className="text-[11px] font-extrabold text-white">Café SCA 88+</span>
                    <span className="text-[9px] text-[#FFD242] font-semibold">Tostado fresco</span>
                  </div>

                  {/* Mini-card 3 */}
                  <div className="p-2.5 rounded-xl bg-[#190C04] border border-[#FFD242]/30 flex flex-col items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center text-sm font-black mb-1">
                      🐝
                    </div>
                    <span className="text-[11px] font-extrabold text-white">Apiarios</span>
                    <span className="text-[9px] text-[#FFD242] font-semibold">Sostenibles</span>
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Horizontal Proof Bar in Honey Yellow & Coffee */}
        <div className="mt-12 pt-8 border-t border-[#FFD242]/30 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-[#231206]/80 border border-[#FFD242]/40">
            <span className="text-2xl sm:text-3xl font-black text-[#FFD242] font-display">100% Virgen</span>
            <p className="text-xs text-amber-100 font-bold mt-1">Miel de Flor de Café</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#231206]/80 border border-[#FFD242]/40">
            <span className="text-2xl sm:text-3xl font-black text-[#FFD242] font-display">1.850 m</span>
            <p className="text-xs text-amber-100 font-bold mt-1">Cafetales de Altura</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#231206]/80 border border-[#FFD242]/40">
            <span className="text-2xl sm:text-3xl font-black text-[#FFD242] font-display">SCA 88.5</span>
            <p className="text-xs text-amber-100 font-bold mt-1">Calidad Especial</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#231206]/80 border border-[#FFD242]/40">
            <span className="text-2xl sm:text-3xl font-black text-[#FFD242] font-display">Nacional</span>
            <p className="text-xs text-amber-100 font-bold mt-1">Envíos a Toda Colombia</p>
          </div>
        </div>

      </div>
    </section>
  );
};
