import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Calculator,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Package,
  Truck,
  Layers,
  Sparkles,
  ArrowRight,
  Send,
} from 'lucide-react';
import { Product } from '../types';

export const WholesaleView: React.FC = () => {
  const { products, createQuoteRequest, lastConsultedEmail, lastConsultedCedula } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(50);
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'quarterly'>('monthly');
  const [customPackaging, setCustomPackaging] = useState<boolean>(true);
  
  // Default target date 15 days ahead
  const defaultTargetDate = () => {
    const d = new Date(Date.now() + 15 * 86400000);
    return d.toISOString().split('T')[0];
  };
  const [targetDate, setTargetDate] = useState<string>(defaultTargetDate());
  const [comments, setComments] = useState<string>('');

  // Contact form
  const [customerName, setCustomerName] = useState<string>('');
  const [customerDocument, setCustomerDocument] = useState<string>(lastConsultedCedula || '');
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>(lastConsultedEmail || '');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string>('');

  const currentProd: Product = products.find((p) => p.id === selectedProductId) || products[0];

  const calculateDiscount = (qty: number, basePrice: number, floorPrice: number) => {
    let discountPct = 0.15;
    if (qty >= 100) discountPct = 0.38;
    else if (qty >= 50) discountPct = 0.30;
    else if (qty >= 25) discountPct = 0.20;

    const unit = Math.max(floorPrice, Math.round(basePrice * (1 - discountPct)));
    return {
      unitPrice: unit,
      discountPct: Math.round(((basePrice - unit) / basePrice) * 100),
      total: unit * qty,
    };
  };

  const quoteCalculations = calculateDiscount(
    quantity,
    currentProd?.priceUnit || 35000,
    currentProd?.wholesalePriceMin || 22000
  );

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProd) return;

    const quote = createQuoteRequest({
      customerName: customerName.trim(),
      customerDocument: customerDocument.trim() || undefined,
      companyName: companyName.trim() || 'Cliente Mayorista',
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      city: city.trim(),
      productId: currentProd.id,
      productName: currentProd.name,
      requestedQuantity: quantity,
      frequency,
      customPackagingNeeded: customPackaging,
      targetDate,
      comments: comments.trim(),
      estimatedUnitPrice: quoteCalculations.unitPrice,
      estimatedTotal: quoteCalculations.total,
    });

    setSubmittedQuoteId(quote.id);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Top Hero Banner */}
      <div className="rounded-[32px] bg-[#0F172A] text-white p-8 sm:p-14 shadow-xl relative overflow-hidden border border-[#FFD242]/20">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#FFD242]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2D1A0D]" />
            <span>Canal B2B, Horeca & Distribuidores</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display leading-tight tracking-tight text-[#FFD242]">
            Café y Miel de Origen al por Mayor
          </h1>
          <p className="text-slate-200 text-base leading-relaxed">
            Abastecemos a las mejores cafeterías de especialidad, restaurantes de alta cocina, hoteles boutique y tiendas gourmet de Colombia y el exterior con café de finca trazable y miel pura certificada.
          </p>
        </div>
      </div>

      {/* 3 Pillar Benefits with Official Photos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-[32px] bg-white border-2 border-amber-100 shadow-sm overflow-hidden flex flex-col hover:border-[#FFD242] transition-all group">
          <div className="relative aspect-16/10 overflow-hidden bg-amber-50">
            <img
              src="/images/granos-cafe-tostado-fresco.jpg"
              alt="Tostión artesanal a la medida"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-xs text-[#6F4E37] flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
            <h3 className="font-bold text-slate-900 text-base font-display">Perfiles de Tostión a la Medida</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ajustamos el tueste según tu máquina de espresso o barra de filtrados (medio-claro, omniroast o medio-oscuro).
            </p>
          </div>
        </div>

        <div className="rounded-[32px] bg-white border-2 border-amber-100 shadow-sm overflow-hidden flex flex-col hover:border-[#FFD242] transition-all group">
          <div className="relative aspect-16/10 overflow-hidden bg-amber-50">
            <img
              src="/images/presentacion-empaque-melifera.jpg"
              alt="Empaques oficiales y marca blanca"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-xs text-[#6F4E37] flex items-center justify-center shadow-xs">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
            <h3 className="font-bold text-slate-900 text-base font-display">Marca Blanca & Empaques</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Podemos empacar con tu propia etiqueta corporativa o suministrar en sacos de café verde y cuñetes de miel de 25kg.
            </p>
          </div>
        </div>

        <div className="rounded-[32px] bg-white border-2 border-amber-100 shadow-sm overflow-hidden flex flex-col hover:border-[#FFD242] transition-all group">
          <div className="relative aspect-16/10 overflow-hidden bg-amber-50">
            <img
              src="/images/detalles-origen-etiqueta.jpg"
              alt="Trazabilidad y origen garantizado"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-xs text-[#6F4E37] flex items-center justify-center shadow-xs">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
            <h3 className="font-bold text-slate-900 text-base font-display">Trazabilidad & Envíos Puntuales</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Despachos programados semanales o mensuales directamente desde la hacienda con ficha técnica de lote.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quoting Calculator + Form */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-[#0F172A] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display">Calculadora & Formulario de Cotización</h2>
              <p className="text-xs text-slate-400">Tus datos se sincronizarán directamente en el Dashboard Administrativo</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span>Respuesta en menos de 24 horas</span>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 font-display">
                ¡Cotización Registrada con Éxito en el Sistema!
              </h3>
              <p className="text-slate-600 text-sm max-w-lg mx-auto">
                Hemos radicado tu solicitud con el código{' '}
                <strong className="text-[#6F4E37] font-bold text-base">{submittedQuoteId}</strong>. Nuestro equipo administrativo de la finca ya tiene tu ficha lista para generar la orden formal.
              </p>
            </div>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Producto:</span>
                <span className="font-bold text-slate-900">{currentProd.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cantidad:</span>
                <span className="font-bold text-slate-900">{quantity} kg / unidades</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Precio Unitario Mayorista:</span>
                <span className="font-bold text-slate-900">{formatCOP(quoteCalculations.unitPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
                <span>Total Estimado:</span>
                <span className="text-emerald-700">{formatCOP(quoteCalculations.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              {(() => {
                const text = `🍯 *NUEVA SOLICITUD DE COTIZACIÓN MAYORISTA - MELÍFERA COFFEE* ☕\n\n` +
                  `📌 *Radicado:* ${submittedQuoteId}\n` +
                  `👤 *Cliente / Contacto:* ${customerName}\n` +
                  `🏢 *Empresa / Negocio:* ${companyName || 'N/A'}\n` +
                  `📱 *Teléfono:* ${phone}\n` +
                  `📍 *Ciudad / Destino:* ${city}\n\n` +
                  `📦 *Producto:* ${currentProd.name}\n` +
                  `⚖️ *Cantidad solicitada:* ${quantity} kg / unidades\n` +
                  `🔄 *Frecuencia estimada:* ${frequency}\n` +
                  `💰 *Precio Unitario Estimado:* ${formatCOP(quoteCalculations.unitPrice)}\n` +
                  `💵 *Total Estimado:* ${formatCOP(quoteCalculations.total)}\n` +
                  (comments ? `💬 *Comentarios:* ${comments}\n\n` : `\n`) +
                  `_Hola equipo Melífera, acabo de registrar esta cotización en la plataforma y deseo agilizar la atención y coordinar detalles._`;
                const waUrl = `https://wa.me/573043785413?text=${encodeURIComponent(text)}`;
                return (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notificar por WhatsApp a la Finca</span>
                  </a>
                );
              })()}
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0F172A] text-white font-bold text-xs hover:bg-slate-800 transition cursor-pointer shadow-sm"
              >
                Realizar otra cotización
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
            {/* Step 1: Product & Quantity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">1</span>
                <span>Selección de Producto & Volumen Mayorista</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Producto a cotizar:
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Min. {p.minWholesaleQuantity} uds)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1.5">
                    Frecuencia de suministro:
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                  >
                    <option value="monthly">Despacho Mensual Programado (Recomendado)</option>
                    <option value="quarterly">Despacho Trimestral</option>
                    <option value="once">Compra Única de Lote</option>
                  </select>
                </div>
              </div>

              {/* Slider */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Cantidad solicitada (Kilos o Unidades):</span>
                  <span className="text-base text-[#6F4E37] font-extrabold">{quantity} unidades/kg</span>
                </div>
                <input
                  type="range"
                  min={currentProd?.minWholesaleQuantity || 10}
                  max={500}
                  step={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[#6F4E37] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Min: {currentProd?.minWholesaleQuantity || 10} uds</span>
                  <span>50 uds (-30%)</span>
                  <span>100 uds (-38%)</span>
                  <span>500+ uds (Máximo Descuento)</span>
                </div>

                {/* Real-time calculated boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-100 text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-semibold">Descuento Estimado</span>
                    <span className="text-base font-extrabold text-emerald-600">-{quoteCalculations.discountPct}%</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-100 text-center shadow-xs">
                    <span className="text-[10px] text-slate-400 block font-semibold">Precio Unitario Mayorista</span>
                    <span className="text-base font-extrabold text-[#0F172A]">{formatCOP(quoteCalculations.unitPrice)}</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-center shadow-xs">
                    <span className="text-[10px] text-[#6F4E37] block font-semibold">Inversión Estimada Total</span>
                    <span className="text-base font-extrabold text-[#6F4E37]">{formatCOP(quoteCalculations.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Custom preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">2</span>
                <span>Opciones de Presentación</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                  <input
                    type="checkbox"
                    checked={customPackaging}
                    onChange={(e) => setCustomPackaging(e.target.checked)}
                    className="w-4 h-4 rounded accent-[#6F4E37]"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Empaque personalizado / Marca propia (White Label)
                  </span>
                </label>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    Fecha deseada del primer despacho:
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Contact & Business details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px]">3</span>
                <span>Datos del Comprador / Empresa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre y Apellido *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tu nombre completo"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Cédula o NIT <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={customerDocument}
                      onChange={(e) => setCustomerDocument(e.target.value)}
                      placeholder="Ej. 1020456789 o 901234567-1"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Razón Social / Empresa <span className="text-slate-400 font-normal">(Opcional)</span></label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ej. Café Barista & Co."
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu.correo@ejemplo.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Teléfono Móvil / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 312 345 6789"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Ciudad o Municipio de Entrega *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Bogotá, Medellín, Cali, Cartagena, etc."
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Comentarios o Especificaciones Técnicas</label>
                  <textarea
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Detalles sobre tipo de molienda requerida, café en grano verde, muestra previa para catación, etc."
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:border-[#6F4E37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                className="w-full py-4 px-6 rounded-full bg-[#6F4E37] text-white font-bold text-sm hover:bg-[#5C3F2C] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Registrar Cotización al Dashboard Admin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
