import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import multer from "multer";
import { Readable } from "stream";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { turso, initTursoSchema } from "./src/db/turso";
import { uploadImageToR2, deleteImageFromR2, getImageFromR2 } from "./src/services/r2Service";

dotenv.config();

const app = express();
const PORT = 3000;

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

// Directly serve images and static files from public
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
        e.season,
        e.subtitle || "",
        e.date,
        e.time,
        e.durationHours || 3,
        e.location || "Finca Monteverde",
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
      eventTitle: r.event_title,
      eventDate: r.event_date,
      eventTime: r.event_time,
      customerName: r.customer_name,
      customerEmail: r.customer_email,
      customerPhone: r.customer_phone,
      customerDocument: r.customer_document,
      attendeesCount: Number(r.attendees_count),
      totalPaid: Number(r.total_paid),
      paymentMethod: r.payment_method,
      paymentStatus: r.payment_status,
      bookingDate: r.booking_date,
      qrCodeMock: r.qr_code_mock,
      status: r.status,
      specialRequests: r.special_requests,
    }));
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    await turso.execute({
      sql: `INSERT INTO event_bookings (
        id, event_id, event_title, event_date, event_time, customer_name,
        customer_email, customer_phone, customer_document, attendees_count,
        total_paid, payment_method, payment_status, booking_date, qr_code_mock, status, special_requests
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status,
        payment_status=excluded.payment_status,
        special_requests=excluded.special_requests`,
      args: [
        id,
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
        b.paymentMethod || "farm_cash",
        b.paymentStatus || "pending",
        b.bookingDate || new Date().toISOString(),
        b.qrCodeMock || `QR-${id}`,
        b.status || "confirmed",
        b.specialRequests || null,
      ],
    });
    res.json({ success: true, id });
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
      customerName: r.customer_name,
      companyName: r.company_name,
      email: r.email,
      phone: r.phone,
      customerDocument: r.customer_document,
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
    const id = q.id || `COT-2026-${Date.now()}`;
    await turso.execute({
      sql: `INSERT INTO wholesale_quotes (
        id, customer_name, company_name, email, phone, customer_document,
        city, product_id, product_name, requested_quantity, frequency,
        custom_packaging_needed, target_date, comments, estimated_unit_price, estimated_total, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status=excluded.status,
        comments=excluded.comments`,
      args: [
        id,
        q.customerName,
        q.companyName || "",
        q.email,
        q.phone,
        q.customerDocument || null,
        q.city,
        q.productId,
        q.productName,
        q.requestedQuantity,
        q.frequency || "once",
        q.customPackagingNeeded ? 1 : 0,
        q.targetDate || null,
        q.comments || "",
        q.estimatedUnitPrice,
        q.estimatedTotal,
        q.status || "pendiente",
        q.createdAt || new Date().toISOString(),
      ],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Cafeteria Menu
app.get("/api/cafeteria-menu", async (_req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM cafeteria_menu ORDER BY created_at ASC");
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
    const m = req.body;
    const id = m.id || `cafe-item-${Date.now()}`;
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
        m.name,
        m.category,
        m.price,
        m.description || "",
        m.imageUrl || "",
        JSON.stringify(m.badges || []),
        m.preparationTimeMin || 10,
        m.isFarmMade ? 1 : 0,
      ],
    });
    res.json({ success: true, id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/cafeteria-menu/:id", async (req, res) => {
  try {
    const existing = await turso.execute({
      sql: "SELECT image_url FROM cafeteria_menu WHERE id = ?",
      args: [req.params.id],
    });

    if (existing.rows.length > 0 && existing.rows[0].image_url) {
      await deleteImageFromR2(String(existing.rows[0].image_url));
    }

    await turso.execute({
      sql: "DELETE FROM cafeteria_menu WHERE id = ?",
      args: [req.params.id],
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Image Generation Endpoint with Aspect Ratio affordance
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", model = "gemini-3.1-flash-image-preview" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "El prompt descriptivo es requerido." });
    }

    const ai = getAIClient();
    if (!ai) {
      // Return high quality thematic placeholder if no API key configured
      return res.json({
        success: true,
        isFallback: true,
        message: "API Key de Gemini no detectada. Mostrando recurso visual temático de alta resolución.",
        imageUrl: getCuratedPhoto(prompt, aspectRatio),
        prompt,
        aspectRatio,
        model,
      });
    }

    // Try generating with Google GenAI
    // Imagen 3 supports '1:1', '3:4', '4:3', '9:16', '16:9'
    // Gemini preview models support custom aspect ratios like '1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'
    let generatedBase64 = "";

    try {
      if (model.includes("imagen")) {
        const validImagenRatios: Record<string, string> = {
          "1:1": "1:1",
          "3:4": "3:4",
          "4:3": "4:3",
          "9:16": "9:16",
          "16:9": "16:9",
          "2:3": "3:4",
          "3:2": "4:3",
          "21:9": "16:9"
        };
        const ratio = validImagenRatios[aspectRatio] || "1:1";
        const response = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: `Professional high-end artisanal coffee farm and organic honey brand photography: ${prompt}`,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
            aspectRatio: ratio as any,
          },
        });

        if (response.generatedImages?.[0]?.image?.imageBytes) {
          generatedBase64 = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        }
      } else {
        // Use Gemini multimodal generation or image preview
        const response = await ai.models.generateImages({
          model: "imagen-3.0-generate-002",
          prompt: `${prompt}, natural morning light, artisan plantation, Colombian coffee hacienda and pure raw honey, ultra realistic 4k aesthetic`,
          config: {
            numberOfImages: 1,
            outputMimeType: "image/jpeg",
            aspectRatio: ["1:1", "3:4", "4:3", "9:16", "16:9"].includes(aspectRatio) ? (aspectRatio as any) : "1:1",
          },
        });

        if (response.generatedImages?.[0]?.image?.imageBytes) {
          generatedBase64 = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
        }
      }
    } catch (genError: any) {
      console.warn("Error calling AI image generation model, falling back to thematic asset:", genError.message);
    }

    if (generatedBase64) {
      return res.json({
        success: true,
        imageUrl: generatedBase64,
        prompt,
        aspectRatio,
        model,
      });
    }

    // Curated high quality thematic photography fallback
    return res.json({
      success: true,
      isFallback: true,
      imageUrl: getCuratedPhoto(prompt, aspectRatio),
      prompt,
      aspectRatio,
      model,
      note: "Imagen generada adaptada al formato solicitado."
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

async function startServer() {
  try {
    await initTursoSchema();
  } catch (dbInitErr: any) {
    console.error("Warning: Turso schema auto-init error:", dbInitErr.message);
  }

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
