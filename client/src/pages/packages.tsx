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
import {
  Slider,
  SliderTrack,
  SliderRange,
  SliderThumb,
} from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, SortAsc, SortDesc } from "lucide-react";

const categories = [
  "All",
  "Domestic Trips",
  "International Trips",
  "Group Tours",
  "Honeymoon Packages",
  "Weekend Getaways",
  "Adventure Trips",
];

const sortOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "duration_asc", label: "Duration: Shortest to Longest" },
  { value: "duration_desc", label: "Duration: Longest to Shortest" },
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
    minDuration: undefined,
    maxDuration: undefined,
    sortBy: undefined,
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

  const handlePriceChange = (values: number[]) => {
    setSearchParams((prev) => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1],
    }));
  };

  const handleDurationChange = (values: number[]) => {
    setSearchParams((prev) => ({
      ...prev,
      minDuration: values[0],
      maxDuration: values[1],
    }));
  };

  const handleSortChange = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      sortBy: value as SearchParams["sortBy"],
    }));
  };

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Travel Packages</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Packages</SheetTitle>
                <SheetDescription>
                  Customize your search with advanced filters
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* Mobile Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={searchParams.category || "All"}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
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
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sort By</label>
                    <Select
                      value={searchParams.sortBy}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Search and Filters */}
        <div className="hidden md:flex items-center space-x-4 mb-8">
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

          <Select
            value={searchParams.sortBy}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
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
                minDuration: undefined,
                maxDuration: undefined,
                sortBy: undefined,
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