import React, { useState } from 'react';
import { Phone, MessageCircle, X, Clock, Instagram, ChevronRight, Sparkles, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { isCartOpen } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  const phoneDisplay = '304 378 5413';
  const whatsappUrlBase = 'https://wa.me/573043785413';
  const instagramUrl = 'https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr';

  const quickMessages = [
    {
      label: '🌱 Plántulas de Café',
      text: 'Hola Melissa, quisiera información y cotización de plántulas de café en almácigo.',
    },
    {
      label: '☕ Café Verde / Tostado',
      text: 'Hola Melissa, me interesa cotizar café verde para tostadores o café tostado de especialidad.',
    },
    {
      label: '🍯 Miel, Polen & Propóleo',
      text: 'Hola Melissa, quisiera adquirir miel virgen, polen y propóleo de Melifera coffee.',
    },
    {
      label: '🧭 Coffee Tour / Tour Abejas',
      text: 'Hola Melissa, quisiera agendar un Coffee Tour o el Tour de las Abejas en la finca.',
    },
    {
      label: '🔥 Fogatas / Cumpleaños',
      text: 'Hola Melissa, deseo reservar el servicio de fogatas o una decoración de cumpleaños.',
    },
  ];

  const handleOpenWhatsApp = (customText?: string) => {
    const text = customText || 'Hola Melissa, me comunico desde la web de Melifera coffee para solicitar información.';
    window.open(`${whatsappUrlBase}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  if (isCartOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Floating Popup Window */}
      {isOpen && (
        <div
          id="whatsapp-chat-box"
          className="mb-3 w-[340px] sm:w-[380px] bg-white rounded-3xl shadow-2xl border-2 border-[#25D366]/40 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200"
        >
          {/* Header */}
          <div className="bg-[#2D1A0D] text-white p-4 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-amber-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Cerrar ventana de WhatsApp"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD242] text-[#2D1A0D] flex items-center justify-center font-bold text-xl shadow-xs">
                  🐝
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#25D366] border-2 border-[#2D1A0D] rounded-full" />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#FFD242] font-display flex items-center gap-1.5">
                  <span>Melifera coffee</span>
                </h4>
                <p className="text-xs text-amber-100 font-semibold">
                  Atención directa: <strong className="text-white">Melissa Moreno</strong>
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#25D366] font-bold mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>En línea • Respuesta rápida</span>
                </div>
              </div>
            </div>
          </div>

          {/* Horario de Atención en popup */}
          <div className="bg-amber-50/90 border-b border-amber-200/80 p-3 text-xs text-[#2D1A0D] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#A16207]">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>Horarios de Atención:</span>
            </div>
            <p className="text-[11px] leading-tight text-slate-700">
              • <strong>Miércoles a viernes:</strong> 10:00 am – 6:00 pm<br />
              • <strong>Sábado, domingo y festivos:</strong> 10:00 am – 10:00 pm
            </p>
          </div>

          {/* Body with Chat Simulation & Options */}
          <div className="p-4 space-y-3 bg-[#FAF8F5] max-h-[340px] overflow-y-auto text-xs">
            {/* Message Bubble from Melissa */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-amber-100 text-slate-800 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-[#2D1A0D]">
                ¡Hola! Soy Melissa de Melifera coffee 🌿☕
              </p>
              <p className="text-[11px] text-slate-600">
                ¿En qué podemos ayudarte hoy? Selecciona una opción rápida o escribe directamente a nuestro WhatsApp:
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
                Consultas Frecuentes:
              </span>
              {quickMessages.map((msg, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenWhatsApp(msg.text)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 font-semibold text-xs transition flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <span className="truncate">{msg.label}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-1" />
                </button>
              ))}
            </div>

            {/* Instagram Link Inside Box */}
            <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-pink-600 hover:text-pink-700 font-bold transition"
              >
                <Instagram className="w-4 h-4" />
                <span>@meliferacoffee</span>
              </a>
              <span className="text-[10px] text-slate-400 font-medium">Síguenos en IG</span>
            </div>
          </div>

          {/* Footer Action Button */}
          <div className="p-3 bg-white border-t border-slate-100">
            <button
              onClick={() => handleOpenWhatsApp()}
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Abrir WhatsApp ({phoneDisplay})</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Triggers: Instagram + WhatsApp */}
      <div className="flex items-center gap-2.5">
        {/* Instagram Floating Icon */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 cursor-pointer"
          title="Seguir a @meliferacoffee en Instagram"
          aria-label="Abrir Instagram de Melifera coffee"
        >
          <Instagram className="w-5 h-5" />
        </a>

        {/* WhatsApp Floating Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-[#25D366] text-white font-extrabold text-xs shadow-xl hover:bg-[#20bd5a] hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer border-2 border-white"
          aria-label="Abrir chat de WhatsApp con Melifera coffee"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6 fill-current" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-300 rounded-full animate-ping" />
          </div>
          <div className="text-left hidden sm:block leading-tight">
            <span className="block text-[10px] text-emerald-100 font-bold uppercase tracking-wider">
              WhatsApp Oficial
            </span>
            <span className="block text-xs font-black">
              {phoneDisplay}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
