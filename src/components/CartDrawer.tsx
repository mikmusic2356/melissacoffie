import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Coffee } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQuantity, clearCart, showToast } = useApp();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => {
    const price = item.purchaseType === 'wholesale' ? item.product.wholesalePriceMin : item.product.priceUnit;
    return acc + price * item.quantity;
  }, 0);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const handleCheckout = () => {
    showToast(
      '¡Pedido Contraentrega Confirmado!',
      `Hemos registrado tu pedido por ${formatCOP(subtotal)}. Pagarás únicamente al recibir el paquete en tu domicilio.`
    );
    clearCart();
    setIsCartOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container - Responsive fix: w-full sm:max-w-md without pl-10 overflow */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-md flex z-10">
        <div className="w-full h-full bg-white shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-5 sm:px-6 py-4 sm:py-5 bg-[#2D1A0D] text-white flex items-center justify-between shrink-0 border-b border-[#FFD242]/30">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#FFD242]" />
              <h2 className="text-base sm:text-lg font-bold font-display">Carrito de Compras</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFD242] text-[#2D1A0D] font-bold">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-stone-800 transition cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center border border-stone-700/50"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart list */}
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
                  onClick={() => setIsCartOpen(false)}
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
                          {formatCOP(unitPrice)} <span className="text-[10px] text-slate-500 font-normal">/ {item.product.unitLabel}</span>
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

          {/* Footer checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-amber-100 bg-amber-50/30 space-y-3.5 shrink-0">
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal productos</span>
                  <span className="font-semibold text-slate-800">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío nacional garantizado</span>
                  <span className="text-[#3E2714] font-medium">Calculado al despachar</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#2D1A0D] pt-2 border-t border-amber-200/60 font-display">
                  <span>Total estimado</span>
                  <span className="text-[#3E2714]">{formatCOP(subtotal)}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-[#2D1A0D] space-y-1">
                <div className="flex items-center gap-2 font-bold text-[#3E2714]">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Método de Pago: Contraentrega Exclusivo</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Pagas únicamente cuando recibas tus productos en tu domicilio (efectivo o transferencia al mensajero).
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-sm hover:bg-[#ffca2b] transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                >
                  <span>Pedir Contraentrega ({formatCOP(subtotal)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-slate-100 text-[#2D1A0D] font-semibold text-xs border border-amber-200 transition cursor-pointer"
                >
                  Seguir Comprando
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#3E2714]" />
                <span>Despacho directo desde Melifera coffee</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
