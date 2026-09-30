import React, { useState, useRef } from 'react';
import { Upload, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Hero: React.FC = () => {
  const { showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Looping Hero Video (Stored in public/videos/ and tracked in git)
  const HERO_VIDEO_URL = '/videos/hero-video-melifera.mp4';
  const FALLBACK_IMAGE = '/images/Honey_dipper_on_coffee_beans_202609022103.jpeg';

  // Custom hero media if user uploads their own media
  const [customMedia, setCustomMedia] = useState<{ url: string; type: 'video' | 'image' } | null>(() => {
    const saved = localStorage.getItem('melifera_custom_hero');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.url === 'string' && parsed.url.trim() !== '') {
          return parsed;
        }
      } catch {
        return null;
      }
    }
    return null;
  });

  const activeVideoUrl = customMedia?.type === 'video' ? customMedia.url : HERO_VIDEO_URL;

  // Ensure autoplay works reliably across all browsers (Chrome, Safari, Edge, Mobile)
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn("Autoplay blocked or waiting for user interaction:", err);
          // If unmuted playback failed, try muted
          if (!video.muted) {
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          }
        });
      }
    };

    playVideo();

    // In case the browser requires user interaction first, attempt play on first user gesture
    const handleFirstInteraction = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };
  }, [activeVideoUrl, isMuted]);

  const handleVideoError = () => {
    console.warn("Video failed to load:", activeVideoUrl);
    if (customMedia) {
      showToast('Error de Video', 'No se pudo reproducir el video personalizado. Restaurando video original.', 'warning');
      resetToDefault();
    }
  };

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

  return (
    <section 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative w-full overflow-hidden bg-[#180D05] text-white border-b-4 border-[#FFD242]"
    >
      {/* Full-bleed Hero Background: Looping Video */}
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
            key={activeVideoUrl}
            src={activeVideoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onError={handleVideoError}
            poster={FALLBACK_IMAGE}
            className="w-full h-full object-cover object-center scale-100 filter brightness-95 contrast-105 transition-all duration-700 pointer-events-none"
          />
        )}
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 pointer-events-none" />
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
            title="Restablecer al video original predeterminado"
            className="p-2 rounded-2xl bg-[#2D1A0D]/90 hover:bg-[#3E2714] text-amber-200 hover:text-white border border-[#FFD242]/40 text-xs shadow-xl cursor-pointer transition-all backdrop-blur-md"
          >
            ↺
          </button>
        )}
      </div>

      {/* Clean Hero Viewport Height */}
      <div className="relative w-full min-h-[360px] sm:min-h-[440px] md:min-h-[500px] lg:min-h-[560px] z-10" />
    </section>
  );
};

export default Hero;
