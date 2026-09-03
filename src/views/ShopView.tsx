import React, { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { Search, SlidersHorizontal, X, Sparkles, Filter, Check, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export const ShopView: React.FC = () => {
  const { products, categories, setActiveView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [wholesaleOnly, setWholesaleOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory, maxPrice, sortBy, wholesaleOnly]);

  // Available subcategories depending on category
  const currentCategoryObj = categories.find((c) => c.id === selectedCategory);
  const availableSubcategories = currentCategoryObj ? currentCategoryObj.subcategories : [];

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchNotes = p.origin?.tastingNotes.some((n) => n.toLowerCase().includes(q));
          const matchFlower = p.honeyDetails?.flowerSource.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchNotes && !matchFlower) return false;
        }

        // Category
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        // Subcategory
        if (selectedSubCategory !== 'all' && p.subCategoryId !== selectedSubCategory) {
          return false;
        }

        // Price
        if (p.priceUnit > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceUnit - b.priceUnit;
        if (sortBy === 'price-desc') return b.priceUnit - a.priceUnit;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, searchQuery, selectedCategory, selectedSubCategory, maxPrice, sortBy, wholesaleOnly]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setMaxPrice(150000);
    setSortBy('featured');
    setWholesaleOnly(false);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedSubCategory !== 'all' ||
    maxPrice < 150000 ||
    sortBy !== 'featured';

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="rounded-[32px] bg-[#0F172A] text-white p-8 sm:p-12 shadow-xl relative overflow-hidden border border-[#FFD242]/20">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFD242] text-[#2D1A0D] text-xs font-black shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#2D1A0D]" />
            <span>Mercado Directo de Origen</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-[#FFD242]">
            Marketplace de Café & Miel
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed">
            Explora nuestros cafés de especialidad tostados en la finca, mieles crudas monoflorales, panales y accesorios para barismo. Compra en unidades o solicita cotizaciones para mayoristas.
          </p>
        </div>
        {/* Subtle organic glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#FFD242]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main layout with Sidebar and Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile filter toggle */}
        <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 text-xs font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#6F4E37]" />
            <span>Filtros & Categorías ({filteredProducts.length} productos)</span>
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-[#6F4E37] font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } bg-white rounded-[32px] border border-slate-100 p-6 sm:p-8 space-y-6 shadow-sm sticky top-24`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A] font-display">
              <Filter className="w-4 h-4 text-[#6F4E37]" />
              <span>Filtros de Búsqueda</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-[#6F4E37] hover:underline cursor-pointer font-bold"
              >
                Limpiar todo
              </button>
            )}
          </div>

          {/* Search box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">Buscar en la tienda</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Geisha, miel virgen, molido..."
                className="w-full pl-9 pr-8 py-2.5 text-xs rounded-full border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition text-slate-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Categorías Principales</label>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedSubCategory('all');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#6F4E37] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Todas las categorías</span>
                <span className="text-[10px] opacity-80">{products.length}</span>
              </button>

              {categories.map((cat) => {
                const count = products.filter((p) => p.categoryId === cat.id).length;
                const isSelected = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setSelectedSubCategory('all');
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#6F4E37] text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-80">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories (if a category with subcategories is selected) */}
          {availableSubcategories.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                Subcategorías ({currentCategoryObj?.name})
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedSubCategory('all')}
                  className={`w-full text-left px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer ${
                    selectedSubCategory === 'all'
                      ? 'bg-[#6F4E37]/10 text-[#6F4E37] font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Todas las subcategorías
                </button>
                {availableSubcategories.map((sub) => {
                  const isSelected = selectedSubCategory === sub.id;
                  const count = products.filter((p) => p.subCategoryId === sub.id).length;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubCategory(sub.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-1.5 rounded-full text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#6F4E37]/10 text-[#6F4E37] font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{sub.name}</span>
                      <span className="text-[10px] text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Price Slider */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 flex justify-between">
              <span>Precio máximo:</span>
              <span className="text-[#6F4E37] font-black">{formatCOP(maxPrice)}</span>
            </label>
            <input
              type="range"
              min={20000}
              max={150000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#6F4E37] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>$20.000</span>
              <span>$150.000+</span>
            </div>
          </div>

          {/* B2B callout inside sidebar */}
          <div className="p-5 rounded-[24px] bg-slate-50 border border-slate-100 space-y-2.5 text-xs">
            <span className="font-bold text-[#6F4E37] block font-display">¿Compras para cafetería o empresa?</span>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Solicita cotizaciones por volumen con precio especial de productor directo.
            </p>
            <button
              onClick={() => setActiveView('cotizaciones')}
              className="w-full py-2.5 px-4 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition cursor-pointer shadow-sm"
            >
              Ir a Cotizaciones B2B
            </button>
          </div>
        </aside>

        {/* Products Grid Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top sorting & active pills bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <p className="text-xs text-slate-500 font-medium">
              Mostrando <strong className="text-slate-900">{filteredProducts.length}</strong> productos
            </p>

            {/* Sort selection */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-2 px-4 rounded-full border border-slate-200 bg-white font-bold text-slate-800 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none shadow-xs"
              >
                <option value="featured">Destacados de Cosecha</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificados</option>
              </select>
            </div>
          </div>

          {/* Active filter badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Filtros activos:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-800 font-bold">
                  {currentCategoryObj?.name}
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#6F4E37]/10 text-[#6F4E37] font-bold">
                  Subcategoría
                  <button onClick={() => setSelectedSubCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-100 text-slate-800 font-bold">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products List & Pagination */}
          {filteredProducts.length === 0 ? (
            <div className="p-16 text-center bg-white rounded-[32px] border border-slate-100 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#6F4E37] mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">No encontramos productos con estos filtros</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Intenta ajustar el rango de precios o busca con términos más generales como "café", "miel" o "geisha".
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#5C3F2C] transition cursor-pointer shadow-sm"
              >
                Restablecer todos los filtros
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
              </div>

              {/* Pagination controls */}
              {Math.ceil(filteredProducts.length / itemsPerPage) > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium">
                    Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredProducts.length)} de {filteredProducts.length} productos
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                      aria-label="Página anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="hidden sm:inline">Anterior</span>
                    </button>

                    {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center ${
                          currentPage === pageNum
                            ? 'bg-[#2D1A0D] text-[#FFD242] shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(Math.ceil(filteredProducts.length / itemsPerPage), p + 1));
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                      disabled={currentPage >= Math.ceil(filteredProducts.length / itemsPerPage)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-1 text-xs font-bold"
                      aria-label="Página siguiente"
                    >
                      <span className="hidden sm:inline">Siguiente</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
