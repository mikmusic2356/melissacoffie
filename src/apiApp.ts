import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import multer from "multer";
import { Readable } from "stream";
import { GoogleGenAI } from "@google/genai";
import { turso, initTursoSchema } from "./db/turso";
import { uploadImageToR2, deleteImageFromR2, getImageFromR2 } from "./services/r2Service";

dotenv.config();

export const app = express();

// Configure Multer for in-memory image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // Max 25MB before compression
});

app.use(express.json({ limit: "15mb" }));

// ---------------- CLOUDFLARE R2 ROUTES ----------------

// Route to serve optimized images directly from Cloudflare R2 with caching
app.get("/r2/*", async (req, res) => {
  try {
    const key = req.params[0];
    if (!key) return res.status(404).send("Image not found");

    const r2Response = await getImageFromR2(key);
    if (!r2Response.Body) {
      return res.status(404).send("Image body empty");
    }

    if (r2Response.ContentType) {
      res.setHeader("Content-Type", r2Response.ContentType);
    }
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    const readable = r2Response.Body as Readable;
    readable.pipe(res);
  } catch (err: any) {
    console.warn("R2 fetch error:", err.message);
    res.status(404).send("Image not found in R2");
  }
});

// Upload endpoint with auto-compression and Cloudflare R2 storage
app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No se proporcionó ningún archivo de imagen." });
    }

    const folder = (req.body.folder as 'products' | 'events' | 'cafeteria' | 'general') || 'general';
    const result = await uploadImageToR2(req.file.buffer, folder);

    res.json({
      success: true,
      url: result.url,
      key: result.key,
      originalSizeKB: Math.round(result.originalSize / 1024),
      optimizedSizeKB: Math.round(result.optimizedSize / 1024),
      compressionRatio: `${Math.round((1 - result.optimizedSize / result.originalSize) * 100)}%`,
    });
  } catch (error: any) {
    console.error("Cloudflare R2 Upload Error:", error);
    res.status(500).json({ error: error.message || "Error al subir la imagen a Cloudflare R2" });
  }
});

// Directly serve images, videos and static files from public
app.use("/videos", express.static(path.join(process.cwd(), "public", "videos")));
app.use("/images", express.static(path.join(process.cwd(), "public", "images")));
app.use(express.static(path.join(process.cwd(), "public")));

// Route to serve the user-requested Honey dipper on coffee beans cover image directly
app.get([
  "/images/Honey_dipper_on_coffee_beans_202609022103.jpeg",
  "/Honey_dipper_on_coffee_beans_202609022103.jpeg",
  "/api/hero-cover"
], (_req, res) => {
  const primaryPath = path.join(process.cwd(), "public", "images", "Honey_dipper_on_coffee_beans_202609022103.jpeg");
  if (fs.existsSync(primaryPath)) {
    return res.sendFile(primaryPath);
  }
  const fallbackLocal = path.join(process.cwd(), "public", "Honey_dipper_on_coffee_beans_202609022103.jpeg");
  if (fs.existsSync(fallbackLocal)) {
    return res.sendFile(fallbackLocal);
  }
  res.redirect("https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1600&q=85");
});

// Lazy Google GenAI Client
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint with Turso status
app.get("/api/health", async (_req, res) => {
  try {
    const dbTest = await turso.execute("SELECT 1 as connected");
    res.json({ status: "ok", turso: "connected", timestamp: new Date().toISOString() });
  } catch (err: any) {
    res.json({ status: "ok", turso: "disconnected", error: err.message, timestamp: new Date().toISOString() });
  }
});

// ---------------- TURSO DB API ENDPOINTS ----------------

