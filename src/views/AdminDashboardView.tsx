import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Package,
  Calendar,
  FileText,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Tag,
  Search,
  Filter,
  Layers,
  Sparkles,
  Coffee,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Product, FarmEvent, Category, WholesaleQuoteRequest, CafeteriaMenuItem, EventScheduleSlot } from '../types';
import { ImageUploader } from '../components/ImageUploader';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    addSubCategory,
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    quotes,
    updateQuoteStatus,
    bookings,
    cafeteriaMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'events' | 'quotes' | 'bookings' | 'cafeteria'>('products');

  // Product CRUD Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    categoryId: 'cafe',
    subCategoryId: 'cafe-grano',
    shortDescription: '',
    description: '',
    priceUnit: 35000,
    wholesalePriceMin: 22000,
    minWholesaleQuantity: 25,
    unitLabel: 'Bolsa 340g',
    unitPresentation: 'Bolsa 340g con válvula desgasificadora',
    stock: 50,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    badges: ['Cosecha Nueva'],
  });

  // Cafeteria Menu CRUD states
  const [isMenuItemModalOpen, setIsMenuItemModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<CafeteriaMenuItem | null>(null);
  const [menuItemForm, setMenuItemForm] = useState<Partial<CafeteriaMenuItem>>({
    name: '',
    category: 'calientes',
    price: 12000,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    badges: ['De la Finca'],
    preparationTimeMin: 10,
    isFarmMade: true,
  });

  // Category modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [subCatParentId, setSubCatParentId] = useState('cafe');
  const [newSubCatName, setNewSubCatName] = useState('');

  // Event CRUD Modal states
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<FarmEvent | null>(null);
  const [eventForm, setEventForm] = useState<Partial<FarmEvent>>({
    title: '',
    season: 'Temporada de Cosecha',
    date: '2026-10-15',
    time: '10:00 AM - 1:00 PM',
    durationHours: 3,
    location: 'Cafetería & Laboratorio de Catación',
    description: '',
    pricePerPerson: 85000,
    capacity: 15,
    bookedSpots: 0,
    included: ['Materiales de catación', 'Café de cortesía', 'Certificado'],
    imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
  });

  // Quote detail view modal
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<WholesaleQuoteRequest | null>(null);

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
  };

  // Metrics
  const totalProductsCount = products.length;
  const pendingQuotesCount = quotes.filter((q) => q.status === 'pendiente').length;
  const totalBookingsCount = bookings.length;
  const totalBookedRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((acc, b) => acc + b.totalPaid, 0);

  // --- Handlers for Products ---
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      categoryId: 'cafe',
      subCategoryId: 'cafe-grano',
      shortDescription: '',
      description: '',
      priceUnit: 35000,
      wholesalePriceMin: 22000,
      minWholesaleQuantity: 25,
      unitLabel: 'Bolsa 340g',
      unitPresentation: 'Bolsa 340g con válvula',
      stock: 50,
      featured: false,
      imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      badges: ['Cosecha Nueva'],
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({ ...prod, unitLabel: prod.unitLabel || 'Unidad' });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name) return;

    const label = productForm.unitLabel || 'Unidad';
    const shortDesc = productForm.shortDescription || productForm.description || '';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        unitLabel: label,
        shortDescription: shortDesc,
      });
      showToast('Producto actualizado', `Se guardaron los cambios en ${productForm.name}`, 'success');
    } else {
      addProduct({
        name: productForm.name!,
        categoryId: productForm.categoryId || 'cafe',
        subCategoryId: productForm.subCategoryId || 'cafe-grano',
        shortDescription: shortDesc,
        description: productForm.description || '',
        priceUnit: Number(productForm.priceUnit) || 35000,
        wholesalePriceMin: Number(productForm.wholesalePriceMin) || 20000,
        minWholesaleQuantity: Number(productForm.minWholesaleQuantity) || 20,
        unitLabel: label,
        stock: Number(productForm.stock) || 50,
        featured: !!productForm.featured,
        imageUrl: productForm.imageUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
        badges: productForm.badges || ['Cosecha Nueva'],
        rating: 5.0,
        reviewsCount: 1,
      });
      showToast('Producto creado', `El producto ${productForm.name} ya está en la tienda.`, 'success');
    }
    setIsProductModalOpen(false);
  };

  // --- Handlers for Cafeteria Menu ---
  const handleOpenNewMenuItem = () => {
    setEditingMenuItem(null);
    setMenuItemForm({
      name: '',
      category: 'calientes',
      price: 12000,
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      badges: ['De la Finca'],
      preparationTimeMin: 10,
      isFarmMade: true,
    });
    setIsMenuItemModalOpen(true);
  };

  const handleOpenEditMenuItem = (item: CafeteriaMenuItem) => {
    setEditingMenuItem(item);
    setMenuItemForm({ ...item });
    setIsMenuItemModalOpen(true);
  };

  const handleSaveMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItemForm.name) return;

    if (editingMenuItem) {
      updateMenuItem(editingMenuItem.id, {
        ...menuItemForm,
        price: Number(menuItemForm.price) || 12000,
        preparationTimeMin: Number(menuItemForm.preparationTimeMin) || 10,
      });
    } else {
      addMenuItem({
        name: menuItemForm.name!,
        category: (menuItemForm.category as any) || 'calientes',
        price: Number(menuItemForm.price) || 12000,
        description: menuItemForm.description || '',
        imageUrl: menuItemForm.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        badges: menuItemForm.badges || ['De la Finca'],
        preparationTimeMin: Number(menuItemForm.preparationTimeMin) || 10,
        isFarmMade: menuItemForm.isFarmMade ?? true,
      });
    }
    setIsMenuItemModalOpen(false);
  };

  // --- Handlers for Events ---
  const handleOpenNewEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      season: 'Temporada de Cosecha',
      date: '2026-10-15',
      time: '10:00 AM',
      durationHours: 3,
      location: 'Cafetería & Laboratorio de Catación',
      description: '',
      pricePerPerson: 85000,
      capacity: 15,
      bookedSpots: 0,
      included: ['Materiales de catación', 'Café de cortesía', 'Certificado'],
      imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
      availableSlots: [
        { id: `slot-${Date.now()}-1`, date: '2026-10-15', time: '10:00 AM', capacity: 15, bookedSpots: 0, available: true },
        { id: `slot-${Date.now()}-2`, date: '2026-10-22', time: '02:00 PM', capacity: 15, bookedSpots: 0, available: true },
      ],
    });
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt: FarmEvent) => {
    setEditingEvent(evt);
    const slots = evt.availableSlots && evt.availableSlots.length > 0
      ? [...evt.availableSlots]
      : [{ id: `slot-${evt.id}-1`, date: evt.date, time: evt.time, capacity: evt.capacity, bookedSpots: evt.bookedSpots, available: true }];
    setEventForm({ ...evt, availableSlots: slots });
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title) return;

    const slots = eventForm.availableSlots && eventForm.availableSlots.length > 0
      ? eventForm.availableSlots
      : [{ id: `slot-${Date.now()}`, date: eventForm.date || '2026-10-15', time: eventForm.time || '10:00 AM', capacity: eventForm.capacity || 15, bookedSpots: 0, available: true }];

    const firstSlot = slots[0];
    const finalDate = firstSlot?.date || eventForm.date || '2026-10-15';
    const finalTime = firstSlot?.time || eventForm.time || '10:00 AM';

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...eventForm,
        date: finalDate,
        time: finalTime,
        availableSlots: slots,
      });
      showToast('Evento actualizado', `Se actualizaron los datos y las ${slots.length} fechas disponibles de ${eventForm.title}`, 'success');
    } else {
      addEvent({
        title: eventForm.title!,
        season: eventForm.season as any || 'Temporada de Cosecha',
        subtitle: eventForm.subtitle || 'Experiencia en Hacienda Monteverde',
        date: finalDate,
        time: finalTime,
        durationHours: Number(eventForm.durationHours) || 3,
        location: eventForm.location || 'Finca Monteverde',
        description: eventForm.description || '',
        fullDetails: eventForm.fullDetails || eventForm.description || '',
        pricePerPerson: Number(eventForm.pricePerPerson) || 85000,
        capacity: Number(eventForm.capacity) || 20,
        bookedSpots: 0,
        included: eventForm.included || ['Ingreso', 'Degustación'],
        imageUrl: eventForm.imageUrl || 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80',
        availableSlots: slots,
        status: 'active',
      });
      showToast('Evento creado', `El evento ${eventForm.title} con ${slots.length} fechas disponibles está publicado.`, 'success');
    }
    setIsEventModalOpen(false);
  };

  // --- Handlers for Categories ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;
    const catId = newCatName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    addCategory({
      id: catId,
      name: newCatName,
      description: newCatDesc,
      subcategories: [],
    });
    setNewCatName('');
    setNewCatDesc('');
    setIsCategoryModalOpen(false);
    showToast('Categoría creada', `Categoría ${newCatName} agregada.`, 'success');
  };

  const handleSaveSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCatName) return;
    const subId = `${subCatParentId}-${newSubCatName.toLowerCase().replace(/\s+/g, '-')}`;
    addSubCategory(subCatParentId, {
      id: subId,
      name: newSubCatName,
      categoryId: subCatParentId,
    });
    setNewSubCatName('');
    setIsSubCatModalOpen(false);
    showToast('Subcategoría creada', `Subcategoría ${newSubCatName} agregada.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-[#0F172A] text-white p-6 sm:p-8 rounded-[32px] shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#6F4E37] text-white uppercase tracking-wider">
              Consola de Administración
            </span>
            <span className="text-xs text-slate-400">Panel Central de la Finca Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-2 tracking-tight">
            Dashboard Administrativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Gestiona productos, categorías, cotizaciones mayoristas, creador de eventos y agendamientos pro.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenNewProduct}
            className="px-5 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Producto</span>
          </button>
          <button
            onClick={handleOpenNewEvent}
            className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 cursor-pointer border border-slate-700"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Crear Evento</span>
          </button>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#6F4E37] opacity-20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Productos en Catálogo</span>
            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#6F4E37]">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalProductsCount}</p>
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#6F4E37]/10 text-[#6F4E37]">
            Categorías café y miel
          </span>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cotizaciones B2B</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{quotes.length}</p>
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
            {pendingQuotesCount} pendientes
          </span>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reservas Agendadas</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{totalBookingsCount}</p>
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
            Eventos de temporada
          </span>
        </div>

        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recaudo Eventos Pro</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">{formatCOP(totalBookedRevenue)}</p>
          <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
            Transacciones liquidadas
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#6F4E37] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>CRUD Productos ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories'
              ? 'bg-[#6F4E37] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Categorías & Subcategorías</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'events'
              ? 'bg-[#6F4E37] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Creador de Eventos ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'quotes'
              ? 'bg-[#6F4E37] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cotizaciones Mayoristas ({quotes.length})</span>
          {pendingQuotesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-[#6F4E37] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Reservas & Pases QR ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cafeteria')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'cafeteria'
              ? 'bg-[#6F4E37] text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Menú Cafetería ({cafeteriaMenu.length})</span>
        </button>
      </div>

      {/* 1. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Catálogo de Productos</h3>
              <p className="text-xs text-slate-400">Crea, edita precios unitarios y precios mayoristas mínimos.</p>
            </div>
            <button
              onClick={handleOpenNewProduct}
              className="px-5 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Producto</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6">Precio Detal</th>
                  <th className="py-4 px-6">Precio Mayorista</th>
                  <th className="py-4 px-6">Min. Mayorista</th>
                  <th className="py-4 px-6">Stock</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-11 h-11 rounded-2xl object-cover shrink-0"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{prod.name}</span>
                        <span className="text-[10px] text-slate-400">{prod.unitPresentation}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#6F4E37]/10 text-[#6F4E37]">
                        {prod.categoryId} / {prod.subCategoryId}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatCOP(prod.priceUnit)}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#6F4E37]">
                      {formatCOP(prod.wholesalePriceMin)}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">
                      {prod.minWholesaleQuantity} uds
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        prod.stock > 10 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {prod.stock} disp.
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditProduct(prod)}
                        className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar ${prod.name}?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-2 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. CATEGORIES & SUBCATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Categorías & Subcategorías del Marketplace</h3>
              <p className="text-xs text-slate-400">Organiza el árbol de clasificación para los filtros de la tienda.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Categoría</span>
              </button>
              <button
                onClick={() => setIsSubCatModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nueva Subcategoría</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 block uppercase">ID: {cat.id}</span>
                    <h4 className="text-base font-bold text-slate-900">{cat.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{cat.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#6F4E37]/10 text-[#6F4E37]">
                    {cat.subcategories.length} subcategorías
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Subcategorías registradas:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-2"
                      >
                        <span>{sub.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({sub.id})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. EVENTS CREATOR & PRO SCHEDULING TAB */}
      {activeTab === 'events' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Creador de Eventos & Agendamiento Pro</h3>
              <p className="text-xs text-slate-400">Crea talleres de catación, rutas apícolas y fechas de temporada.</p>
            </div>
            <button
              onClick={handleOpenNewEvent}
              className="px-5 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nuevo Evento</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Evento</th>
                  <th className="py-4 px-6">Temporada</th>
                  <th className="py-4 px-6">Fecha & Hora</th>
                  <th className="py-4 px-6">Ubicación</th>
                  <th className="py-4 px-6">Precio / Persona</th>
                  <th className="py-4 px-6">Cupos</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <img
                        src={evt.imageUrl}
                        alt={evt.title}
                        className="w-11 h-11 rounded-2xl object-cover shrink-0"
                      />
                      <span className="font-bold text-slate-900">{evt.title}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#6F4E37]/10 text-[#6F4E37]">
                        {evt.season}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          {evt.availableSlots && evt.availableSlots.length > 0 ? `${evt.availableSlots.length} fechas disponibles` : '1 fecha'}
                        </span>
                      </div>
                      <span className="font-medium text-slate-800 block">{evt.date}</span>
                      <span className="text-[10px] text-slate-400">{evt.time}</span>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-600">{evt.location}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {formatCOP(evt.pricePerPerson)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-slate-900">{evt.bookedSpots}</span> / {evt.capacity}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditEvent(evt)}
                        className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        title="Editar Evento"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar evento ${evt.title}?`)) {
                            deleteEvent(evt.id);
                          }
                        }}
                        className="p-2 rounded-full text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                        title="Eliminar Evento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. WHOLESALE QUOTES RECEIVED TAB */}
      {activeTab === 'quotes' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 font-display">Solicitudes de Cotización Mayorista</h3>
            <p className="text-xs text-slate-400">Registros capturados en el formulario B2B para atención comercial.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Código & Cliente</th>
                  <th className="py-4 px-6">Fecha Solicitud / Entrega Deseada</th>
                  <th className="py-4 px-6">Empresa / Ciudad</th>
                  <th className="py-4 px-6">Producto Solicitado</th>
                  <th className="py-4 px-6">Cantidad</th>
                  <th className="py-4 px-6">Total Estimado</th>
                  <th className="py-4 px-6">Estado</th>
                  <th className="py-4 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotes.map((q) => {
                  const statusColors: Record<string, string> = {
                    pendiente: 'bg-amber-50 text-amber-800 border border-amber-200',
                    contactado: 'bg-blue-50 text-blue-800 border border-blue-200',
                    cotizado: 'bg-purple-50 text-purple-800 border border-purple-200',
                    cerrado: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
                  };

                  const createdFormatted = q.createdAt ? new Date(q.createdAt).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/D';

                  return (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-[10px] text-[#6F4E37] font-bold block">{q.id}</span>
                        <strong className="text-slate-900 block">{q.customerName}</strong>
                        <span className="text-[10px] text-slate-400">{q.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-700 font-medium block">
                            📅 <span className="text-slate-500 text-[10px]">Generada:</span> <strong>{createdFormatted}</strong>
                          </span>
                          <span className="text-[11px] text-amber-900 font-bold block bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                            🚚 <span className="text-amber-700 text-[10px]">Entrega deseada:</span> {q.targetDate || 'No especificada'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-800 block">{q.companyName || 'N/A'}</span>
                        <span className="text-[10px] text-slate-400">{q.city}</span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-900">
                        {q.productName}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {q.requestedQuantity} uds / kg
                      </td>
                      <td className="py-4 px-6 font-black text-slate-900">
                        {formatCOP(q.estimatedTotal)}
                      </td>
                      <td className="py-4 px-6">
                        <select
                          value={q.status}
                          onChange={(e) => updateQuoteStatus(q.id, e.target.value as any)}
                          className={`py-1 px-3 rounded-full text-[10px] font-bold border-0 cursor-pointer ${
                            statusColors[q.status] || 'bg-slate-100'
                          }`}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="contactado">Contactado</option>
                          <option value="cotizado">Cotizado</option>
                          <option value="cerrado">Cerrado</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedQuoteDetail(q)}
                          className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold cursor-pointer transition-colors"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 font-display">Reservas de Eventos Registradas</h3>
            <p className="text-xs text-slate-400">Agendamientos pro pagados por clientes a través de la plataforma.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-4 px-6">Código & Asistente</th>
                  <th className="py-4 px-6">Evento Reservado</th>
                  <th className="py-4 px-6">Fecha & Hora</th>
                  <th className="py-4 px-6">Cupos</th>
                  <th className="py-4 px-6">Total Pagado</th>
                  <th className="py-4 px-6">Método de Pago</th>
                  <th className="py-4 px-6">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-[10px] text-[#6F4E37] font-bold block">{b.id}</span>
                      <strong className="text-slate-900 block">{b.customerName}</strong>
                      <span className="text-[10px] text-slate-400">{b.customerEmail} • {b.customerPhone}</span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {b.eventTitle}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-800 block">{b.eventDate}</span>
                      <span className="text-[10px] text-slate-400">{b.eventTime}</span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800">
                      {b.attendeesCount} cupos
                    </td>
                    <td className="py-4 px-6 font-bold text-emerald-700">
                      {formatCOP(b.totalPaid)}
                    </td>
                    <td className="py-4 px-6 uppercase text-[10px] font-semibold text-slate-500">
                      {b.paymentMethod}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {b.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. CAFETERIA MENU TAB (FULL CRUD) */}
      {activeTab === 'cafeteria' && (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden space-y-6">
          <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-slate-900 font-display">Platos & Bebidas de la Cafetería (CRUD Activo)</h3>
              <p className="text-xs text-slate-400">Administra toda la carta en tiempo real. Los cambios se reflejan inmediatamente en la vista de cafetería.</p>
            </div>
            <button
              onClick={handleOpenNewMenuItem}
              className="px-5 py-2.5 rounded-full bg-[#6F4E37] text-white font-bold text-xs hover:bg-[#5C3F2C] transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Ítem de Carta</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 sm:p-8">
            {cafeteriaMenu.map((item) => (
              <div key={item.id} className="p-4 rounded-[24px] border border-slate-100 shadow-xs flex flex-col justify-between hover:shadow-md transition-all bg-white group space-y-3">
                <div className="flex gap-3.5 items-start">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-amber-100" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-[#3E2714] inline-block uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{item.description}</p>
                    <span className="text-sm font-black text-[#6F4E37] mt-1.5 block font-display">{formatCOP(item.price)}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Prep: {item.preparationTimeMin} min {item.isFarmMade ? '• De la Finca' : ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditMenuItem(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#6F4E37] hover:bg-slate-100 transition cursor-pointer"
                      title="Editar Ítem"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar "${item.name}" de la carta de cafetería?`)) {
                          deleteMenuItem(item.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Eliminar Ítem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: PRODUCT CREATE / EDIT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 font-display">
                {editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={productForm.name || ''}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoría</label>
                  <select
                    value={productForm.categoryId || 'cafe'}
                    onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Presentación (Etiqueta)</label>
                  <input
                    type="text"
                    value={productForm.unitLabel || ''}
                    onChange={(e) => setProductForm({ ...productForm, unitLabel: e.target.value })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                    placeholder="Bolsa 340g / Frasco 500g"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Precio Unitario ($) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.priceUnit || 35000}
                    onChange={(e) => setProductForm({ ...productForm, priceUnit: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Precio Mayorista ($) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.wholesalePriceMin || 22000}
                    onChange={(e) => setProductForm({ ...productForm, wholesalePriceMin: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Min. Mayorista</label>
                  <input
                    type="number"
                    value={productForm.minWholesaleQuantity || 20}
                    onChange={(e) => setProductForm({ ...productForm, minWholesaleQuantity: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Stock (Unidades) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={productForm.stock ?? 50}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition font-bold text-slate-900"
                  />
                </div>
              </div>

              <ImageUploader
                label="Fotografía del Producto (Cloudflare R2)"
                folder="products"
                value={productForm.imageUrl || ''}
                onChange={(url) => setProductForm({ ...productForm, imageUrl: url })}
                aspectHint="Sube tu foto de producto. Se optimizará y guardará en Cloudflare R2 sin saturar la base de datos."
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition shadow-sm"
                >
                  {editingProduct ? 'Actualizar Producto' : 'Guardar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EVENT CREATE / EDIT */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-lg text-slate-900 font-display">
                  {editingEvent ? 'Editar Evento de Temporada' : 'Crear Evento en la Finca'}
                </h3>
                <p className="text-xs text-slate-400">Configura los detalles y las fechas disponibles para que el cliente escoja al reservar.</p>
              </div>
              <button onClick={() => setIsEventModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Título del Evento *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title || ''}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Temporada</label>
                  <select
                    value={eventForm.season || 'Temporada de Cosecha'}
                    onChange={(e) => setEventForm({ ...eventForm, season: e.target.value as any })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  >
                    <option value="Temporada de Cosecha">Temporada de Cosecha</option>
                    <option value="Temporada de Floración">Temporada de Floración</option>
                    <option value="Temporada Seca / Verano">Temporada Seca / Verano</option>
                    <option value="Temporada Anual">Temporada Anual</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Precio / Persona ($ COP)</label>
                  <input
                    type="number"
                    value={eventForm.pricePerPerson || 85000}
                    onChange={(e) => setEventForm({ ...eventForm, pricePerPerson: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* SECCIÓN CLAVE SOLICITADA POR EL USUARIO: GESTIÓN DE FECHAS Y HORAS DISPONIBLES */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#6F4E37]" />
                      Fechas y Horarios Disponibles para que el Cliente Escoja *
                    </label>
                    <p className="text-[11px] text-slate-600">
                      Agrega aquí las fechas y horas que tendrás disponibles. El cliente elegirá una de ellas al reservar.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentSlots = eventForm.availableSlots || [];
                      const nextDate = new Date();
                      nextDate.setDate(nextDate.getDate() + 7 + currentSlots.length * 3);
                      const yyyy = nextDate.getFullYear();
                      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
                      const dd = String(nextDate.getDate()).padStart(2, '0');
                      const newSlot: EventScheduleSlot = {
                        id: `slot-${Date.now()}`,
                        date: `${yyyy}-${mm}-${dd}`,
                        time: '10:00 AM',
                        capacity: eventForm.capacity || 15,
                        bookedSpots: 0,
                        available: true,
                        notes: 'Jornada matutina',
                      };
                      setEventForm({
                        ...eventForm,
                        availableSlots: [...currentSlots, newSlot],
                      });
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#6F4E37] text-white text-[11px] font-bold hover:bg-[#5C3F2C] transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Agregar Fecha</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {(eventForm.availableSlots || []).map((slot, index) => (
                    <div
                      key={slot.id || index}
                      className="p-3 bg-white rounded-xl border border-amber-200/60 shadow-2xs flex flex-wrap sm:flex-nowrap items-center gap-2"
                    >
                      <div className="w-full sm:w-5/12">
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Fecha Disponible</label>
                        <input
                          type="date"
                          required
                          value={slot.date}
                          onChange={(e) => {
                            const updated = (eventForm.availableSlots || []).map((s, i) =>
                              i === index ? { ...s, date: e.target.value } : s
                            );
                            setEventForm({ ...eventForm, availableSlots: updated });
                          }}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#6F4E37]"
                        />
                      </div>

                      <div className="w-full sm:w-4/12">
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Hora (ej. 10:00 AM)</label>
                        <input
                          type="text"
                          required
                          value={slot.time}
                          onChange={(e) => {
                            const updated = (eventForm.availableSlots || []).map((s, i) =>
                              i === index ? { ...s, time: e.target.value } : s
                            );
                            setEventForm({ ...eventForm, availableSlots: updated });
                          }}
                          placeholder="10:00 AM"
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#6F4E37]"
                        />
                      </div>

                      <div className="w-1/2 sm:w-2/12">
                        <label className="text-[10px] font-bold text-slate-600 block mb-0.5">Cupos</label>
                        <input
                          type="number"
                          min={1}
                          value={slot.capacity || eventForm.capacity || 15}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = (eventForm.availableSlots || []).map((s, i) =>
                              i === index ? { ...s, capacity: val } : s
                            );
                            setEventForm({ ...eventForm, availableSlots: updated });
                          }}
                          className="w-full p-2 text-xs rounded-lg border border-slate-200 focus:ring-1 focus:ring-[#6F4E37]"
                        />
                      </div>

                      <div className="w-auto flex items-center justify-end pt-2 sm:pt-4">
                        <button
                          type="button"
                          disabled={(eventForm.availableSlots || []).length <= 1}
                          onClick={() => {
                            const updated = (eventForm.availableSlots || []).filter((_, i) => i !== index);
                            setEventForm({ ...eventForm, availableSlots: updated });
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition disabled:opacity-20 cursor-pointer"
                          title="Eliminar esta fecha"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Capacidad Total Global (Cupos)</label>
                  <input
                    type="number"
                    value={eventForm.capacity || 20}
                    onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Duración (Horas)</label>
                  <input
                    type="number"
                    value={eventForm.durationHours || 3}
                    onChange={(e) => setEventForm({ ...eventForm, durationHours: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ubicación en la Finca</label>
                <input
                  type="text"
                  value={eventForm.location || 'Mirador & Cafetería de la Finca'}
                  onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                />
              </div>

              <ImageUploader
                label="Foto de Portada de la Experiencia (Cloudflare R2)"
                folder="events"
                value={eventForm.imageUrl || ''}
                onChange={(url) => setEventForm({ ...eventForm, imageUrl: url })}
                aspectHint="Sube una fotografía de la cata, taller o paisaje. Se optimizará y guardará en Cloudflare R2."
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descripción de la Experiencia</label>
                <textarea
                  rows={2}
                  value={eventForm.description || ''}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition shadow-sm"
                >
                  {editingEvent ? 'Actualizar Evento' : 'Publicar Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE CATEGORY */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 font-display">Crear Nueva Categoría</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre de la Categoría</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Ej. Cacao & Chocolates de Finca"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descripción</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Breve descripción..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition shadow-sm"
                >
                  Guardar Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE SUBCATEGORY */}
      {isSubCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-slate-900 font-display">Crear Nueva Subcategoría</h3>
            <form onSubmit={handleSaveSubCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Categoría Padre</label>
                <select
                  value={subCatParentId}
                  onChange={(e) => setSubCatParentId(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 font-semibold focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre de la Subcategoría</label>
                <input
                  type="text"
                  required
                  value={newSubCatName}
                  onChange={(e) => setNewSubCatName(e.target.value)}
                  placeholder="Ej. Café en Cápsulas Biodegradables"
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubCatModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition shadow-sm"
                >
                  Guardar Subcategoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QUOTE DETAIL VIEW */}
      {selectedQuoteDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-[#6F4E37] font-bold">RADICADO {selectedQuoteDetail.id}</span>
                <h3 className="font-bold text-lg text-slate-900 font-display">{selectedQuoteDetail.productName}</h3>
              </div>
              <button onClick={() => setSelectedQuoteDetail(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cliente:</span>
                  <strong className="text-slate-900">{selectedQuoteDetail.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Empresa:</span>
                  <strong className="text-slate-900">{selectedQuoteDetail.companyName || 'Persona Natural'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Contacto:</span>
                  <span>{selectedQuoteDetail.email} • {selectedQuoteDetail.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ciudad de entrega:</span>
                  <span>{selectedQuoteDetail.city}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-bold">Fecha de Generación:</span>
                    <strong className="text-slate-800">
                      {selectedQuoteDetail.createdAt ? new Date(selectedQuoteDetail.createdAt).toLocaleString('es-CO') : 'No registrada'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-amber-800 block font-bold">Fecha Deseada de Entrega:</span>
                    <strong className="text-amber-950 bg-amber-100/70 px-2 py-0.5 rounded-md inline-block">
                      {selectedQuoteDetail.targetDate || 'A convenir'}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Cantidad Requerida</span>
                  <strong className="text-base text-slate-900 font-display mt-1 block">{selectedQuoteDetail.requestedQuantity} uds</strong>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 bg-white">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Total Estimado</span>
                  <strong className="text-base text-emerald-700 font-display mt-1 block">{formatCOP(selectedQuoteDetail.estimatedTotal)}</strong>
                </div>
              </div>

              {selectedQuoteDetail.comments && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900">
                  <strong className="font-bold">Comentarios del cliente:</strong>
                  <p className="mt-1">{selectedQuoteDetail.comments}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedQuoteDetail(null)}
                className="px-6 py-2.5 rounded-full bg-[#0F172A] text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CAFETERIA MENU ITEM CREATE / EDIT */}
      {isMenuItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 font-display">
                {editingMenuItem ? 'Editar Ítem de Cafetería' : 'Crear Plato o Bebida de Cafetería'}
              </h3>
              <button onClick={() => setIsMenuItemModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Plato / Bebida *</label>
                <input
                  type="text"
                  required
                  value={menuItemForm.name || ''}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, name: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  placeholder="Ej. Tinto Campesino con Miel, Waffle de Yuca..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Categoría de Carta *</label>
                  <select
                    value={menuItemForm.category || 'calientes'}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, category: e.target.value as any })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  >
                    <option value="calientes">Bebidas Calientes</option>
                    <option value="frias">Bebidas Frías</option>
                    <option value="pasteleria">Repostería & Miel</option>
                    <option value="brunch">Brunch & Platos Fuertes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Precio al Público ($ COP) *</label>
                  <input
                    type="number"
                    required
                    value={menuItemForm.price || 12000}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, price: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Tiempo de Prep. (Minutos)</label>
                  <input
                    type="number"
                    value={menuItemForm.preparationTimeMin || 10}
                    onChange={(e) => setMenuItemForm({ ...menuItemForm, preparationTimeMin: Number(e.target.value) })}
                    className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={!!menuItemForm.isFarmMade}
                      onChange={(e) => setMenuItemForm({ ...menuItemForm, isFarmMade: e.target.checked })}
                      className="w-4 h-4 text-[#6F4E37] rounded-sm"
                    />
                    <span>Elaborado en la Finca</span>
                  </label>
                </div>
              </div>

              <ImageUploader
                label="Foto del Plato o Bebida (Cloudflare R2)"
                folder="cafeteria"
                value={menuItemForm.imageUrl || ''}
                onChange={(url) => setMenuItemForm({ ...menuItemForm, imageUrl: url })}
                aspectHint="Sube la foto del plato/bebida. Se comprimirá a WebP y alojará en Cloudflare R2."
              />

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Descripción / Ingredientes</label>
                <textarea
                  rows={2}
                  value={menuItemForm.description || ''}
                  onChange={(e) => setMenuItemForm({ ...menuItemForm, description: e.target.value })}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6F4E37] focus:outline-none transition"
                  placeholder="Breve reseña del método de preparación o sabor..."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMenuItemModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#6F4E37] text-white text-xs font-bold hover:bg-[#5C3F2C] transition shadow-sm cursor-pointer"
                >
                  {editingMenuItem ? 'Actualizar Ítem' : 'Guardar Ítem'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
