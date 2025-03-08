import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "wouter";
import { Package, SearchParams } from "@shared/schema";
import PackageCard from "@/components/packages/package-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "All",
  "Domestic Trips",
  "International Trips",
  "Group Tours",
  "Honeymoon Packages",
  "Weekend Getaways",
  "Adventure Trips",
];

export default function Packages() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(location.split("?")[1]);
  const initialCategory = urlParams.get("category") || "All";
  const initialDestination = urlParams.get("destination") || "";

  const [searchParams, setSearchParams] = useState<SearchParams>({
    category: initialCategory !== "All" ? initialCategory : undefined,
    destination: initialDestination,
    minPrice: undefined,
    maxPrice: undefined,
  });

  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages", searchParams],
  });

  const handleSearch = (destination: string) => {
    setSearchParams((prev) => ({ ...prev, destination }));
  };

  const handleCategoryChange = (category: string) => {
    setSearchParams((prev) => ({
      ...prev,
      category: category === "All" ? undefined : category,
    }));
  };

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Travel Packages</h1>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
          <Input
            type="text"
            placeholder="Search destinations..."
            className="max-w-sm"
            value={searchParams.destination || ""}
            onChange={(e) => handleSearch(e.target.value)}
          />

          <Select
            value={searchParams.category || "All"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() =>
              setSearchParams({
                category: undefined,
                destination: "",
                minPrice: undefined,
                maxPrice: undefined,
              })
            }
          >
            Clear Filters
          </Button>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[250px] sm:h-[300px] md:h-[350px] bg-gray-100 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : packages?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No packages found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {packages?.map((pkg, index) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}