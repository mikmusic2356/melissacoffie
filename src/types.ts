export type CategoryId = 'cafe' | 'miel' | 'accesorios' | 'packs' | string;

export interface SubCategory {
  id: string;
  name: string;
  categoryId: CategoryId;
  description?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  subcategories: SubCategory[];
  iconName?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: CategoryId;
  subCategoryId: string;
  shortDescription: string;
  description: string;
  priceUnit: number; // Precio al detal en COP (o moneda local)
  wholesalePriceMin: number; // Precio base por mayor (por kg / unidad en lote)
  minWholesaleQuantity: number; // Mínimo para cotización mayorista (ej. 10 kg, 24 frascos)
  unitLabel: string; // ej: "Bolsa 340g", "Frasco 500g", "Kilo en grano"
  weightGrams?: number;
  stock: number;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  origin?: {
    finca: string;
    altitudeMeters: number;
    variety: string;
    process: string; // "Lavado", "Honey", "Natural"
    tastingNotes: string[];
  };
  honeyDetails?: {
    flowerSource: string; // ej: "Flor de Cafeto", "Bosque Nativo"
    texture: string; // "Líquida", "Cremada", "Panal"
    purity: string;
  };
}

export type EventSeason = 
  | 'Temporada de Cosecha'
  | 'Temporada de Floración'
  | 'Temporada Seca / Verano'
  | 'Temporada Anual'
  | 'Temporada Especial de Navidad';

export interface EventScheduleSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm o formato legible ej: "09:30 AM"
  capacity?: number;
  bookedSpots?: number;
  available?: boolean;
  notes?: string;
}

export interface FarmEvent {
  id: string;
  title: string;
  season: EventSeason;
  subtitle: string;
  description: string;
  fullDetails: string;
  pricePerPerson: number;
  durationHours: number;
  date: string; // YYYY-MM-DD (fecha representativa inicial)
  time: string; // HH:mm (hora representativa inicial)
  location: string; // ej: "Terraza de la Cafetería", "Apiario El Bosque", "Laboratorio de Cata"
  capacity: number;
  bookedSpots: number;
  imageUrl: string;
  included: string[];
  status: 'active' | 'sold_out' | 'past';
  availableSlots?: EventScheduleSlot[]; // Fechas y horarios configurados por el administrador
}

export interface EventBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  customerName: string;
  customerEmail: string; // Identificador principal de consulta de reservas
  customerPhone: string;
  customerDocument?: string; // Opcional o documento de respaldo
  attendeesCount: number;
  totalPaid: number;
  paymentMethod: 'credit_card' | 'pse' | 'nequi' | 'farm_cash';
  paymentStatus: 'paid' | 'pending';
  bookingDate: string;
  qrCodeMock: string;
  specialRequests?: string;
  status: 'confirmed' | 'cancelled' | 'attended';
}

export interface WholesaleQuoteRequest {
  id: string;
  customerName: string;
  customerDocument: string; // Cédula o NIT/documento para consulta sin registro
  companyName: string;
  email: string;
  phone: string;
  city: string;
  productId: string;
  productName: string;
  requestedQuantity: number; // en kilos o unidades
  frequency: 'once' | 'monthly' | 'quarterly';
  customPackagingNeeded: boolean;
  targetDate: string;
  comments: string;
  estimatedUnitPrice: number;
  estimatedTotal: number;
  status: 'pendiente' | 'contactado' | 'cotizado' | 'cerrado';
  createdAt: string;
}

export interface CafeteriaMenuItem {
  id: string;
  name: string;
  category: 'calientes' | 'frias' | 'pasteleria' | 'brunch';
  price: number;
  description: string;
  imageUrl: string;
  badges: string[];
  preparationTimeMin: number;
  isFarmMade: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  purchaseType: 'unit' | 'wholesale';
}

export type AspectRatioType = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export interface GeneratedAIImage {
  id: string;
  prompt: string;
  aspectRatio: AspectRatioType;
  model: string;
  imageUrl: string;
  createdAt: string;
  attachedTo?: string;
}
