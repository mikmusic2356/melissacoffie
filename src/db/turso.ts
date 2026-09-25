import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_EVENTS,
  INITIAL_BOOKINGS,
  INITIAL_QUOTES,
  INITIAL_CAFETERIA_MENU,
  INITIAL_ORDERS,
} from '../data/initialData';

dotenv.config();

const url = process.env.TURSO_DATABASE_URL || 'libsql://melissacoffie-mikmusic2356.aws-us-east-2.turso.io';
const authToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODg0NzUzOTYsImlkIjoiMDFhMDY5NzAtYjkwMS03MTQwLTlmY2UtMDNhZjZiNjExZTNiIiwia2lkIjoiT19jVUNRdEI2Y3hWTlBrSzJFZFJPTEI0ZUhqR2wweFEtNUlEUVNaSjBOUSIsInJpZCI6ImRhYjM5ZWEwLThhYWEtNGRjOS1hODViLTZlMTY2NjBkOTE3MSJ9.Fk9pB8zwa9Wm18N7b7wLmMUFQuBiMEFeTDXmRV_uFE8a1x9VXt6MOxSVcGwvBA9wUUIUrrtbrbHfmFNeK6QdCA';

export const turso = createClient({
  url,
  authToken,
});

export async function initTursoSchema() {
  console.log('⚡ Initializing Turso Database Schema for Melifera Coffee...');

  // 1. Categories
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      subcategories TEXT
    );
  `);

  // 2. Products
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      sub_category_id TEXT NOT NULL,
      short_description TEXT,
      description TEXT,
      price_unit REAL NOT NULL,
      wholesale_price_min REAL NOT NULL,
      min_wholesale_quantity INTEGER NOT NULL,
      unit_label TEXT NOT NULL,
      weight_grams REAL,
      stock INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      rating REAL DEFAULT 5.0,
      reviews_count INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      origin TEXT,
      honey_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Events
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS farm_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      season TEXT NOT NULL,
      subtitle TEXT,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration_hours REAL,
      location TEXT,
      description TEXT,
      full_details TEXT,
      price_per_person REAL NOT NULL,
      capacity INTEGER NOT NULL,
      booked_spots INTEGER DEFAULT 0,
      included TEXT,
      image_url TEXT,
      status TEXT DEFAULT 'active',
      available_slots TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Bookings
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS event_bookings (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      event_title TEXT NOT NULL,
      event_date TEXT NOT NULL,
      event_time TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      customer_document TEXT,
      attendees_count INTEGER NOT NULL,
      total_paid REAL NOT NULL,
      payment_method TEXT DEFAULT 'farm_cash',
      payment_status TEXT DEFAULT 'pending',
      booking_date TEXT NOT NULL,
      qr_code_mock TEXT,
      status TEXT DEFAULT 'confirmed',
      special_requests TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Quotes
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS wholesale_quotes (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      company_name TEXT,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      customer_document TEXT,
      city TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      requested_quantity REAL NOT NULL,
      frequency TEXT DEFAULT 'once',
      custom_packaging_needed INTEGER DEFAULT 0,
      target_date TEXT,
      comments TEXT,
      estimated_unit_price REAL NOT NULL,
      estimated_total REAL NOT NULL,
      status TEXT DEFAULT 'pendiente',
      created_at TEXT NOT NULL
    );
  `);

  // 6. Cafeteria Menu
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS cafeteria_menu (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT,
      image_url TEXT,
      badges TEXT,
      preparation_time_min INTEGER DEFAULT 10,
      is_farm_made INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Retail Orders (Unit / Cash on Delivery)
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_document TEXT,
      department TEXT NOT NULL,
      city TEXT NOT NULL,
      address TEXT NOT NULL,
      neighborhood TEXT,
      notes TEXT,
      payment_method TEXT DEFAULT 'contraentrega',
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping_cost REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pendiente',
      created_at TEXT NOT NULL
    );
  `);

  console.log('✅ Tables created. Checking and seeding initial data if empty...');

  // Seed Categories if empty
  const catCheck = await turso.execute('SELECT COUNT(*) as count FROM categories');
  if (Number(catCheck.rows[0].count) === 0) {
    for (const cat of INITIAL_CATEGORIES) {
      await turso.execute({
        sql: 'INSERT INTO categories (id, name, description, subcategories) VALUES (?, ?, ?, ?)',
        args: [cat.id, cat.name, cat.description || '', JSON.stringify(cat.subcategories || [])],
      });
    }
    console.log('  -> Seeded categories into Turso DB');
  }

  // Seed Products if empty
  const prodCheck = await turso.execute('SELECT COUNT(*) as count FROM products');
  if (Number(prodCheck.rows[0].count) === 0) {
    for (const p of INITIAL_PRODUCTS) {
      await turso.execute({
        sql: `INSERT INTO products (
          id, name, category_id, sub_category_id, short_description, description,
          price_unit, wholesale_price_min, min_wholesale_quantity, unit_label,
          weight_grams, stock, image_url, rating, reviews_count, featured, origin, honey_details
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          p.id,
          p.name,
          p.categoryId,
          p.subCategoryId,
          p.shortDescription || '',
          p.description || '',
          p.priceUnit,
          p.wholesalePriceMin,
          p.minWholesaleQuantity,
          p.unitLabel,
          p.weightGrams || 0,
          p.stock,
          p.imageUrl,
          p.rating,
          p.reviewsCount,
          p.featured ? 1 : 0,
          p.origin ? JSON.stringify(p.origin) : null,
          p.honeyDetails ? JSON.stringify(p.honeyDetails) : null,
        ],
      });
    }
    console.log('  -> Seeded products into Turso DB');
  }

  // Seed Events if empty
  const evtCheck = await turso.execute('SELECT COUNT(*) as count FROM farm_events');
  if (Number(evtCheck.rows[0].count) === 0) {
    for (const e of INITIAL_EVENTS) {
      await turso.execute({
        sql: `INSERT INTO farm_events (
          id, title, season, subtitle, date, time, duration_hours, location,
          description, full_details, price_per_person, capacity, booked_spots,
          included, image_url, status, available_slots
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          e.id,
          e.title,
          e.season,
          e.subtitle || '',
          e.date,
          e.time,
          e.durationHours,
          e.location,
          e.description,
          e.fullDetails || '',
          e.pricePerPerson,
          e.capacity,
          e.bookedSpots,
          JSON.stringify(e.included || []),
          e.imageUrl,
          e.status,
          JSON.stringify(e.availableSlots || []),
        ],
      });
    }
    console.log('  -> Seeded events into Turso DB');
  }

  // Seed Bookings if empty
  const bookCheck = await turso.execute('SELECT COUNT(*) as count FROM event_bookings');
  if (Number(bookCheck.rows[0].count) === 0) {
    for (const b of INITIAL_BOOKINGS) {
      await turso.execute({
        sql: `INSERT INTO event_bookings (
          id, event_id, event_title, event_date, event_time, customer_name,
          customer_email, customer_phone, customer_document, attendees_count,
          total_paid, payment_method, payment_status, booking_date, qr_code_mock, status, special_requests
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          b.id,
          b.eventId,
          b.eventTitle,
          b.eventDate,
          b.eventTime,
          b.customerName,
          b.customerEmail,
          b.customerPhone || null,
          b.customerDocument || null,
          b.attendeesCount,
          b.totalPaid,
          b.paymentMethod,
          b.paymentStatus,
          b.bookingDate,
          b.qrCodeMock,
          b.status,
          b.specialRequests || null,
        ],
      });
    }
    console.log('  -> Seeded bookings into Turso DB');
  }

  // Seed Quotes if empty
  const quoteCheck = await turso.execute('SELECT COUNT(*) as count FROM wholesale_quotes');
  if (Number(quoteCheck.rows[0].count) === 0) {
    for (const q of INITIAL_QUOTES) {
      await turso.execute({
        sql: `INSERT INTO wholesale_quotes (
          id, customer_name, company_name, email, phone, customer_document,
          city, product_id, product_name, requested_quantity, frequency,
          custom_packaging_needed, target_date, comments, estimated_unit_price, estimated_total, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          q.id,
          q.customerName,
          q.companyName || '',
          q.email,
          q.phone,
          q.customerDocument || null,
          q.city,
          q.productId,
          q.productName,
          q.requestedQuantity,
          q.frequency,
          q.customPackagingNeeded ? 1 : 0,
          q.targetDate || null,
          q.comments || '',
          q.estimatedUnitPrice,
          q.estimatedTotal,
          q.status,
          q.createdAt,
        ],
      });
    }
    console.log('  -> Seeded quotes into Turso DB');
  }

  // Seed Cafeteria Menu if empty
  const menuCheck = await turso.execute('SELECT COUNT(*) as count FROM cafeteria_menu');
  if (Number(menuCheck.rows[0].count) === 0) {
    for (const m of INITIAL_CAFETERIA_MENU) {
      await turso.execute({
        sql: `INSERT INTO cafeteria_menu (
          id, name, category, price, description, image_url, badges, preparation_time_min, is_farm_made
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          m.id,
          m.name,
          m.category,
          m.price,
          m.description,
          m.imageUrl,
          JSON.stringify(m.badges || []),
          m.preparationTimeMin,
          m.isFarmMade ? 1 : 0,
        ],
      });
    }
    console.log('  -> Seeded cafeteria menu into Turso DB');
  }

  // Seed Retail Orders if empty
  const ordersCheck = await turso.execute('SELECT COUNT(*) as count FROM orders');
  if (Number(ordersCheck.rows[0].count) === 0) {
    for (const o of INITIAL_ORDERS) {
      await turso.execute({
        sql: `INSERT INTO orders (
          id, customer_name, customer_email, customer_phone, customer_document,
          department, city, address, neighborhood, notes, payment_method,
          items, subtotal, shipping_cost, total, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          o.id,
          o.customerName,
          o.customerEmail,
          o.customerPhone,
          o.customerDocument || null,
          o.department,
          o.city,
          o.address,
          o.neighborhood || null,
          o.notes || null,
          o.paymentMethod || 'contraentrega',
          JSON.stringify(o.items || []),
          o.subtotal,
          o.shippingCost || 0,
          o.total,
          o.status,
          o.createdAt,
        ],
      });
    }
    console.log('  -> Seeded retail orders into Turso DB');
  }

  console.log('🌟 Turso Database is fully operational and synchronized!');
}

