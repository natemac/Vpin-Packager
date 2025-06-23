import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // No API routes needed - this app runs entirely client-side
  // All file processing and organization happens in the browser
  // Templates are now embedded in the JavaScript code

  const httpServer = createServer(app);

  return httpServer;
}
