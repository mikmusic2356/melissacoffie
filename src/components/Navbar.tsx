import React, { useState } from 'react';
import {
  Coffee,
  ShoppingBag,
  Calendar,
  Layers,
  FileText,
  UserCheck,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  Info,
  PhoneCall,
  Hexagon,
  Instagram,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    cart,
    setIsCartOpen,
    bookings,
    quotes,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pendiente').length;

  const navLinks = [
    { id: 'inicio', label: 'Inicio', icon: Coffee },
    { id: 'tienda', label: 'Tienda & Miel', icon: ShoppingBag },
    { id: 'cotizaciones', label: 'Cotizaciones', icon: FileText, badge: 'Mayorista' },
    { id: 'eventos', label: 'Experiencias', icon: Calendar },
    { id: 'cafeteria', label: 'Cafetería', icon: Layers },
    { id: 'nosotros', label: 'Nuestra Finca', icon: Info },
    { id: 'contacto', label: 'Contacto', icon: PhoneCall },
  ];

  const handleNavClick = (viewId: any) => {
    setActiveView(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b-4 border-[#FFD242] transition-all">
      {/* Top Banner: Elegant Café & White warm tone */}
      <div className="bg-[#2D1A0D] text-amber-100 text-xs py-2 px-4 sm:px-6 border-b border-[#3E2714] shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#FFD242] text-[#2D1A0D] text-[10px] font-black shrink-0">
              🐝
            </span>
            <span className="font-bold text-amber-200 text-[11px] sm:text-xs">
              "Café co-creado con abejas"
            </span>
            <span className="hidden lg:inline text-amber-100/90 bg-[#3E2714] px-2.5 py-0.5 rounded-full font-bold text-[10px] border border-amber-900/40">
              Colmenas cerca al cultivo para un café superior
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Instagram Official Link */}
            <a
              href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3E2714] text-amber-200 hover:text-white hover:bg-[#4E321B] transition font-bold text-[11px] cursor-pointer shadow-2xs border border-amber-800/40"
              title="Instagram @meliferacoffee"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">@meliferacoffee</span>
              <span className="sm:hidden">IG</span>
            </a>

            <button
              onClick={() => handleNavClick('mis-reservas')}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] hover:bg-[#ecc030] transition font-black text-[11px] cursor-pointer shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#2D1A0D]" />
              <span>Consultar por Correo</span>
            </button>

            <span className="text-amber-700/60 hidden sm:inline">|</span>

            <button
              onClick={() => handleNavClick('admin')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3E2714] hover:bg-[#4E321B] text-amber-100 transition font-bold text-[11px] cursor-pointer border border-amber-800/40"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#FFD242]" />
              <span>Admin {pendingQuotesCount > 0 && `(${pendingQuotesCount})`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container with honeycomb motif */}
      <div className="bg-[#FFFDF7] bg-honeycomb-grid border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Brand Logo: Clean Logo Image + Slogan */}
            <button
              onClick={() => handleNavClick('inicio')}
              className="flex items-center gap-3.5 text-left group cursor-pointer shrink-0 py-1"
            >
              {/* Official Melifera Logo Image */}
              <div className="relative h-16 sm:h-20 w-auto flex items-center justify-center shrink-0">
                <img
                  src="/images/logo_melifera-removebg-preview.png"
                  alt="Melifera Coffee Logo"
                  className="h-full w-auto max-h-20 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <p className="text-xs sm:text-sm text-[#784A23] font-bold tracking-wide">
                  <span className="text-[#2D1A0D] font-black italic">"Café co-creado con abejas"</span>
                </p>
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-md bg-[#FFD242] text-[#2D1A0D] font-black uppercase tracking-wider shadow-2xs border border-[#ECC030] mt-0.5">
                  Panal & Café
                </span>
              </div>
            </button>

            {/* Desktop Nav Links - Spacious, uncrowded, perfectly aligned */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-3.5 py-2 rounded-xl text-xs tracking-wide font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'bg-[#FFD242] text-[#2D1A0D] shadow-sm font-black border border-[#ECC030]'
                        : 'text-[#3E2714] hover:bg-[#FFD242]/20 hover:text-[#2D1A0D]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase ${
                        isActive ? 'bg-[#2D1A0D] text-[#FFD242]' : 'bg-[#FFD242] text-[#2D1A0D]'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Quick Actions Right */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Wholesale CTA Button in Golden Honey #FFD242 */}
              <button
                onClick={() => handleNavClick('cotizaciones')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black text-[#2D1A0D] bg-[#FFD242] hover:bg-[#f0c330] transition-all shadow-xs hover:shadow-md cursor-pointer border border-[#ECC030]"
              >
                <span>Cotizar Mayor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Cart Button with Honey Yellow Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl text-[#2D1A0D] bg-[#FFD242]/20 hover:bg-[#FFD242] border border-[#FFD242]/60 transition-colors cursor-pointer"
                title="Ver Carrito de Compras"
              >
                <ShoppingBag className="w-5 h-5 text-[#2D1A0D]" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FFD242] text-[#2D1A0D] border-2 border-[#2D1A0D] text-[10px] font-black flex items-center justify-center shadow-xs">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-[#2D1A0D] bg-[#FFD242]/30 hover:bg-[#FFD242] transition cursor-pointer"
                aria-label="Abrir menú"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with Honeycomb Aesthetics */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-[#FFD242] bg-[#FFFDF7] px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition ${
                    isActive
                      ? 'bg-[#FFD242] text-[#2D1A0D] shadow-xs border border-[#ECC030]'
                      : 'text-[#3E2714] hover:bg-[#FFD242]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#2D1A0D]' : 'text-[#784A23]'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                      isActive ? 'bg-[#2D1A0D] text-[#FFD242]' : 'bg-[#FFD242] text-[#2D1A0D]'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-amber-200/80 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://www.instagram.com/meliferacoffee?igsi=aGNoY2swc2ptMHRl&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold text-xs shadow-xs"
              >
                <Instagram className="w-4 h-4" />
                <span>@meliferacoffee</span>
              </a>
              <a
                href="https://wa.me/573043785413"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-xs"
              >
                <span>WhatsApp</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('mis-reservas')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#2D1A0D] text-[#FFD242] font-black text-xs shadow-xs"
              >
                <UserCheck className="w-4 h-4 text-[#FFD242]" />
                <span>Con Cédula</span>
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FFD242] text-[#2D1A0D] font-black text-xs border border-[#ECC030]"
              >
                <ShieldAlert className="w-4 h-4 text-[#2D1A0D]" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
