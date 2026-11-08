import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import express from "express";
import { app } from "./src/apiApp";
import { initTursoSchema } from "./src/db/turso";

dotenv.config();

const PORT = 3000;

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
