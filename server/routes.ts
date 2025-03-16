import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, searchParamsSchema } from "@shared/schema";
import { z } from "zod";

// Helper function to parse and validate search parameters
const parseSearchParams = (query: any) => {
  try {
    // Convert numeric string values to numbers where appropriate
    const processedQuery = { ...query };
    
    // Handle numeric parameters
    ['minPrice', 'maxPrice', 'minDuration', 'maxDuration'].forEach(key => {
      if (processedQuery[key] !== undefined && processedQuery[key] !== '') {
        const num = Number(processedQuery[key]);
        if (!isNaN(num)) {
          processedQuery[key] = num;
        }
      }
    });
    
    // Remove empty strings and undefined values
    Object.keys(processedQuery).forEach(key => {
      if (processedQuery[key] === '' || processedQuery[key] === undefined) {
        delete processedQuery[key];
      }
    });
    
    return searchParamsSchema.parse(processedQuery);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Search parameter validation error:", error.errors);
    }
    throw error;
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all packages with optional search params
  app.get("/api/packages", async (req, res) => {
    try {
      console.log("GET /api/packages - Raw query params:", req.query);
      
      // Special handling for price filters in query params
      if (req.query.price) {
        const priceRange = String(req.query.price).split('-');
        if (priceRange.length === 2) {
          req.query.minPrice = priceRange[0];
          req.query.maxPrice = priceRange[1] || undefined;
        }
        delete req.query.price;
      }
      
      // Parse and validate search parameters
      const params = parseSearchParams(req.query);
      console.log("GET /api/packages - Processed params:", params);
      
      // Get packages with filters
      const packages = await storage.getPackages(params);
      console.log(`GET /api/packages - Found ${packages.length} matching packages`);
      
      res.json(packages);
    } catch (error) {
      console.error("GET /api/packages - Error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to fetch packages" });
      }
    }
  });

  // Get single package
  app.get("/api/packages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pkg = await storage.getPackage(id);
      if (!pkg) {
        res.status(404).json({ message: "Package not found" });
        return;
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch package" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiry = insertInquirySchema.parse(req.body);
      const created = await storage.createInquiry(inquiry);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid inquiry data" });
      } else {
        res.status(500).json({ message: "Failed to create inquiry" });
      }
    }
  });

  // Get all inquiries
  app.get("/api/inquiries", async (_req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
