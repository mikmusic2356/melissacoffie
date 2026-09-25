import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Category,
  Product,
  FarmEvent,
  EventBooking,
  WholesaleQuoteRequest,
  CafeteriaMenuItem,
  CartItem,
  GeneratedAIImage,
  RetailOrder,
  OrderStatus,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_EVENTS,
  INITIAL_CAFETERIA_MENU,
  INITIAL_QUOTES,
  INITIAL_BOOKINGS,
  INITIAL_ORDERS,
} from '../data/initialData';

export type ActiveView =
  | 'inicio'
  | 'tienda'
  | 'cotizaciones'
  | 'eventos'
  | 'cafeteria'
  | 'nosotros'
  | 'contacto'
  | 'politicas'
  | 'mis-reservas'
  | 'admin';

export type AdminTab =
  | 'resumen'
  | 'productos'
  | 'categorias'
  | 'eventos'
  | 'pedidos'
  | 'cotizaciones'
  | 'reservas'
  | 'ia-estudio';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

interface AppContextType {
  // Navigation
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Admin 3-Factor Authentication
  isAdminAuthenticated: boolean;
  adminLogin: (username: string, password: string, masterKey: string) => { success: boolean; error?: string };
  adminLogout: () => void;

  // Share link helper
  copyShareLink: (pathOrHash: string, label: string) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Categories & Subcategories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addSubCategory: (categoryId: string, name: string, description?: string) => void;
  deleteSubCategory: (categoryId: string, subId: string) => void;

  // Events
  events: FarmEvent[];
  addEvent: (event: Omit<FarmEvent, 'id' | 'bookedSpots'>) => void;
  updateEvent: (id: string, updates: Partial<FarmEvent>) => void;
  deleteEvent: (id: string) => void;

