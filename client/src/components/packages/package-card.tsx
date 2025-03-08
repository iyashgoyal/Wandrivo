import { motion } from "framer-motion";
import { Package } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface PackageCardProps {
  package: Package;
  index: number;
}

export default function PackageCard({ package: pkg, index }: PackageCardProps) {
  const [, setLocation] = useLocation();

  // Format price with Indian Rupee symbol and thousands separator
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full">
            {formatPrice(pkg.price)}
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

          <div className="flex justify-between text-sm text-gray-500">
            <span>{pkg.duration} days</span>
            <span>{pkg.destination}</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full"
            onClick={() => setLocation(`/contact?package=${pkg.id}`)}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}