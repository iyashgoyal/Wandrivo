import { type Package, type InsertPackage, type Inquiry, type InsertInquiry, type SearchParams, packages, inquiries } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, ilike } from "drizzle-orm";

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

    if (params?.category) {
      // We need exact match for category
      conditions.push(eq(packages.category, params.category));
    }
    if (params?.destination) {
      // Case-insensitive partial match for destination
      conditions.push(ilike(packages.destination, `%${params.destination}%`));
    }
    if (params?.minPrice !== undefined) {
      conditions.push(gte(packages.price, params.minPrice));
    }
    if (params?.maxPrice !== undefined) {
      conditions.push(lte(packages.price, params.maxPrice));
    }

    try {
      const query = conditions.length > 0
        ? db.select().from(packages).where(and(...conditions))
        : db.select().from(packages);

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