// 1. Categories
app.get("/api/categories", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM categories ORDER BY id ASC");
    const categories = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      subcategories: row.subcategories ? JSON.parse(row.subcategories) : [],
    }));
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { id, name, description, subcategories } = req.body;
    await turso.execute({
      sql: "INSERT INTO categories (id, name, description, subcategories) VALUES (?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET name=excluded.name, description=excluded.description, subcategories=excluded.subcategories",
      args: [id, name, description || "", JSON.stringify(subcategories || [])],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/categories/:id", async (req, res) => {
  try {
    await turso.execute({
      sql: "DELETE FROM categories WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Products
app.get("/api/products", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM products ORDER BY created_at DESC");
    const products = result.rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      categoryId: r.category_id,
      subCategoryId: r.sub_category_id,
      shortDescription: r.short_description,
      description: r.description,
      priceUnit: Number(r.price_unit),
      wholesalePriceMin: Number(r.wholesale_price_min),
      minWholesaleQuantity: Number(r.min_wholesale_quantity),
      unitLabel: r.unit_label,
      weightGrams: Number(r.weight_grams),
      stock: Number(r.stock),
      imageUrl: r.image_url,
      rating: Number(r.rating),
      reviewsCount: Number(r.reviews_count),
      featured: Boolean(r.featured),
      origin: r.origin ? JSON.parse(r.origin) : undefined,
      honeyDetails: r.honey_details ? JSON.parse(r.honey_details) : undefined,
    }));
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `prod-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO products (
        id, name, category_id, sub_category_id, short_description, description,
        price_unit, wholesale_price_min, min_wholesale_quantity, unit_label,
        weight_grams, stock, image_url, rating, reviews_count, featured, origin, honey_details
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        category_id=excluded.category_id,
        sub_category_id=excluded.sub_category_id,
        short_description=excluded.short_description,
        description=excluded.description,
        price_unit=excluded.price_unit,
        wholesale_price_min=excluded.wholesale_price_min,
        min_wholesale_quantity=excluded.min_wholesale_quantity,
        unit_label=excluded.unit_label,
        weight_grams=excluded.weight_grams,
        stock=excluded.stock,
        image_url=excluded.image_url,
        rating=excluded.rating,
        reviews_count=excluded.reviews_count,
        featured=excluded.featured,
        origin=excluded.origin,
        honey_details=excluded.honey_details`,
      args: [
        id,
        p.name,
        p.categoryId,
        p.subCategoryId,
        p.shortDescription || "",
        p.description || "",
        p.priceUnit,
        p.wholesalePriceMin,
        p.minWholesaleQuantity,
        p.unitLabel || "Unidad",
        p.weightGrams || 0,
        p.stock ?? 0,
        p.imageUrl || "",
        p.rating || 5.0,
        p.reviewsCount || 0,
        p.featured ? 1 : 0,
        p.origin ? JSON.stringify(p.origin) : null,
        p.honeyDetails ? JSON.stringify(p.honeyDetails) : null,
      ],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  try {
    const existing = await turso.execute({
      sql: "SELECT image_url FROM products WHERE id = ?",
      args: [req.params.id],
    });

    if (existing.rows.length > 0 && existing.rows[0].image_url) {
      await deleteImageFromR2(String(existing.rows[0].image_url));
    }

    await turso.execute({
      sql: "DELETE FROM products WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Farm Events
app.get("/api/events", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM farm_events ORDER BY created_at DESC");
    const events = result.rows.map((r: any) => ({
      id: r.id,
      title: r.title,
      season: r.season,
      subtitle: r.subtitle,
      date: r.date,
      time: r.time,
      durationHours: Number(r.duration_hours),
      location: r.location,
      description: r.description,
      fullDetails: r.full_details,
      pricePerPerson: Number(r.price_per_person),
      capacity: Number(r.capacity),
      bookedSpots: Number(r.booked_spots),
      included: r.included ? JSON.parse(r.included) : [],
      imageUrl: r.image_url,
      status: r.status,
      availableSlots: r.available_slots ? JSON.parse(r.available_slots) : [],
    }));
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/events", async (req, res) => {
  try {
    const e = req.body;
    const id = e.id || `evt-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO farm_events (
        id, title, season, subtitle, date, time, duration_hours, location,
        description, full_details, price_per_person, capacity, booked_spots,
        included, image_url, status, available_slots
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        season=excluded.season,
        subtitle=excluded.subtitle,
        date=excluded.date,
        time=excluded.time,
        duration_hours=excluded.duration_hours,
        location=excluded.location,
        description=excluded.description,
        full_details=excluded.full_details,
        price_per_person=excluded.price_per_person,
        capacity=excluded.capacity,
        booked_spots=excluded.booked_spots,
        included=excluded.included,
        image_url=excluded.image_url,
        status=excluded.status,
        available_slots=excluded.available_slots`,
      args: [
        id,
        e.title,
        e.season || "Temporada de Cosecha",
        e.subtitle || "",
        e.date,
        e.time,
        e.durationHours || 3,
        e.location || "Mirador Principal de la Finca",
        e.description || "",
        e.fullDetails || "",
        e.pricePerPerson,
        e.capacity,
        e.bookedSpots || 0,
        JSON.stringify(e.included || []),
        e.imageUrl || "",
        e.status || "active",
        JSON.stringify(e.availableSlots || []),
      ],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    const existing = await turso.execute({
      sql: "SELECT image_url FROM farm_events WHERE id = ?",
      args: [req.params.id],
    });

    if (existing.rows.length > 0 && existing.rows[0].image_url) {
      await deleteImageFromR2(String(existing.rows[0].image_url));
    }

    await turso.execute({
      sql: "DELETE FROM farm_events WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Bookings
app.get("/api/bookings", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM event_bookings ORDER BY created_at DESC");
    const bookings = result.rows.map((r: any) => ({
      id: r.id,
      eventId: r.event_id,
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      customerEmail: r.customer_email,
      chosenDate: r.chosen_date,
      chosenTime: r.chosen_time,
      attendeesCount: Number(r.attendees_count),
      totalAmount: Number(r.total_amount),
      status: r.status,
      paymentMethod: r.payment_method,
      bookingDate: r.booking_date,
      specialRequests: r.special_requests,
      qrCodeMock: r.qr_code_mock,
    }));
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `BK-${Date.now().toString(36).toUpperCase()}`;
    await turso.execute({
      sql: `INSERT INTO event_bookings (
        id, event_id, customer_name, customer_phone, customer_email, chosen_date,
        chosen_time, attendees_count, total_amount, status, payment_method,
        booking_date, special_requests, qr_code_mock
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status,
        special_requests=excluded.special_requests`,
      args: [
        id,
        b.eventId,
        b.customerName,
        b.customerPhone,
        b.customerEmail,
        b.chosenDate,
        b.chosenTime,
        b.attendeesCount,
        b.totalAmount,
        b.status || "confirmed",
        b.paymentMethod || "farm_cash",
        b.bookingDate || new Date().toISOString(),
        b.specialRequests || "",
        b.qrCodeMock || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${id}`,
      ],
    });

    // Update event spots
    await turso.execute({
      sql: "UPDATE farm_events SET booked_spots = booked_spots + ? WHERE id = ?",
      args: [b.attendeesCount || 1, b.eventId],
    });

    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await turso.execute({
      sql: "UPDATE event_bookings SET status = ? WHERE id = ?",
      args: [status, req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Wholesale Quotes
app.get("/api/quotes", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM wholesale_quotes ORDER BY created_at DESC");
    const quotes = result.rows.map((r: any) => ({
      id: r.id,
      customerDocument: r.customer_document,
      customerName: r.customer_name,
      companyName: r.company_name,
      email: r.email,
      phone: r.phone,
      city: r.city,
      productId: r.product_id,
      productName: r.product_name,
      requestedQuantity: Number(r.requested_quantity),
      frequency: r.frequency,
      customPackagingNeeded: Boolean(r.custom_packaging_needed),
      targetDate: r.target_date,
      comments: r.comments,
      estimatedUnitPrice: Number(r.estimated_unit_price),
      estimatedTotal: Number(r.estimated_total),
      status: r.status,
      createdAt: r.created_at,
    }));
    res.json(quotes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/quotes", async (req, res) => {
  try {
    const q = req.body;
    const id = q.id || `COT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    await turso.execute({
      sql: `INSERT INTO wholesale_quotes (
        id, customer_document, customer_name, company_name, email, phone, city,
        product_id, product_name, requested_quantity, frequency, custom_packaging_needed,
        target_date, comments, estimated_unit_price, estimated_total, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        customer_document=excluded.customer_document,
        customer_name=excluded.customer_name,
        company_name=excluded.company_name,
        email=excluded.email,
        phone=excluded.phone,
        city=excluded.city,
        product_id=excluded.product_id,
        product_name=excluded.product_name,
        requested_quantity=excluded.requested_quantity,
        frequency=excluded.frequency,
        custom_packaging_needed=excluded.custom_packaging_needed,
        target_date=excluded.target_date,
        comments=excluded.comments,
        estimated_unit_price=excluded.estimated_unit_price,
        estimated_total=excluded.estimated_total,
        status=excluded.status`,
      args: [
        id,
        q.customerDocument || null,
        q.customerName,
        q.companyName || "Cliente Mayorista",
        q.email,
        q.phone,
        q.city,
        q.productId,
        q.productName,
        q.requestedQuantity,
        q.frequency || "once",
        q.customPackagingNeeded ? 1 : 0,
        q.targetDate || "",
        q.comments || "",
        q.estimatedUnitPrice,
        q.estimatedTotal,
        q.status || "pendiente",
      ],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/quotes/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    await turso.execute({
      sql: "UPDATE wholesale_quotes SET status = ? WHERE id = ?",
      args: [status, req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Cafeteria Menu
app.get("/api/cafeteria-menu", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM cafeteria_menu ORDER BY id ASC");
    const menu = result.rows.map((r: any) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      price: Number(r.price),
      description: r.description,
      imageUrl: r.image_url,
      badges: r.badges ? JSON.parse(r.badges) : [],
      preparationTimeMin: Number(r.preparation_time_min),
      isFarmMade: Boolean(r.is_farm_made),
    }));
    res.json(menu);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cafeteria-menu", async (req, res) => {
  try {
    const item = req.body;
    const id = item.id || `menu-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO cafeteria_menu (
        id, name, category, price, description, image_url, badges, preparation_time_min, is_farm_made
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name=excluded.name,
        category=excluded.category,
        price=excluded.price,
        description=excluded.description,
        image_url=excluded.image_url,
        badges=excluded.badges,
        preparation_time_min=excluded.preparation_time_min,
        is_farm_made=excluded.is_farm_made`,
      args: [
        id,
        item.name,
        item.category,
        item.price,
        item.description || "",
        item.imageUrl || "",
        JSON.stringify(item.badges || []),
        item.preparationTimeMin || 10,
        item.isFarmMade ? 1 : 0,
      ],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/cafeteria-menu/:id", async (req, res) => {
  try {
    await turso.execute({
      sql: "DELETE FROM cafeteria_menu WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Retail Orders (Pedidos por Unidad / Contraentrega)
app.get("/api/orders", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM orders ORDER BY created_at DESC");
    const orders = result.rows.map((r: any) => ({
      id: r.id,
      customerName: r.customer_name,
      customerDocument: r.customer_document || undefined,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      deliveryAddress: r.delivery_address,
      city: r.city,
      department: r.department || undefined,
      deliveryNotes: r.delivery_notes || undefined,
      paymentMethod: r.payment_method,
      items: r.items ? JSON.parse(r.items) : [],
      subtotal: Number(r.subtotal),
      shippingCost: Number(r.shipping_cost),
      total: Number(r.total),
      status: r.status,
      notes: r.notes || undefined,
      createdAt: r.created_at,
    }));
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const o = req.body;
    const id = o.id || `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = o.createdAt || new Date().toISOString();
    await turso.execute({
      sql: `INSERT INTO orders (
        id, customer_name, customer_document, customer_email, customer_phone,
        delivery_address, city, department, delivery_notes, payment_method,
        items, subtotal, shipping_cost, total, status, notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status,
        notes=excluded.notes`,
      args: [
        id,
        o.customerName,
        o.customerDocument || null,
        o.customerEmail,
        o.customerPhone,
        o.deliveryAddress,
        o.city,
        o.department || null,
        o.deliveryNotes || null,
        o.paymentMethod || "contraentrega",
        JSON.stringify(o.items || []),
        Number(o.subtotal) || 0,
        Number(o.shippingCost) || 0,
        Number(o.total) || 0,
        o.status || "pendiente",
        o.notes || null,
        createdAt,
      ],
    });
    res.json({ success: true, id, createdAt });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (notes !== undefined) {
      await turso.execute({
        sql: "UPDATE orders SET status = ?, notes = ? WHERE id = ?",
        args: [status, notes, req.params.id],
      });
    } else {
      await turso.execute({
        sql: "UPDATE orders SET status = ? WHERE id = ?",
        args: [status, req.params.id],
      });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  try {
    await turso.execute({
      sql: "DELETE FROM orders WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. AI Studio Image Generation
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es obligatorio." });
    }

    const ai = getAIClient();
    if (!ai) {
      return res.json({
        imageUrl: getCuratedPhoto(prompt, aspectRatio),
        prompt,
        note: "Imagen de alta resolución de catálogo adaptada al contexto.",
      });
    }

    const response = await ai.models.generateImages({
      model: "imagen-3.0-generate-002",
      prompt: `Fotografía profesional cinematográfica de alta calidad para marca de café y miel 'Melífera Coffee': ${prompt}. Iluminación cálida, detalles nítidos, estética artesanal colombiana 8k.`,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/jpeg",
        aspectRatio: (aspectRatio as any) || "1:1",
      },
    });

    const imgBase64 = response.generatedImages?.[0]?.image?.imageBytes;
    if (!imgBase64) {
      return res.json({
        imageUrl: getCuratedPhoto(prompt, aspectRatio),
        prompt,
        note: "Foto de archivo seleccionada.",
      });
    }

    const buffer = Buffer.from(imgBase64, "base64");
    const r2Result = await uploadImageToR2(buffer, "general");

    res.json({
      imageUrl: r2Result.url,
      prompt,
      r2Key: r2Result.key,
      note: "Imagen generada adaptada al formato solicitado.",
    });
  } catch (error: any) {
    console.error("API /api/generate-image error:", error);
    res.status(500).json({ error: error.message || "Error al generar la imagen" });
  }
});

function getCuratedPhoto(prompt: string, _ratio: string): string {
  const p = prompt.toLowerCase();
  if (p.includes("miel") || p.includes("abeja") || p.includes("honey") || p.includes("panal")) {
    return "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1200&q=80";
  }
  if (p.includes("evento") || p.includes("cata") || p.includes("taller") || p.includes("workshop")) {
    return "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80";
  }
  if (p.includes("cafeteria") || p.includes("postre") || p.includes("menu") || p.includes("brunch")) {
    return "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80";
  }
  if (p.includes("finca") || p.includes("paisaje") || p.includes("cultivo")) {
    return "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80";
  }
  return "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80";
}
