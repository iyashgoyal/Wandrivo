import { type Package, type InsertPackage, type Inquiry, type InsertInquiry, type SearchParams, packages, inquiries } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike, asc, desc } from "drizzle-orm";

export interface IStorage {
  // Package operations
  getPackages(params?: SearchParams): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;

  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

export class DatabaseStorage implements IStorage {
  async getPackages(params?: SearchParams): Promise<Package[]> {
    const conditions = [];

    // Apply filters
    if (params?.category) {
      conditions.push(eq(packages.category, params.category));
    }
    if (params?.subCategory) {
      conditions.push(eq(packages.subCategory, params.subCategory));
    }
    if (params?.destination) {
      conditions.push(ilike(packages.destination, `%${params.destination}%`));
    }
    if (params?.minPrice !== undefined) {
      conditions.push(gte(packages.price, params.minPrice));
    }
    if (params?.maxPrice !== undefined) {
      conditions.push(lte(packages.price, params.maxPrice));
    }
    if (params?.minDuration !== undefined) {
      conditions.push(gte(packages.duration, params.minDuration));
    }
    if (params?.maxDuration !== undefined) {
      conditions.push(lte(packages.duration, params.maxDuration));
    }

    try {
      let query = db.select().from(packages);

      // Apply filters
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      // Apply sorting
      if (params?.sortBy) {
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

      return await query;
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