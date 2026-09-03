import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: 'products' | 'events' | 'cafeteria' | 'general';
  label?: string;
  aspectHint?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  folder = 'general',
  label = 'Fotografía Oficial',
  aspectHint = 'Sube cualquier formato (PNG, JPG, WEBP, AVIF). Se comprimirá automáticamente a Cloudflare R2.',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStats, setUploadStats] = useState<{ originalKB: number; optimizedKB: number; ratio: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    setIsUploading(true);
    setUploadStats(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success && data.url) {
        onChange(data.url);
        setUploadStats({
          originalKB: data.originalSizeKB,
          optimizedKB: data.optimizedSizeKB,
          ratio: data.compressionRatio,
        });
      } else {
        alert(data.error || 'Error al subir la imagen a Cloudflare R2');
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert('Error de conexión al subir la imagen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#6F4E37]" />
          <span>{label}</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#6F4E37] hover:underline font-medium cursor-pointer"
        >
          {showUrlInput ? '« Usar subida directa R2' : 'Escribir URL manual »'}
        </button>
      </div>

      {showUrlInput ? (
        <div>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/... o /r2/..."
            className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
          />
        </div>
      ) : (
        <div className="space-y-2">
          {value ? (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
              <div className="aspect-16/9 w-full bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-100 transition cursor-pointer"
                  >
                    Cambiar Imagen
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="p-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-700 transition cursor-pointer"
                    title="Quitar imagen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {value.startsWith('/r2/') && (
                <div className="p-2.5 bg-emerald-50/80 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Almacenada en Cloudflare R2 (Ultra Rápida)
                  </span>
                  {uploadStats && (
                    <span className="font-mono font-medium text-emerald-700 text-[10px]">
                      {uploadStats.originalKB}KB ➔ {uploadStats.optimizedKB}KB ({uploadStats.ratio} ahorro)
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 ${
                dragOver
                  ? 'border-[#6F4E37] bg-amber-50/50'
                  : 'border-slate-200 hover:border-[#6F4E37]/50 hover:bg-slate-50/80 bg-white'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-2">
                  <Loader2 className="w-7 h-7 text-[#6F4E37] animate-spin" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">Comprimiendo y subiendo a Cloudflare R2...</p>
                    <p className="text-[10px] text-slate-500">Convirtiendo a formato WebP optimizado</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-[#6F4E37] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">
                      Haz clic para subir o arrastra tu imagen aquí
                    </p>
                    <p className="text-[10px] text-slate-500">{aspectHint}</p>
                  </div>
                </>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

