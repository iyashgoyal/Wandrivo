import { type Package, type InsertPackage, type Inquiry, type InsertInquiry, type SearchParams } from "@shared/schema";

export interface IStorage {
  // Package operations
  getPackages(params?: SearchParams): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  
  // Inquiry operations
  getInquiries(): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
}

export class MemStorage implements IStorage {
  private packages: Map<number, Package>;
  private inquiries: Map<number, Inquiry>;
  private currentPackageId: number;
  private currentInquiryId: number;

  constructor() {
    this.packages = new Map();
    this.inquiries = new Map();
    this.currentPackageId = 1;
    this.currentInquiryId = 1;
    this.initializeData();
  }

  private initializeData() {
    const samplePackages: InsertPackage[] = [
      {
        title: "Maldives Paradise Escape",
        description: "Experience luxury in the heart of the Indian Ocean",
        imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd",
        price: 2999,
        duration: 7,
        category: "International Trips",
        subCategory: "Honeymoon Packages",
        destination: "Maldives"
      },
      {
        title: "Swiss Alps Adventure",
        description: "Explore the majestic Swiss Alps",
        imageUrl: "https://images.unsplash.com/photo-1531795255027-67f7bf42e2e8",
        price: 3499,
        duration: 10,
        category: "International Trips",
        subCategory: "Adventure Trips",
        destination: "Switzerland"
      }
    ];

    samplePackages.forEach(pkg => this.createPackage(pkg));
  }

  async getPackages(params?: SearchParams): Promise<Package[]> {
    let packages = Array.from(this.packages.values());
    
    if (params) {
      if (params.category) {
        packages = packages.filter(p => p.category === params.category);
      }
      if (params.destination) {
        packages = packages.filter(p => p.destination.toLowerCase().includes(params.destination!.toLowerCase()));
      }
      if (params.minPrice) {
        packages = packages.filter(p => p.price >= params.minPrice!);
      }
      if (params.maxPrice) {
        packages = packages.filter(p => p.price <= params.maxPrice!);
      }
    }

    return packages;
  }

  async getPackage(id: number): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const id = this.currentPackageId++;
    const newPackage = { ...pkg, id };
    this.packages.set(id, newPackage);
    return newPackage;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const id = this.currentInquiryId++;
    const newInquiry = { ...inquiry, id };
    this.inquiries.set(id, newInquiry);
    return newInquiry;
  }
}

export const storage = new MemStorage();
