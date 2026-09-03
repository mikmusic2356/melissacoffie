import React, { useState } from 'react';
import { X, Star, ShoppingCart, FileText, Check, ShieldCheck, MapPin, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    setSelectedProductForQuote,
    categories,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [purchaseMode, setPurchaseMode] = useState<'unit' | 'wholesale'>('unit');

  if (!selectedProductForDetail) return null;
  const product = selectedProductForDetail;

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const category = categories.find((c) => c.id === product.categoryId);
  const subCategory = category?.subcategories.find((s) => s.id === product.subCategoryId);

  const handleAddToCart = () => {
    addToCart(product, quantity, purchaseMode);
    setSelectedProductForDetail(null);
  };

  const handleOpenQuote = () => {
    setSelectedProductForDetail(null);
    setSelectedProductForQuote(product);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedProductForDetail(null);
      }}
    >
      <div className="relative bg-white rounded-[24px] sm:rounded-[32px] max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Close button - Always accessible with high z-index and touch target */}
        <button
          onClick={() => setSelectedProductForDetail(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 sm:p-2.5 rounded-full bg-white/95 hover:bg-white text-slate-800 shadow-lg border border-slate-200 min-w-[42px] min-h-[42px] flex items-center justify-center transition cursor-pointer active:scale-95"
          aria-label="Cerrar ventana"
        >
          <X className="w-5 h-5 text-slate-800" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 flex-1 overflow-y-auto">
          {/* Media column - Constrained on mobile so it doesn't push content offscreen */}
          <div className="relative bg-amber-50 h-52 sm:h-64 md:h-auto md:min-h-[380px] shrink-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#2D1A0D] text-[#FFD242] shadow-md font-display border border-[#FFD242]/30">
                {category?.name || 'Melífera'}
              </span>
              {subCategory && (
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-[#2D1A0D] backdrop-blur-md shadow-xs">
                  {subCategory.name}
                </span>
              )}
            </div>
          </div>

          {/* Details column */}
          <div className="p-5 sm:p-7 flex flex-col justify-between space-y-5 bg-white">
            <div className="space-y-4">
              {/* Rating and Reviews */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-[#FFD242]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-[#FFD242] text-[#FFD242]' : 'text-slate-200'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} opiniones)</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#2D1A0D] leading-tight font-display pr-8">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Coffee Origin Badge Card */}
              {product.origin && (
                <div className="p-3.5 sm:p-4 rounded-[20px] bg-amber-50/50 border border-amber-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#3E2714]">
                    <Award className="w-4 h-4 text-[#FFD242]" />
                    <span>Ficha de Origen & Trazabilidad Melífera</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Altitud:</span>
                      <span className="font-semibold">{product.origin.altitudeMeters} msnm</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Variedad:</span>
                      <span className="font-semibold">{product.origin.variety}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Beneficiado:</span>
                      <span className="font-semibold">{product.origin.process}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Finca:</span>
                      <span className="font-semibold">{product.origin.finca}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Honey details */}
              {product.honeyDetails && (
                <div className="p-3.5 sm:p-4 rounded-[20px] bg-[#FFD242]/10 border border-[#FFD242]/40 space-y-1 text-xs text-slate-700">
                  <div className="font-bold text-[#3E2714] flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#2D1A0D]" />
                    <span>Certificación Apícola Artesanal</span>
                  </div>
                  <p><strong className="text-slate-800">Floración:</strong> {product.honeyDetails.flowerSource}</p>
                  <p><strong className="text-slate-800">Pureza:</strong> {product.honeyDetails.purity}</p>
                  <p><strong className="text-slate-800">Textura:</strong> {product.honeyDetails.texture}</p>
                </div>
              )}

              {/* Wholesale Tier Notice */}
              <div className="p-3.5 rounded-[20px] bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>Precios por Mayor:</span>
                  <span className="text-[#3E2714] font-display">Desde {formatCOP(product.wholesalePriceMin)}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Aplica para pedidos mayores a {product.minWholesaleQuantity} {product.unitLabel}.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Precio unidad:</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#2D1A0D] font-display">
                    {formatCOP(product.priceUnit)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Cantidad:</span>
                  <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 font-bold hover:bg-slate-200 cursor-pointer min-h-[32px] flex items-center justify-center"
                      aria-label="Menos"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 font-bold hover:bg-slate-200 cursor-pointer min-h-[32px] flex items-center justify-center"
                      aria-label="Más"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-3 rounded-full bg-[#FFD242] text-[#2D1A0D] font-black text-xs hover:bg-[#ffca2b] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#2D1A0D]" />
                  <span className="truncate">Comprar ({formatCOP(product.priceUnit * quantity)})</span>
                </button>

                <button
                  onClick={handleOpenQuote}
                  className="py-3 px-3 rounded-full bg-[#3E2714] text-white font-bold text-xs hover:bg-[#2D1A0D] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-98"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FFD242]" />
                  <span className="truncate">Cotizar Mayor</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="w-full py-2 text-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
