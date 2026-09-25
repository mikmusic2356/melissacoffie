import React, { useState, useEffect } from 'react';
import { X, Building2, User, Mail, Phone, MapPin, Calculator, Send, CheckCircle2, CreditCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const WholesaleQuoteModal: React.FC = () => {
  const {
    selectedProductForQuote,
    setSelectedProductForQuote,
    products,
    createQuoteRequest,
    currentUser,
    lastConsultedEmail,
    lastConsultedCedula,
    setActiveView,
  } = useApp();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(25);
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'quarterly'>('monthly');
  const [customPackaging, setCustomPackaging] = useState(false);
  const [comments, setComments] = useState('');
  const defaultTargetDate = () => {
    const d = new Date(Date.now() + 15 * 86400000);
    return d.toISOString().split('T')[0];
  };
  const [targetDate, setTargetDate] = useState(defaultTargetDate());

  // Contact info & Cedula
  const [customerDocument, setCustomerDocument] = useState(lastConsultedCedula || '');
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState(lastConsultedEmail || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState('');

  useEffect(() => {
    if (selectedProductForQuote) {
      setSelectedProduct(selectedProductForQuote);
      setQuantity(Math.max(selectedProductForQuote.minWholesaleQuantity, 25));
    } else if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [selectedProductForQuote, products]);

  if (!selectedProductForQuote) return null;

  const currentProd = selectedProduct || products[0];

  // Volume discount calculation logic
  const calculateTieredPrice = (qty: number, baseUnitPrice: number, wholesaleMin: number) => {
    let discountPct = 0.15; // default 15% discount for wholesale
    if (qty >= 100) discountPct = 0.38;
    else if (qty >= 50) discountPct = 0.30;
    else if (qty >= 25) discountPct = 0.22;

    const calculatedUnit = Math.round(baseUnitPrice * (1 - discountPct));
    // Ensure it doesn't go lower than configured floor
    const finalUnit = Math.max(wholesaleMin, calculatedUnit);
    return {
      finalUnit,
      discountPct: Math.round(((baseUnitPrice - finalUnit) / baseUnitPrice) * 100),
      total: finalUnit * qty,
    };
  };

  const quoteCalculations = calculateTieredPrice(
    quantity,
    currentProd?.priceUnit || 40000,
    currentProd?.wholesalePriceMin || 25000
  );

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProd) return;

    const newQuote = createQuoteRequest({
      customerDocument: customerDocument.trim() || undefined,
      customerName: customerName.trim(),
      companyName: companyName.trim() || 'Cliente Particular Mayorista',
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
      estimatedUnitPrice: quoteCalculations.finalUnit,
      estimatedTotal: quoteCalculations.total,
    });

    setSubmittedQuoteId(newQuote.id);
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setSelectedProductForQuote(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative bg-white rounded-[24px] sm:rounded-[32px] max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="bg-[#0F172A] text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6F4E37] text-white flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display">Cotizador al por Mayor & B2B</h2>
              <p className="text-[11px] sm:text-xs text-slate-400">Precios directos de finca para cafeterías, tostadores y empresas</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-slate-700/50"
            aria-label="Cerrar cotizador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 text-center space-y-5 overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">¡Solicitud de Cotización Registrada!</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                Tu cotización ha sido guardada en nuestro sistema con el radicado{' '}
                <strong className="text-[#6F4E37] font-bold">{submittedQuoteId}</strong>.
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-[22px] bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Producto:</span>
                <span className="text-slate-900 font-bold">{currentProd?.name}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Volumen solicitado:</span>
                <span className="text-slate-900 font-bold">{quantity} unidades / kg</span>
              </div>
              {customerDocument && (
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Cédula vinculada:</span>
                  <span className="text-[#6F4E37] font-mono font-bold">{customerDocument}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-slate-700 pt-1 border-t border-slate-200">
                <span>Total Estimado:</span>
                <span className="text-emerald-700 font-bold text-sm font-display">{formatCOP(quoteCalculations.total)}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs max-w-md mx-auto">
              <p className="font-semibold">¡No necesitas registrarte ni iniciar sesión!</p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Con tu número de cédula puedes consultar el estado de tu cotización en cualquier momento desde la sección de consulta.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2.5 justify-center max-w-md mx-auto">
              {(() => {
                const text = `🍯 *NUEVA SOLICITUD DE COTIZACIÓN MAYORISTA - MELÍFERA COFFEE* ☕\n\n` +
                  `📌 *Radicado:* ${submittedQuoteId}\n` +
                  `👤 *Cliente / Contacto:* ${customerName}\n` +
                  `🏢 *Empresa / Negocio:* ${companyName || 'N/A'}\n` +
                  `📱 *Teléfono:* ${phone}\n` +
                  `📍 *Ciudad / Destino:* ${city}\n\n` +
                  `📦 *Producto:* ${currentProd?.name}\n` +
                  `⚖️ *Cantidad solicitada:* ${quantity} kg / unidades\n` +
                  `🔄 *Frecuencia estimada:* ${frequency}\n` +
                  `💰 *Precio Estimado Unitario:* ${formatCOP(quoteCalculations.finalUnit)}\n` +
                  `💵 *Total Estimado:* ${formatCOP(quoteCalculations.total)}\n` +
                  (comments ? `💬 *Comentarios:* ${comments}\n\n` : `\n`) +
                  `_Hola equipo Melífera, acabo de registrar esta cotización en la plataforma y deseo agilizar la atención y coordinar detalles._`;
                const waUrl = `https://wa.me/573043785413?text=${encodeURIComponent(text)}`;
                return (
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20 active:scale-[0.99]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Notificar por WhatsApp a la Finca</span>
                  </a>
                );
              })()}

              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => {
                    handleClose();
                    setActiveView('mis-reservas');
                  }}
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-[#0F172A] text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Consultar con mi Cédula</span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-7 space-y-5 overflow-y-auto flex-1">
            {/* Product selection banner */}
            <div className="p-4 rounded-[24px] bg-slate-50 border border-slate-200 flex items-center gap-4">
              <img
                src={currentProd?.imageUrl}
                alt={currentProd?.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#6F4E37]">
                  Producto a Cotizar
                </span>
                <h4 className="font-bold text-slate-900 text-sm truncate font-display">{currentProd?.name}</h4>
                <p className="text-xs text-slate-500">
                  Precio unitario estándar: {formatCOP(currentProd?.priceUnit || 0)}
                </p>
              </div>
            </div>

            {/* Volume selector & tier calculation */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 flex justify-between">
                <span>Volumen deseado (Kilos / Unidades):</span>
                <span className="text-[#6F4E37] font-bold text-sm font-display">{quantity} unidades</span>
              </label>
              <input
                type="range"
                min={currentProd?.minWholesaleQuantity || 10}
                max={300}
                step={5}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#6F4E37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Min: {currentProd?.minWholesaleQuantity || 10}</span>
                <span>50 unidades (-30%)</span>
                <span>100+ unidades (-38%)</span>
                <span>300 unidades</span>
              </div>

              {/* Dynamic discount estimate pill */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Ahorro por Volumen</span>
                  <span className="text-sm font-bold text-emerald-600">-{quoteCalculations.discountPct}% Dto</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-medium">Precio por Unidad Mayor</span>
                  <span className="text-sm font-bold text-[#0F172A] font-display">{formatCOP(quoteCalculations.finalUnit)}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-center col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#6F4E37] block font-medium">Inversión Estimada</span>
                  <span className="text-sm font-extrabold text-[#6F4E37] font-display">{formatCOP(quoteCalculations.total)}</span>
                </div>
              </div>
            </div>

            {/* Frequency and options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Frecuencia de compra estimada:
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full p-3 text-xs font-medium rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                >
                  <option value="once">Compra puntual única (Lote)</option>
                  <option value="monthly">Suministro mensual programado</option>
                  <option value="quarterly">Suministro trimestral</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1.5">
                  Fecha estimada de entrega:
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-3 text-xs font-medium rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                />
              </div>
            </div>

            {/* Custom packaging checkbox */}
            <label className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={customPackaging}
                onChange={(e) => setCustomPackaging(e.target.checked)}
                className="w-4 h-4 rounded text-[#6F4E37] accent-[#6F4E37]"
              />
              <span className="text-xs text-slate-700 font-medium">
                Requiero empaque personalizado con marca propia (White Label / Marca Blanca)
              </span>
            </label>

            {/* Client information fields */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Datos de Contacto & Consulta
                </h4>
                <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
                  Sin registro obligatorio
                </span>
              </div>

              {/* CEDULA / NIT FIELD */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-200">
                <label className="text-[11px] font-bold text-slate-800 block mb-1">
                  Cédula de Ciudadanía o NIT *
                </label>
                <div className="relative">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={customerDocument}
                    onChange={(e) => setCustomerDocument(e.target.value)}
                    placeholder="Ej. 1020304050"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#6F4E37] focus:outline-none font-mono font-medium"
                  />
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  Ingresa tu número de documento para consultar el estado de tu cotización y todas tus reservas en cualquier momento sin crear contraseña ni cuenta.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Nombre Completo *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Tu nombre y apellido"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Empresa / Negocio (Opcional)</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Cafetería, Hotel o Distribuidora"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@empresa.com"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Teléfono / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+57 300 123 4567"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Ciudad o Municipio de Destino *</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej. Medellín, Bogotá, Cali, Barranquilla o Internacional"
                      className="w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Comentarios o requerimientos técnicos</label>
                  <textarea
                    rows={2}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Especifica si requieres molienda particular, café en grano verde, tipo de sacos, etc."
                    className="w-full p-2.5 text-xs rounded-2xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submission CTA */}
            <div className="pt-3 border-t border-slate-100">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-full bg-[#6F4E37] text-white font-bold text-sm hover:bg-[#5C3F2C] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud de Cotización al Admin</span>
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">
                Los datos se registrarán en el panel administrativo y podrás consultarla con tu cédula.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
