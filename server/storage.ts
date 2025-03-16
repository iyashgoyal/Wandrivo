import { type Package, type InsertPackage, type Inquiry, type InsertInquiry, type SearchParams, packages, inquiries } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, asc, desc, or, not } from "drizzle-orm";

export interface IStorage {
  // Package operations
  getPackages(params?: SearchParams): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

// Helper function to parse numeric values
const parseNumericValue = (value: any): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
};

export class DatabaseStorage implements IStorage {
  async getPackages(params?: SearchParams): Promise<Package[]> {
    // Log raw request params
    console.log("Raw request params:", params);
    
    try {
      // Start by getting all packages to validate the connection
      const allPackages = await db.select().from(packages);
      console.log(`Total packages in database: ${allPackages.length}`);
      
      // If no params or empty params, return all packages
      if (!params || Object.keys(params).length === 0) {
        return allPackages;
      }
      
      // Build the conditions array for filtering
      const conditions = [];
      
      // 1. Handle category filtering
      if (params.category) {
        console.log(`Filtering by category: ${params.category}`);
        
        if (params.category === "Domestic Trips") {
          // Domestic = India destinations
          conditions.push(ilike(packages.destination, '%India%'));
        } else if (params.category === "International Trips") {
          // International = NOT India destinations
          conditions.push(not(ilike(packages.destination, '%India%')));
        } else if (params.category === "Weekend Getaways") {
          // Weekend getaways = short duration trips (2-4 days)
          conditions.push(lte(packages.duration, 4));
          conditions.push(gte(packages.duration, 2));
        } else if (params.category === "Honeymoon Packages") {
          // Honeymoon packages = romantic subcategory
          conditions.push(eq(packages.subCategory, "Romantic"));
        } else if (params.category !== "All") {
          // Regular category filter (Beach, Mountain, etc.)
          conditions.push(eq(packages.category, params.category));
        }
      }
      
      // 2. Handle destination search
      if (params.destination && params.destination.trim() !== '') {
        console.log(`Searching for destination: ${params.destination}`);
        conditions.push(ilike(packages.destination, `%${params.destination.trim()}%`));
      }
      
      // 3. Handle price filtering
      const minPrice = parseNumericValue(params.minPrice);
      const maxPrice = parseNumericValue(params.maxPrice);
      
      if (minPrice !== undefined) {
        console.log(`Filtering by minimum price: ${minPrice}`);
        conditions.push(gte(packages.price, minPrice));
      }
      
      if (maxPrice !== undefined) {
        console.log(`Filtering by maximum price: ${maxPrice}`);
        conditions.push(lte(packages.price, maxPrice));
      }
      
      // 4. Handle duration filtering
      const minDuration = parseNumericValue(params.minDuration);
      const maxDuration = parseNumericValue(params.maxDuration);
      
      if (minDuration !== undefined) {
        console.log(`Filtering by minimum duration: ${minDuration}`);
        conditions.push(gte(packages.duration, minDuration));
      }
      
      if (maxDuration !== undefined) {
        console.log(`Filtering by maximum duration: ${maxDuration}`);
        conditions.push(lte(packages.duration, maxDuration));
      }
      
      // 5. Handle subcategory filtering
      if (params.subCategory) {
        console.log(`Filtering by subcategory: ${params.subCategory}`);
        conditions.push(eq(packages.subCategory, params.subCategory));
      }
      
      // Build and execute query
      let query = db.select().from(packages);
      
      // Apply all conditions as an AND
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // Apply sorting if specified
      if (params.sortBy) {
        console.log(`Sorting by: ${params.sortBy}`);
        switch (params.sortBy) {
          case 'price_asc':
            query = query.orderBy(asc(packages.price));
            break;
          case 'price_desc':
            query = query.orderBy(desc(packages.price));
            break;
          case 'duration_asc':
            query = query.orderBy(asc(packages.duration));
            break;
          case 'duration_desc':
            query = query.orderBy(desc(packages.duration));
            break;
        }
      }
      
      // Execute query
      const result = await query;
      console.log(`Found ${result.length} packages after filtering`);
      return result;
    } catch (error) {
      console.error('Error in getPackages:', error);
      return [];
    }
  }
  
  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [created] = await db
      .insert(packages)
      .values(pkg)
      .returning();
    return created;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [created] = await db
      .insert(inquiries)
      .values(inquiry)
      .returning();
    return created;
  }
}

export const storage = new DatabaseStorage();