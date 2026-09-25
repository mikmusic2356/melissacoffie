import React, { useState, useRef } from 'react';
import { Upload, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Cloudflare R2 Video URL (streamed through server proxy)
  const CLOUDFLARE_VIDEO_URL = '/r2/videos/WhatsApp%20Video%202026-09-23%20at%2021.23.34.mp4';
  const FALLBACK_IMAGE = '/images/Honey_dipper_on_coffee_beans_202609022103.jpeg';

  // Custom hero media if user uploads their own media
  const [customMedia, setCustomMedia] = useState<{ url: string; type: 'video' | 'image' } | null>(() => {
    const saved = localStorage.getItem('melifera_custom_hero');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const handleFile = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      showToast('Formato Inválido', 'Por favor selecciona un archivo de video (MP4, WebM) o imagen válido.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const mediaObj = { url: dataUrl, type: (isVideo ? 'video' : 'image') as 'video' | 'image' };
        setCustomMedia(mediaObj);
        localStorage.setItem('melifera_custom_hero', JSON.stringify(mediaObj));
        showToast('Portada Actualizada', isVideo ? 'El video de portada ha sido cargado con éxito.' : 'La imagen de portada ha sido fijada con éxito.', 'success');
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

  const resetToDefault = () => {
    localStorage.removeItem('melifera_custom_hero');
    localStorage.removeItem('melifera_hero_image');
    setCustomMedia(null);
    showToast('Restablecido', 'Se restableció el video original en bucle de portada.', 'info');
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const heroStats = [
    {
      title: '100% Virgen',
      subtitle: 'Miel de Flor de Café',
    },
    {
      title: '1.650 m',
      subtitle: 'Cafetales de Altura',
    },
    {
      title: 'SCA 88.5',
      subtitle: 'Calidad Especial',
    },
    {
      title: 'Nacional',
      subtitle: 'Envíos a Toda Colombia',
    },
  ];

  return (
    <section 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full overflow-hidden bg-[#180D05] text-white border-b-4 border-[#FFD242]"
    >
      {/* Full-bleed Hero Background: Cloudflare R2 Video in Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {customMedia?.type === 'image' ? (
          <img
            src={customMedia.url}
            alt="Melífera Coffie - Portada Personalizada"
            className="w-full h-full object-cover object-center scale-100 filter brightness-95 contrast-105 transition-all duration-700"
          />
        ) : (
          <video
            ref={videoRef}
            src={customMedia ? customMedia.url : CLOUDFLARE_VIDEO_URL}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster={FALLBACK_IMAGE}
            className="w-full h-full object-cover object-center scale-100 filter brightness-95 contrast-105 transition-all duration-700"
          />
        )}
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 pointer-events-none" />
      </div>

      {/* Drag and Drop Active Overlay on entire Hero */}
      {isDragging && (
        <div className="absolute inset-0 bg-[#1A0D05]/80 backdrop-blur-sm border-4 border-dashed border-[#FFD242] flex flex-col items-center justify-center p-6 text-center z-30 animate-in fade-in duration-200">
          <Upload className="w-16 h-16 text-[#FFD242] animate-bounce mb-3" />
          <p className="text-white font-black text-lg">Suelta tu video o imagen aquí</p>
          <p className="text-xs text-amber-200/90 mt-1">Se convertirá inmediatamente en la nueva portada hero</p>
        </div>
      )}

      {/* Top Right Quick Upload / Audio Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-20">
        {(!customMedia || customMedia.type === 'video') && (
          <button
            type="button"
            onClick={toggleMute}
            title={isMuted ? "Activar audio" : "Silenciar audio"}
            className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-[#2D1A0D]/90 hover:bg-[#3E2714] text-[#FFD242] border border-[#FFD242]/60 hover:border-[#FFD242] text-xs font-black flex items-center gap-1.5 shadow-xl cursor-pointer transition-all backdrop-blur-md"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isMuted ? 'Sin sonido' : 'Sonido activo'}</span>
          </button>
        )}

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} 
          accept="video/*,image/*" 
          className="hidden" 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Cambiar o subir video/imagen de portada"
          className="px-3.5 py-2 rounded-2xl bg-[#2D1A0D]/90 hover:bg-[#3E2714] text-[#FFD242] border border-[#FFD242]/60 hover:border-[#FFD242] text-xs font-black flex items-center gap-1.5 shadow-xl cursor-pointer transition-all backdrop-blur-md"
        >
          <Upload className="w-4 h-4" />
          <span>Cambiar Portada</span>
        </button>
        
        {customMedia && (
          <button
            type="button"
            onClick={resetToDefault}
            title="Restablecer al video de Cloudflare predeterminado"
            className="p-2 rounded-2xl bg-[#2D1A0D]/90 hover:bg-[#3E2714] text-amber-200 hover:text-white border border-[#FFD242]/40 text-xs shadow-xl cursor-pointer transition-all backdrop-blur-md"
          >
            ↺
          </button>
        )}
      </div>

      {/* Hero Content Area with Stat Badges / Cards */}
      <div className="relative w-full min-h-[380px] sm:min-h-[460px] md:min-h-[520px] lg:min-h-[580px] z-10 flex flex-col justify-end px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8 pt-20">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {heroStats.map((stat, idx) => (
              <div 
                key={idx}
                className="bg-[#1C1008]/85 backdrop-blur-md border border-[#FFD242]/40 hover:border-[#FFD242] transition-all duration-300 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 text-center shadow-2xl flex flex-col items-center justify-center group"
              >
                <div className="text-lg sm:text-xl md:text-2xl font-black text-[#FFD242] tracking-tight group-hover:scale-105 transition-transform duration-200">
                  {stat.title}
                </div>
                <div className="text-[11px] sm:text-xs md:text-sm font-medium text-amber-100/90 mt-0.5 sm:mt-1 tracking-wide">
                  {stat.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
