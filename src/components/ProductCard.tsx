import React from 'react';
import { ShoppingCart, FileText, Star, Eye, Layers, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    setSelectedProductForQuote,
    setSelectedProductForDetail,
    categories,
    copyShareLink,
  } = useApp();

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  const category = categories.find((c) => c.id === product.categoryId);
  const subCategory = category?.subcategories.find((s) => s.id === product.subCategoryId);

  return (
    <div className="group relative bg-white rounded-[32px] border border-amber-100 shadow-sm hover:shadow-xl hover:border-[#FFD242] transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Media Area */}
      <div className="relative aspect-4/3 overflow-hidden bg-amber-50/50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#2D1A0D] text-white backdrop-blur-md shadow-xs border border-[#FFD242]/30">
            {category?.name || 'Melífera'}
          </span>
          {product.featured && (
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#FFD242] text-[#2D1A0D] shadow-xs">
              Cosecha Exclusiva
            </span>
          )}
        </div>

        {/* Action buttons on media hover */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={() => copyShareLink(`#producto/${product.id}`, product.name)}
            className="p-2.5 rounded-full bg-white/95 text-slate-800 shadow-md hover:bg-[#FFD242] hover:text-[#2D1A0D] hover:scale-110 transition cursor-pointer"
            title="Copiar enlace para compartir producto"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSelectedProductForDetail(product)}
            className="p-2.5 rounded-full bg-white/95 text-slate-800 shadow-md hover:bg-[#FFD242] hover:text-[#2D1A0D] hover:scale-110 transition cursor-pointer"
            title="Ver Ficha Técnica"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Origin Pill if coffee */}
        {product.origin && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs">
              {product.origin.altitudeMeters} msnm • {product.origin.process}
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Subcategory & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-[#3E2714]/70 font-semibold truncate text-[11px] uppercase tracking-wider">
              {subCategory?.name || 'MELIFERA COFFIE'}
            </span>
            <div className="flex items-center gap-1 text-[#2D1A0D] font-bold shrink-0 text-xs">
              <Star className="w-3.5 h-3.5 fill-[#FFD242] text-[#FFD242]" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px] font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setSelectedProductForDetail(product)}
            className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#3E2714] transition-colors cursor-pointer line-clamp-2"
          >
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Coffee tasting notes or honey source */}
          {product.origin && product.origin.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {product.origin.tastingNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-[#3E2714] border border-amber-200/50"
                >
                  {note}
                </span>
              ))}
            </div>
          )}

          {product.honeyDetails && (
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#2D1A0D] bg-[#FFD242]/15 p-2 rounded-xl border border-[#FFD242]/40">
              <Layers className="w-3.5 h-3.5 text-[#3E2714] shrink-0" />
              <span className="truncate font-medium">{product.honeyDetails.flowerSource}</span>
            </div>
          )}
        </div>

        {/* Pricing Matrix */}
        <div className="pt-3 border-t border-amber-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Precio al Detal
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-slate-900">
                  {formatCOP(product.priceUnit)}
                </span>
                <span className="text-[10px] text-slate-400">/{product.unitLabel.split(' ')[0]}</span>
              </div>
            </div>

            {product.wholesalePriceMin > 0 ? (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#3E2714] font-bold block">
                  Al por Mayor
                </span>
                <span className="text-xs font-bold text-[#3E2714]">
                  Desde {formatCOP(product.wholesalePriceMin)}
                </span>
                <span className="block text-[9px] text-slate-400">Min. {product.minWholesaleQuantity} uds</span>
              </div>
            ) : (
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                  Disponibilidad
                </span>
                <span className="text-xs font-bold text-[#2D1A0D]">
                  Venta al Detal
                </span>
                <span className="block text-[9px] text-slate-400">Sin precio mayorista</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => addToCart(product, 1, 'unit')}
              className="py-2.5 px-3 rounded-full bg-amber-50 hover:bg-amber-100 text-[#2D1A0D] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-amber-200/60"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Unidad</span>
            </button>

            <button
              onClick={() => setSelectedProductForQuote(product)}
              className="py-2.5 px-3 rounded-full bg-[#3E2714] hover:bg-[#2D1A0D] text-[#FFD242] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Cotizar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
