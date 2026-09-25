import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Coffee,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  CheckCircle2,
  Send,
  Truck,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RetailOrder } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    createOrder,
    currentUser,
    setLastConsultedEmail,
    showToast,
  } = useApp();

  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<RetailOrder | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    phone: currentUser.phone || '',
    email: currentUser.email || '',
    document: '',
    department: 'Antioquia',
    city: 'Medellín',
    address: '',
    neighborhood: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.purchaseType === 'wholesale' ? item.product.wholesalePriceMin : item.product.priceUnit;
    return acc + price * item.quantity;
  }, 0);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'El nombre completo es obligatorio';
    if (!formData.phone.trim()) errors.phone = 'El teléfono / WhatsApp es obligatorio';
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Ingresa un correo electrónico válido';
    }
    if (!formData.city.trim()) errors.city = 'La ciudad o municipio es obligatoria';
    if (!formData.address.trim()) errors.address = 'La dirección exacta de entrega es obligatoria';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Datos Incompletos', 'Por favor completa los campos requeridos marcados en rojo.', 'warning');
      return;
    }

    if (cart.length === 0) {
      showToast('Carrito Vacío', 'No hay productos en el carrito.', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: item.product.imageUrl,
        unitPrice: item.purchaseType === 'wholesale' ? item.product.wholesalePriceMin : item.product.priceUnit,
        quantity: item.quantity,
        unitLabel: item.product.unitLabel,
        purchaseType: item.purchaseType,
        total: (item.purchaseType === 'wholesale' ? item.product.wholesalePriceMin : item.product.priceUnit) * item.quantity,
      }));

      const newOrder = await createOrder({
        customerName: formData.name.trim(),
        customerEmail: formData.email.trim().toLowerCase(),
        customerPhone: formData.phone.trim(),
        customerDocument: formData.document.trim() || undefined,
        department: formData.department.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        neighborhood: formData.neighborhood.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        paymentMethod: 'contraentrega',
        items: orderItems,
        subtotal,
        shippingCost: 0,
        total: subtotal,
        status: 'pendiente',
      });

      setLastConsultedEmail(formData.email.trim().toLowerCase());
      setCreatedOrder(newOrder);
      clearCart();
      setStep('success');
      showToast(
        '¡Pedido Contraentrega Confirmado!',
        `Hemos registrado tu pedido #${newOrder.id}. Pagarás ${formatCOP(subtotal)} al recibir.`
      );
    } catch (err: any) {
      showToast('Error al generar pedido', err.message || 'Inténtalo nuevamente', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    // Reset step after animation/closure
    setTimeout(() => {
      setStep('cart');
      setCreatedOrder(null);
    }, 300);
  };

  const generateWhatsAppOrderLink = () => {
    if (!createdOrder) return '#';
    const itemsList = createdOrder.items
      .map((i) => `• ${i.quantity}x ${i.productName} (${formatCOP(i.total)})`)
      .join('\n');

    const message = `🌿 *¡Hola Melífera Coffee!* Acabo de generar un pedido *Contraentrega* en la tienda web:\n\n📦 *Pedido:* #${createdOrder.id}\n👤 *Cliente:* ${createdOrder.customerName}\n📱 *Teléfono:* ${createdOrder.customerPhone}\n📍 *Ciudad/Depto:* ${createdOrder.city}, ${createdOrder.department}\n🏠 *Dirección:* ${createdOrder.address}${createdOrder.neighborhood ? ` (${createdOrder.neighborhood})` : ''}\n${createdOrder.notes ? `📝 *Notas:* ${createdOrder.notes}\n` : ''}\n🛒 *Productos:*\n${itemsList}\n\n💰 *Total a pagar al recibir:* ${formatCOP(createdOrder.total)}\n\n¿Me confirman los datos de despacho? ¡Muchas gracias!`;

    return `https://wa.me/573043785413?text=${encodeURIComponent(message)}`;
  };

  const DEPARTAMENTOS_COLOMBIA = [
    'Antioquia',
    'Bogotá D.C.',
    'Cundinamarca',
    'Valle del Cauca',
    'Santander',
    'Norte de Santander',
    'Atlántico',
    'Bolívar',
    'Caldas',
    'Risaralda',
    'Quindío',
    'Tolima',
    'Huila',
    'Cauca',
    'Nariño',
    'Boyacá',
    'Meta',
    'Cesar',
    'Magdalena',
    'Córdoba',
    'Sucre',
    'La Guajira',
    'Casanare',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-lg flex z-10">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 bg-[#2D1A0D] text-white flex items-center justify-between shrink-0 border-b border-[#FFD242]/30">
            <div className="flex items-center gap-2.5">
              {step === 'checkout' && (
                <button
                  onClick={() => setStep('cart')}
                  className="p-1.5 -ml-1.5 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer"
                  title="Volver al carrito"
                  aria-label="Volver al carrito"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <ShoppingBag className="w-5 h-5 text-[#FFD242]" />
              <div>
                <h2 className="text-base sm:text-lg font-bold font-display">
                  {step === 'cart' && 'Carrito de Compras'}
                  {step === 'checkout' && 'Datos de Envío & Contraentrega'}
                  {step === 'success' && '¡Pedido Confirmado!'}
                </h2>
                <p className="text-[11px] text-amber-200/80">
                  {step === 'cart' && `${cart.length} ítem(s) seleccionados`}
                  {step === 'checkout' && 'Pagas en efectivo o transferencia al recibir'}
                  {step === 'success' && 'Despacho prioritario desde la finca'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center border border-stone-700/50"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: CART LIST */}
          {step === 'cart' && (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {cart.length === 0 ? (
                  <div className="text-center py-12 sm:py-16 space-y-4 px-4">
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 mx-auto flex items-center justify-center text-[#3E2714] border border-amber-200">
                      <Coffee className="w-8 h-8 opacity-80 text-[#3E2714]" />
                    </div>
                    <h3 className="font-bold text-[#2D1A0D] text-base font-display">Tu carrito está vacío</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Explora nuestros cafés de especialidad tostados en origen o nuestra miel virgen de flor de café.
                    </p>
                    <button
                      onClick={handleClose}
                      className="px-5 py-2.5 rounded-full bg-[#3E2714] text-[#FFD242] text-xs font-bold hover:bg-[#2D1A0D] transition cursor-pointer"
                    >
                      Seguir Explorando
                    </button>
                  </div>
                ) : (
                  cart.map((item) => {
                    const isWholesale = item.purchaseType === 'wholesale';
                    const unitPrice = isWholesale ? item.product.wholesalePriceMin : item.product.priceUnit;

                    return (
                      <div
                        key={`${item.product.id}-${item.purchaseType}`}
                        className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-[22px] border border-amber-100 bg-white shadow-xs hover:shadow-md transition"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-amber-100"
                        />

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs sm:text-sm font-bold text-[#2D1A0D] truncate font-display">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-slate-400 hover:text-red-500 transition p-1.5 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center shrink-0"
                                title="Eliminar producto"
                                aria-label="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isWholesale
                                    ? 'bg-[#FFD242]/20 text-[#2D1A0D] border border-[#FFD242]/50'
                                    : 'bg-amber-50 text-[#3E2714]'
                                }`}
                              >
                                {isWholesale ? 'Precio Mayorista' : 'Compra por Unidad'}
                              </span>
                            </div>
                            <p className="text-xs font-bold text-[#3E2714] mt-1">
                              {formatCOP(unitPrice)}{' '}
                              <span className="text-[10px] text-slate-500 font-normal">/ {item.product.unitLabel}</span>
                            </p>
                          </div>

                          {/* Quantity row */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center border border-amber-200 rounded-full bg-amber-50/40 overflow-hidden">
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                                className="px-2.5 py-1 text-slate-600 hover:bg-amber-100 cursor-pointer min-h-[30px] flex items-center justify-center font-bold"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 text-xs font-bold text-[#2D1A0D]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                                className="px-2.5 py-1 text-slate-600 hover:bg-amber-100 cursor-pointer min-h-[30px] flex items-center justify-center font-bold"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs font-bold text-[#2D1A0D] font-display">
                              {formatCOP(unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer step 1 */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-amber-100 bg-amber-50/30 space-y-3.5 shrink-0">
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal productos</span>
                      <span className="font-semibold text-slate-800">{formatCOP(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío nacional contraentrega</span>
                      <span className="text-emerald-700 font-bold">¡Pago al Recibir!</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-[#2D1A0D] pt-2 border-t border-amber-200/60 font-display">
                      <span>Total a pagar en entrega</span>
                      <span className="text-[#3E2714]">{formatCOP(subtotal)}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-[#2D1A0D] space-y-1">
                    <div className="flex items-center gap-2 font-bold text-[#3E2714]">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>Modalidad: Pago Contraentrega Garantizado</span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      No tienes que pagar nada ahora. Diligencia tus datos de envío y pagas en tu puerta al recibir el paquete.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setStep('checkout')}
                      className="w-full py-3.5 px-4 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-sm hover:bg-[#ffca2b] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                    >
                      <span>Completar Datos de Envío ({formatCOP(subtotal)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-[#2D1A0D] font-semibold text-xs border border-amber-200 transition cursor-pointer"
                    >
                      Seguir Comprando
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: CHECKOUT CUSTOMER FORM */}
          {step === 'checkout' && (
            <form onSubmit={handleSubmitOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                
                {/* Notice banner */}
                <div className="p-3.5 bg-gradient-to-r from-amber-500/10 to-amber-100/50 rounded-2xl border border-amber-300 text-xs text-[#2D1A0D] flex items-start gap-2.5 shadow-2xs">
                  <Truck className="w-5 h-5 text-[#3E2714] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#2D1A0D] block">Despacho Nacional Contraentrega</span>
                    <span className="text-[11px] text-slate-600">
                      Ingresa tu dirección exacta. El mensajero recibirá el pago en efectivo o transferencia bancaria al entregarte.
                    </span>
                  </div>
                </div>

                {/* Personal Info */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#3E2714]" />
                    <span>Información de Contacto</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nombre y Apellidos <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ej: Laura Camila Restrepo"
                      className={`w-full p-2.5 text-xs rounded-xl border ${
                        formErrors.name ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                      } focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition`}
                    />
                    {formErrors.name && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.name}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Teléfono / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Ej: 312 345 6789"
                          className={`w-full pl-8.5 pr-2.5 py-2.5 text-xs rounded-xl border ${
                            formErrors.phone ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                          } focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition`}
                        />
                      </div>
                      {formErrors.phone && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cédula / Documento <span className="text-slate-400 font-normal">(Opcional)</span>
                      </label>
                      <input
                        type="text"
                        value={formData.document}
                        onChange={(e) => handleInputChange('document', e.target.value)}
                        placeholder="Cédula para factura"
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        className={`w-full pl-8.5 pr-2.5 py-2.5 text-xs rounded-xl border ${
                          formErrors.email ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                        } focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition`}
                      />
                    </div>
                    {formErrors.email && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.email}</p>}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#3E2714]" />
                    <span>Dirección de Entrega</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Departamento <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3E2714] focus:outline-none bg-white transition"
                      >
                        {DEPARTAMENTOS_COLOMBIA.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Ciudad / Municipio <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Ej: Medellín, Bogotá, Cali..."
                        className={`w-full p-2.5 text-xs rounded-xl border ${
                          formErrors.city ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                        } focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition`}
                      />
                      {formErrors.city && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.city}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dirección Exacta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Calle 10 # 43E - 22, Apto 502 / Torre 3"
                      className={`w-full p-2.5 text-xs rounded-xl border ${
                        formErrors.address ? 'border-red-400 bg-red-50/50' : 'border-slate-200'
                      } focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition`}
                    />
                    {formErrors.address && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Barrio / Conjunto Residencial <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.neighborhood}
                      onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                      placeholder="Ej: El Poblado, Cedritos, Laureles..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3E2714] focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Indicaciones para la Entrega <span className="text-slate-400 font-normal">(Opcional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Ej: Dejar en portería, timbre 201, llamar 10 minutos antes..."
                      className="w-full p-2.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#3E2714] focus:outline-none resize-none transition"
                    />
                  </div>
                </div>

                {/* Items Summary in Checkout */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-2">
                  <div className="flex justify-between items-center text-slate-700 font-bold">
                    <span>Resumen del Pedido ({cart.length} productos)</span>
                    <button
                      type="button"
                      onClick={() => setStep('cart')}
                      className="text-[11px] text-[#3E2714] underline hover:text-amber-800"
                    >
                      Editar
                    </button>
                  </div>
                  <div className="divide-y divide-slate-200 max-h-32 overflow-y-auto">
                    {cart.map((item) => {
                      const price = item.purchaseType === 'wholesale' ? item.product.wholesalePriceMin : item.product.priceUnit;
                      return (
                        <div key={item.product.id} className="py-1.5 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 truncate max-w-[200px]">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="font-bold text-slate-800">{formatCOP(price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-[#2D1A0D]">
                    <span>Total a Pagar Contraentrega:</span>
                    <span className="text-[#3E2714]">{formatCOP(subtotal)}</span>
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="p-4 sm:p-6 border-t border-amber-100 bg-amber-50/40 space-y-2 shrink-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-sm hover:bg-[#ffca2b] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50 active:scale-98"
                >
                  {isSubmitting ? (
                    <span>Generando Pedido...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                      <span>Confirmar Pedido Contraentrega ({formatCOP(subtotal)})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 transition cursor-pointer"
                >
                  Volver a Revisar Productos
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && createdOrder && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center space-y-5">
              <div className="w-18 h-18 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg border border-emerald-200 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-100 text-[#2D1A0D] border border-amber-300 inline-block mb-2">
                  Pedido #{createdOrder.id}
                </span>
                <h3 className="text-xl font-black text-[#2D1A0D] font-display">
                  ¡Pedido Registrado con Éxito!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                  Hemos guardado tu pedido contraentrega. Nuestro equipo en la finca ya está alistando tu paquete para despacho.
                </p>
              </div>

              {/* Order Box Details */}
              <div className="w-full p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
                  <span className="text-slate-500">Destinatario:</span>
                  <span className="font-bold text-[#2D1A0D]">{createdOrder.customerName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
                  <span className="text-slate-500">Dirección:</span>
                  <span className="font-bold text-[#2D1A0D] truncate max-w-[200px]">
                    {createdOrder.address}, {createdOrder.city}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-amber-200/70">
                  <span className="text-slate-500">Método de pago:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                    Contraentrega (Al Recibir)
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 font-bold text-sm text-[#2D1A0D]">
                  <span>Total a pagar en puerta:</span>
                  <span className="text-[#3E2714] text-base">{formatCOP(createdOrder.total)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="w-full space-y-2.5 pt-2">
                <a
                  href={generateWhatsAppOrderLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-full bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Notificar Despacho por WhatsApp</span>
                </a>

                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 rounded-full bg-[#2D1A0D] text-[#FFD242] font-bold text-xs hover:bg-[#3E2714] transition cursor-pointer"
                >
                  Finalizar & Seguir Explorando
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Recibirás seguimiento de tu paquete vía WhatsApp y correo</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
