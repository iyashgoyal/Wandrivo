import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Package } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, Tag } from "lucide-react";

export default function PackageDetail() {
  const [location, setLocation] = useLocation();
  const id = parseInt(location.split("/")[2]);

  const { data: pkg, isLoading } = useQuery<Package>({
    queryKey: [`/api/packages/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">Loading package details...</div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Package not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="relative h-[50vh] rounded-xl overflow-hidden mb-8">
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {pkg.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-4 text-white"
            >
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{pkg.destination}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{pkg.duration} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span>{pkg.category}</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">About This Package</h2>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                
                <h3 className="text-xl font-semibold mb-4">Highlights</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                  <li>Expertly curated itinerary</li>
                  <li>Professional tour guides</li>
                  <li>Comfortable accommodations</li>
                  <li>All transportation included</li>
                  <li>24/7 customer support</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">Itinerary</h3>
                <div className="space-y-4">
                  {[...Array(pkg.duration)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <CalendarDays className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Day {i + 1}</h4>
                        <p className="text-gray-600">
                          Sample itinerary description for day {i + 1}. Activities and highlights of the day.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Card */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-3xl font-bold mb-6">
                  ₹{pkg.price.toLocaleString('en-IN')}
                </div>
                <Button
                  className="w-full mb-4"
                  size="lg"
                  onClick={() => setLocation(`/contact?package=${pkg.id}`)}
                >
                  Book Now
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  * Price per person based on double occupancy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
