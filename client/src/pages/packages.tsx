import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
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
  "Weekend Getaways",
  "Honeymoon Packages",
  "Cultural",
  "Beach",
  "Mountain",
  "City",
  "National Park",
  "Adventure",
  "Relaxation",
  "Wellness"
];

const sortOptions = [
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "duration_asc", label: "Duration: Shortest to Longest" },
  { value: "duration_desc", label: "Duration: Longest to Shortest" },
];

// Update the priceRangeOptions with more appropriate price ranges for Indian rupees
const priceRangeOptions = [
  { value: "all", label: "All Prices" },
  { value: "0-30000", label: "Under ₹30,000" },
  { value: "30000-50000", label: "₹30,000 - ₹50,000" },
  { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
  { value: "100000-150000", label: "₹1,00,000 - ₹1,50,000" },
  { value: "150000-999999", label: "Above ₹1,50,000" },
];

export default function Packages() {
  // Get location and navigation from wouter
  const [location, navigate] = useLocation();
  
  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  
  // Get initial filter values from URL parameters with proper decoding
  const initialCategory = urlParams.get("category") ? decodeURIComponent(urlParams.get("category")!) : "All";
  const initialDestination = urlParams.get("destination") ? decodeURIComponent(urlParams.get("destination")!) : "";
  
  // Parse initial price range if present
  const initialMinPrice = urlParams.get("minPrice") ? Number(urlParams.get("minPrice")) : undefined;
  const initialMaxPrice = urlParams.get("maxPrice") ? Number(urlParams.get("maxPrice")) : undefined;
  
  // Debugging the initial state
  console.log("Initial Filters:", {
    category: initialCategory,
    destination: initialDestination,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    url: location
  });

  // Initialize search params from URL
  const [searchParams, setSearchParams] = useState<SearchParams>({
    category: initialCategory !== "All" ? initialCategory : undefined,
    destination: initialDestination,
    minPrice: initialMinPrice,
    maxPrice: initialMaxPrice,
    minDuration: undefined,
    maxDuration: undefined,
    sortBy: undefined,
  });
  
  // Store selected category for the UI
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  
  // Update selected category when search params change
  useEffect(() => {
    setSelectedCategory(searchParams.category || "All");
  }, [searchParams.category]);
  
  // Synchronize URL with filters
  useEffect(() => {
    const newUrlParams = new URLSearchParams();
    
    // Only add parameters that have values
    if (searchParams.category) {
      newUrlParams.set("category", searchParams.category);
    }
    
    if (searchParams.destination) {
      newUrlParams.set("destination", searchParams.destination);
    }
    
    if (searchParams.minPrice !== undefined) {
      newUrlParams.set("minPrice", searchParams.minPrice.toString());
    }
    
    if (searchParams.maxPrice !== undefined) {
      newUrlParams.set("maxPrice", searchParams.maxPrice.toString());
    }
    
    if (searchParams.sortBy) {
      newUrlParams.set("sortBy", searchParams.sortBy);
    }
    
    // Update URL without causing a navigation (replace state)
    const newUrl = newUrlParams.toString() 
      ? `/packages?${newUrlParams.toString()}`
      : '/packages';
      
    if (location !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams, location]);
  
  // Query packages with search parameters
  const { data: packages, isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages", searchParams],
  });

  // Handler functions for filter changes
  const handleSearch = (destination: string) => {
    setSearchParams(prev => ({ ...prev, destination }));
  };

  const handleCategoryChange = (category: string) => {
    // Update the UI state immediately
    setSelectedCategory(category);
    
    // Update the search params (which will trigger API call)
    setSearchParams(prev => ({
      ...prev,
      category: category === "All" ? undefined : category,
    }));
    
    // Force URL update for better debugging
    const newUrl = category === "All" 
      ? '/packages'
      : `/packages?category=${encodeURIComponent(category)}`;
    window.history.replaceState(null, '', newUrl);
  };

  const handlePriceRangeChange = (value: string) => {
    console.log("Price range changed:", value);
    
    if (value === "all") {
      setSearchParams(prev => ({
        ...prev,
        minPrice: undefined,
        maxPrice: undefined,
      }));
      return;
    }
    
    // Parse min and max from the range value (e.g., "1000-1499")
    const [min, max] = value.split('-').map(Number);
    
    setSearchParams(prev => ({
      ...prev,
      minPrice: min || undefined,
      maxPrice: max || undefined,
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

  // Improved function to get current price range value
  const getCurrentPriceRangeValue = () => {
    const { minPrice, maxPrice } = searchParams;
    
    // If no price filters are set, return "all"
    if (minPrice === undefined && maxPrice === undefined) {
      return "all";
    }
    
    // Check if current min/max matches any of our predefined ranges
    for (const option of priceRangeOptions) {
      if (option.value === "all") continue;
      
      const [rangeMin, rangeMax] = option.value.split('-').map(Number);
      
      // If both min and max match exactly
      if (minPrice === rangeMin && 
          (maxPrice === rangeMax || 
           (rangeMax === 99999 && maxPrice === undefined))) {
        return option.value;
      }
    }
    
    // Custom range that doesn't match predefined options
    return "all";
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
                      value={selectedCategory}
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
            value={selectedCategory}
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

          {/* Add Price Range Filter */}
          <Select
            value={getCurrentPriceRangeValue()}
            onValueChange={handlePriceRangeChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Price range" />
            </SelectTrigger>
            <SelectContent>
              {priceRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.sortBy || ""}
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
            onClick={() => {
              // Reset UI state
              setSelectedCategory("All");
              
              // Reset search params
              setSearchParams({
                category: undefined,
                destination: "",
                minPrice: undefined,
                maxPrice: undefined,
                minDuration: undefined,
                maxDuration: undefined,
                sortBy: undefined,
              });
              
              // Update URL directly for immediate visual feedback
              window.history.replaceState(null, '', '/packages');
            }}
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