  // Bookings
  bookings: EventBooking[];
  createBooking: (bookingData: Omit<EventBooking, 'id' | 'bookingDate' | 'qrCodeMock' | 'status'>) => EventBooking;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: EventBooking['status']) => void;

  // Quotes
  quotes: WholesaleQuoteRequest[];
  createQuoteRequest: (quoteData: Omit<WholesaleQuoteRequest, 'id' | 'status' | 'createdAt'>) => WholesaleQuoteRequest;
  updateQuoteStatus: (quoteId: string, status: WholesaleQuoteRequest['status']) => void;

  // Cafeteria Menu
  cafeteriaMenu: CafeteriaMenuItem[];
  addMenuItem: (item: Omit<CafeteriaMenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<CafeteriaMenuItem>) => void;
  deleteMenuItem: (id: string) => void;

  // Retail Orders (Pedidos por Unidad / Contraentrega)
  orders: RetailOrder[];
  createOrder: (orderData: Omit<RetailOrder, 'id' | 'createdAt'>) => Promise<RetailOrder>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, purchaseType?: 'unit' | 'wholesale') => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Modal helpers
  selectedProductForQuote: Product | null;
  setSelectedProductForQuote: (product: Product | null) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  selectedEventForBooking: FarmEvent | null;
  setSelectedEventForBooking: (event: FarmEvent | null) => void;

  // AI Images
  generatedImages: GeneratedAIImage[];
  addGeneratedImage: (img: GeneratedAIImage) => void;

  // User Profile & Email / Cédula Consultation (No registration needed)
  currentUser: {
    name: string;
    email: string;
    phone: string;
  };
  lastConsultedEmail: string;
  setLastConsultedEmail: (email: string) => void;
  lastConsultedCedula: string;
  setLastConsultedCedula: (cedula: string) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'finca_products_v2',
  CATEGORIES: 'finca_categories_v2',
  EVENTS: 'finca_events_v2',
  BOOKINGS: 'finca_bookings_v2',
  QUOTES: 'finca_quotes_v2',
  IMAGES: 'finca_ai_images_v2',
  CAFETERIA: 'finca_cafeteria_menu_v2',
  ORDERS: 'finca_orders_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('inicio');
  const [adminTab, setAdminTab] = useState<AdminTab>('resumen');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Admin 3-Factor Authentication
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('melifera_admin_session') === 'true';
  });

  const adminLogin = (user: string, pass: string, masterKey: string) => {
    const validUsers = ['melifera_admin', 'melifera', 'admin@meliferacoffee.com', 'admin'];
    const validPass = 'Melifera2026*';
    const validMasterKey = 'MLF-MASTER-885';

    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanKey = masterKey.trim();

    if (!validUsers.includes(cleanUser)) {
      return { success: false, error: 'Usuario administrador incorrecto' };
    }
    if (cleanPass !== validPass) {
      return { success: false, error: 'Contraseña de administrador incorrecta' };
    }
    if (cleanKey !== validMasterKey) {
      return { success: false, error: 'Llave Maestra de Seguridad incorrecta o inválida' };
    }

    sessionStorage.setItem('melifera_admin_session', 'true');
    setIsAdminAuthenticated(true);
    showToast('Acceso Concedido', 'Sesión administrativa iniciada con Llave Maestra validada.', 'success');
    return { success: true };
  };

  const adminLogout = () => {
    sessionStorage.removeItem('melifera_admin_session');
    setIsAdminAuthenticated(false);
    setActiveView('inicio');
    window.location.hash = '#inicio';
    showToast('Sesión Cerrada', 'Has cerrado la sesión de administración de forma segura.', 'info');
  };

  const copyShareLink = (pathOrHash: string, label: string) => {
    const cleanHash = pathOrHash.startsWith('#') ? pathOrHash : `#${pathOrHash.replace(/^\//, '')}`;
    const fullUrl = `${window.location.origin}${window.location.pathname}${cleanHash}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        showToast('Enlace Copiado', `Enlace de "${label}" copiado al portapapeles. Listo para compartir.`, 'success');
      }).catch(() => {
        showToast('Enlace para compartir', fullUrl, 'info');
      });
    } else {
      showToast('Enlace para compartir', fullUrl, 'info');
    }
  };

  // Modal helpers
  const [selectedProductForQuote, setSelectedProductForQuote] = useState<Product | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedEventForBooking, setSelectedEventForBooking] = useState<FarmEvent | null>(null);

  // User details & Document Consultation
  const [currentUser] = useState({
    name: 'Camila Ospina',
    email: 'camila.ospina@gmail.com',
    phone: '+57 315 789 4512',
  });

  const [lastConsultedEmail, setLastConsultedEmailState] = useState<string>(() => {
    return localStorage.getItem('finca_last_email') || 'camila.ospina@gmail.com';
  });

  const setLastConsultedEmail = (email: string) => {
    setLastConsultedEmailState(email);
    if (email) {
      localStorage.setItem('finca_last_email', email);
    }
  };

  const [lastConsultedCedula, setLastConsultedCedulaState] = useState<string>(() => {
    return localStorage.getItem('finca_last_cedula') || '1020456789';
  });

  const setLastConsultedCedula = (cedula: string) => {
    setLastConsultedCedulaState(cedula);
    if (cedula) {
      localStorage.setItem('finca_last_cedula', cedula);
    }
  };

  // Load from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [events, setEvents] = useState<FarmEvent[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EVENTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((e: FarmEvent) => {
          if (!e.availableSlots || e.availableSlots.length === 0) {
            const initialMatch = INITIAL_EVENTS.find((ie) => ie.id === e.id);
            return {
              ...e,
              availableSlots: initialMatch?.availableSlots || [
                { id: `slot-${e.id}-1`, date: e.date, time: e.time, capacity: e.capacity, bookedSpots: e.bookedSpots, available: true }
              ]
            };
          }
          return e;
        });
      } catch (err) {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [bookings, setBookings] = useState<EventBooking[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [quotes, setQuotes] = useState<WholesaleQuoteRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.QUOTES);
    return saved ? JSON.parse(saved) : INITIAL_QUOTES;
  });

  const [orders, setOrders] = useState<RetailOrder[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedAIImage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.IMAGES);
    return saved ? JSON.parse(saved) : [];
  });

  const [cafeteriaMenu, setCafeteriaMenu] = useState<CafeteriaMenuItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CAFETERIA);
    return saved ? JSON.parse(saved) : INITIAL_CAFETERIA_MENU;
  });
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch all initial data from Turso database on app mount
  useEffect(() => {
    async function loadTursoData() {
      try {
        const [prodRes, catRes, evtRes, bookRes, quoteRes, menuRes, orderRes] = await Promise.all([
          fetch('/api/products').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/categories').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/events').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/bookings').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/quotes').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/cafeteria-menu').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/orders').then((r) => (r.ok ? r.json() : null)),
        ]);

        if (prodRes && prodRes.length > 0) setProducts(prodRes);
        if (catRes && catRes.length > 0) setCategories(catRes);
        if (evtRes && evtRes.length > 0) setEvents(evtRes);
        if (bookRes && bookRes.length > 0) setBookings(bookRes);
        if (quoteRes && quoteRes.length > 0) setQuotes(quoteRes);
        if (menuRes && menuRes.length > 0) setCafeteriaMenu(menuRes);
        if (orderRes && orderRes.length > 0) setOrders(orderRes);
        console.log('⚡ Turso DB synchronized into AppContext state!');
      } catch (loadErr) {
        console.warn('Using cached local storage while connecting to Turso:', loadErr);
      }
    }

    loadTursoData();
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
  }, [quotes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.IMAGES, JSON.stringify(generatedImages));
  }, [generatedImages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CAFETERIA, JSON.stringify(cafeteriaMenu));
  }, [cafeteriaMenu]);

  // Bidirectional URL route sync (Supports #hash, pathname and query parameters)
  useEffect(() => {
    const syncRouteFromLocation = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').trim();
      const path = window.location.pathname.replace(/^\//, '').trim();
      const searchParams = new URLSearchParams(window.location.search);

      const target = hash || path;
      const targetLower = target.toLowerCase();

      // Check admin discreet route
      if (targetLower === 'admincoffe' || targetLower === 'admin' || targetLower.startsWith('admincoffe')) {
        setActiveView('admin');
        return;
      }

      // Check for shareable product link (e.g. #producto/p-1, /producto/p-1, or ?producto=p-1)
      const productQuery = searchParams.get('producto') || searchParams.get('product');
      if (targetLower.startsWith('producto/') || targetLower.startsWith('product/') || productQuery) {
        const prodId = productQuery || target.split('/')[1];
        if (prodId) {
          const found = products.find((p) => p.id.toLowerCase() === prodId.toLowerCase());
          setActiveView('tienda');
          if (found) {
            setSelectedProductForDetail(found);
          }
        }
        return;
      }

      // Check for shareable event link (e.g. #evento/ev-1, /evento/ev-1, or ?evento=ev-1)
      const eventQuery = searchParams.get('evento') || searchParams.get('event');
      if (targetLower.startsWith('evento/') || targetLower.startsWith('event/') || eventQuery) {
        const evtId = eventQuery || target.split('/')[1];
        if (evtId) {
          const found = events.find((e) => e.id.toLowerCase() === evtId.toLowerCase());
          setActiveView('eventos');
          if (found) {
            setSelectedEventForBooking(found);
          }
        }
        return;
      }

      // Check for cafeteria menu link
      if (targetLower === 'menu-cafeteria' || targetLower === 'menu' || targetLower === 'carta') {
        setActiveView('cafeteria');
        setTimeout(() => {
          const el = document.getElementById('menu-carta') || document.getElementById('carta-menu');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 250);
        return;
      }

      // Standard public views
      if (targetLower === 'tienda' || targetLower === 'catalogo' || targetLower === 'cafe' || targetLower === 'miel') {
        setActiveView('tienda');
      } else if (targetLower === 'eventos' || targetLower === 'catas' || targetLower === 'experiencias') {
        setActiveView('eventos');
      } else if (targetLower === 'cotizaciones' || targetLower === 'mayoristas' || targetLower === 'b2b') {
        setActiveView('cotizaciones');
      } else if (targetLower === 'cafeteria') {
        setActiveView('cafeteria');
      } else if (targetLower === 'nosotros' || targetLower === 'origen' || targetLower === 'finca') {
        setActiveView('nosotros');
      } else if (targetLower === 'contacto' || targetLower === 'ubicacion') {
        setActiveView('contacto');
      } else if (targetLower === 'mis-reservas' || targetLower === 'consultar' || targetLower === 'pedidos') {
        setActiveView('mis-reservas');
      } else if (targetLower === 'privacidad' || targetLower === 'politicas') {
        setActiveView('politicas');
      } else if (targetLower === 'inicio' || targetLower === '') {
        setActiveView('inicio');
      }
    };

    syncRouteFromLocation();
    window.addEventListener('hashchange', syncRouteFromLocation);
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromLocation);
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, [products, events]);

  // Toast handler
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product CRUD
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const product: Product = { ...newProd, id };
    setProducts((prev) => [product, ...prev]);
    showToast('Producto Creado', `Se ha publicado "${product.name}" en el marketplace.`);

    // Persist to Turso DB
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }).catch((err) => console.warn('Turso sync error (addProduct):', err));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updatedList = prev.map((p) => (p.id === id ? { ...p, ...updates } : p));
      const target = updatedList.find((p) => p.id === id);
      if (target) {
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch((err) => console.warn('Turso sync error (updateProduct):', err));
      }
      return updatedList;
    });
    showToast('Producto Actualizado', 'Los cambios se han guardado exitosamente.');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Producto Eliminado', 'El producto ha sido retirado del catálogo.', 'warning');
    fetch(`/api/products/${id}`, { method: 'DELETE' }).catch((err) => console.warn('Turso sync error (deleteProduct):', err));
  };

  // Categories CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const id = cat.name.toLowerCase().replace(/\s+/g, '-');
    const newCat: Category = { ...cat, id, subcategories: cat.subcategories || [] };
    setCategories((prev) => [...prev, newCat]);
    showToast('Categoría Creada', `Categoría "${newCat.name}" agregada.`);

    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat),
    }).catch((err) => console.warn('Turso sync error (addCategory):', err));
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      const target = updated.find((c) => c.id === id);
      if (target) {
        fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch((err) => console.warn('Turso sync error (updateCategory):', err));
      }
      return updated;
    });
    showToast('Categoría Modificada', 'Categoría actualizada.');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Categoría Eliminada', 'Se ha eliminado la categoría.', 'warning');
    fetch(`/api/categories/${id}`, { method: 'DELETE' }).catch((err) => console.warn('Turso sync error (deleteCategory):', err));
  };

  const addSubCategory = (categoryId: string, name: string, description?: string) => {
    const subId = `${categoryId}-${Date.now()}`;
    setCategories((prev) => {
      const updated = prev.map((c) => {
        if (c.id === categoryId) {
          const newSubCats = [...c.subcategories, { id: subId, name, categoryId, description }];
          const updatedCat = { ...c, subcategories: newSubCats };
          fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCat),
          }).catch((err) => console.warn('Turso sync error (addSubCategory):', err));
          return updatedCat;
        }
        return c;
      });
      return updated;
    });
    showToast('Subcategoría Agregada', `Nueva subcategoría "${name}" creada.`);
  };

  const deleteSubCategory = (categoryId: string, subId: string) => {
    setCategories((prev) => {
      const updated = prev.map((c) => {
        if (c.id === categoryId) {
          const updatedCat = { ...c, subcategories: c.subcategories.filter((s) => s.id !== subId) };
          fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCat),
          }).catch((err) => console.warn('Turso sync error (deleteSubCategory):', err));
          return updatedCat;
        }
        return c;
      });
      return updated;
    });
    showToast('Subcategoría Eliminada', 'Subcategoría retirada.', 'warning');
  };

  // Events CRUD
  const addEvent = (eventData: Omit<FarmEvent, 'id' | 'bookedSpots'>) => {
    const id = `evt-${Date.now()}`;
    const newEvent: FarmEvent = { ...eventData, id, bookedSpots: 0 };
    setEvents((prev) => [newEvent, ...prev]);
    showToast('Evento Creado', `El evento de temporada "${newEvent.title}" está disponible para agendamiento.`);

    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    }).catch((err) => console.warn('Turso sync error (addEvent):', err));
  };

  const updateEvent = (id: string, updates: Partial<FarmEvent>) => {
    setEvents((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...updates } : e));
      const target = updated.find((e) => e.id === id);
      if (target) {
        fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch((err) => console.warn('Turso sync error (updateEvent):', err));
      }
      return updated;
    });
    showToast('Evento Actualizado', 'Información del evento modificada con éxito.');
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Evento Eliminado', 'Evento retirado del calendario.', 'warning');
    fetch(`/api/events/${id}`, { method: 'DELETE' }).catch((err) => console.warn('Turso sync error (deleteEvent):', err));
  };

  // Bookings
  const createBooking = (bookingData: Omit<EventBooking, 'id' | 'bookingDate' | 'qrCodeMock' | 'status'>): EventBooking => {
    const id = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: EventBooking = {
      ...bookingData,
      id,
      bookingDate: new Date().toISOString(),
      qrCodeMock: `QR-${id}-${bookingData.eventId}`,
      status: 'confirmed',
    };

    if (bookingData.customerEmail) {
      setLastConsultedEmail(bookingData.customerEmail);
    }
    if (bookingData.customerDocument) {
      setLastConsultedCedula(bookingData.customerDocument);
    }

    setBookings((prev) => [newBooking, ...prev]);

    // Persist booking to Turso
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBooking),
    }).catch((err) => console.warn('Turso sync error (createBooking):', err));

    // Update event spots and matching slot spots if applicable
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === bookingData.eventId) {
          const updatedBooked = e.bookedSpots + bookingData.attendeesCount;
          const updatedSlots = e.availableSlots?.map((s) => {
            if (s.date === bookingData.eventDate && s.time === bookingData.eventTime) {
              const currentSlotBooked = s.bookedSpots || 0;
              return { ...s, bookedSpots: currentSlotBooked + bookingData.attendeesCount };
            }
            return s;
          });

          const updatedEvent = {
            ...e,
            bookedSpots: updatedBooked,
            status: updatedBooked >= e.capacity ? ('sold_out' as const) : e.status,
            availableSlots: updatedSlots || e.availableSlots,
          };

          fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
          }).catch((err) => console.warn('Turso sync error (updateEventOnBooking):', err));

          return updatedEvent;
        }
        return e;
      })
    );

    showToast(
      '¡Reserva Confirmada!',
      `Tu agendamiento para "${newBooking.eventTitle}" (${newBooking.attendeesCount} cupos) está listo. Código: ${newBooking.id}`
    );

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...booking, status: 'cancelled' }),
    }).catch((err) => console.warn('Turso sync error (cancelBooking):', err));

    // Restore spots
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === booking.eventId) {
          const updatedBooked = Math.max(0, e.bookedSpots - booking.attendeesCount);
          const updatedEvent = {
            ...e,
            bookedSpots: updatedBooked,
            status: updatedBooked < e.capacity ? ('active' as const) : e.status,
          };
          fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEvent),
          }).catch((err) => console.warn('Turso sync error (restoreEventOnCancel):', err));
          return updatedEvent;
        }
        return e;
      })
    );

    showToast('Reserva Cancelada', `La reserva ${bookingId} ha sido cancelada.`, 'info');
  };

  const updateBookingStatus = (bookingId: string, status: EventBooking['status']) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updated = { ...b, status };
          fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch((err) => console.warn('Turso sync error (updateBookingStatus):', err));
          return updated;
        }
        return b;
      })
    );
    showToast('Estado de Reserva', `Reserva actualizada a estado: ${status}`);
  };

  // Quotes
  const createQuoteRequest = (quoteData: Omit<WholesaleQuoteRequest, 'id' | 'status' | 'createdAt'>): WholesaleQuoteRequest => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `COT-2026-${randomSuffix}`;
    const newQuote: WholesaleQuoteRequest = {
      ...quoteData,
      id,
      status: 'pendiente',
      createdAt: new Date().toISOString(),
    };

    if (quoteData.email) {
      setLastConsultedEmail(quoteData.email.trim().toLowerCase());
    }
    if (quoteData.customerDocument) {
      setLastConsultedCedula(quoteData.customerDocument);
    }

    setQuotes((prev) => [newQuote, ...prev]);

    fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQuote),
    }).catch((err) => console.warn('Turso sync error (createQuoteRequest):', err));

    showToast(
      '¡Cotización Enviada al Administrador!',
      `Hemos registrado tu solicitud para ${newQuote.requestedQuantity} unidades/kg de ${newQuote.productName}. Radicado: ${newQuote.id}`
    );
    return newQuote;
  };

  const updateQuoteStatus = (quoteId: string, status: WholesaleQuoteRequest['status']) => {
    setQuotes((prev) =>
      prev.map((q) => {
        if (q.id === quoteId) {
          const updated = { ...q, status };
          fetch('/api/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updated),
          }).catch((err) => console.warn('Turso sync error (updateQuoteStatus):', err));
          return updated;
        }
        return q;
      })
    );
    showToast('Cotización Actualizada', `Estado de la cotización cambiado a: ${status}`);
  };

  // Cafeteria Menu CRUD
  const addMenuItem = (itemData: Omit<CafeteriaMenuItem, 'id'>) => {
    const id = `cafe-item-${Date.now()}`;
    const newItem: CafeteriaMenuItem = { ...itemData, id };
    setCafeteriaMenu((prev) => [newItem, ...prev]);
    showToast('Plato / Bebida Creado', `"${newItem.name}" ya está visible en la carta de la cafetería.`);

    fetch('/api/cafeteria-menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    }).catch((err) => console.warn('Turso sync error (addMenuItem):', err));
  };

  const updateMenuItem = (id: string, updates: Partial<CafeteriaMenuItem>) => {
    setCafeteriaMenu((prev) => {
      const updatedList = prev.map((item) => (item.id === id ? { ...item, ...updates } : item));
      const target = updatedList.find((item) => item.id === id);
      if (target) {
        fetch('/api/cafeteria-menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(target),
        }).catch((err) => console.warn('Turso sync error (updateMenuItem):', err));
      }
      return updatedList;
    });
    showToast('Plato / Bebida Actualizado', 'Los cambios se han guardado exitosamente.');
  };

  const deleteMenuItem = (id: string) => {
    setCafeteriaMenu((prev) => prev.filter((item) => item.id !== id));
    showToast('Plato / Bebida Eliminado', 'Se ha retirado el ítem de la carta.', 'warning');
    fetch(`/api/cafeteria-menu/${id}`, { method: 'DELETE' }).catch((err) => console.warn('Turso sync error (deleteMenuItem):', err));
  };

  // Retail Orders (Contraentrega)
  const createOrder = async (orderData: Omit<RetailOrder, 'id' | 'createdAt'>): Promise<RetailOrder> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: RetailOrder = {
      ...orderData,
      id: `ORD-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch((err) => console.warn('Turso sync error (createOrder):', err));

    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, ...(notes !== undefined ? { notes } : {}) } : o))
    );

    showToast('Pedido Actualizado', `Estado cambiado a "${status}".`);

    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    }).catch((err) => console.warn('Turso sync error (updateOrderStatus):', err));
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast('Pedido Eliminado', 'El pedido fue retirado del registro.', 'warning');

    fetch(`/api/orders/${orderId}`, {
      method: 'DELETE',
    }).catch((err) => console.warn('Turso sync error (deleteOrder):', err));
  };

  // Cart
  const addToCart = (product: Product, quantity = 1, purchaseType: 'unit' | 'wholesale' = 'unit') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id && item.purchaseType === purchaseType);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id && item.purchaseType === purchaseType
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, purchaseType }];
    });
    setIsCartOpen(true);
    showToast('Agregado al Carrito', `${quantity}x ${product.name}`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => setCart([]);

  const addGeneratedImage = (img: GeneratedAIImage) => {
    setGeneratedImages((prev) => [img, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        adminTab,
        setAdminTab,
        isAdminAuthenticated,
        adminLogin,
        adminLogout,
        copyShareLink,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubCategory,
        deleteSubCategory,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        bookings,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        quotes,
        createQuoteRequest,
        updateQuoteStatus,
        cafeteriaMenu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        selectedProductForQuote,
        setSelectedProductForQuote,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedEventForBooking,
        setSelectedEventForBooking,
        generatedImages,
        addGeneratedImage,
        currentUser,
        lastConsultedEmail,
        setLastConsultedEmail,
        lastConsultedCedula,
        setLastConsultedCedula,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
