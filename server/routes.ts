import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve template files from public directory before Vite middleware
  app.use('/templates', express.static(path.join(process.cwd(), 'public/templates')));
  
  // No other API routes needed - this app runs entirely client-side
  // All file processing and organization happens in the browser

  const httpServer = createServer(app);

  return httpServer;
}
