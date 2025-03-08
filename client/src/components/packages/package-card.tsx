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
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
        <div 
          className="aspect-[4/3] relative overflow-hidden cursor-pointer"
          onClick={() => setLocation(`/packages/${pkg.id}`)}
        >
          <motion.img
            src={pkg.imageUrl}
            alt={pkg.title}
            className="object-cover w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {formatPrice(pkg.price)}
          </motion.div>
        </div>

        <CardContent className="p-4 flex-grow">
          <motion.h3 
            className="text-lg md:text-xl font-semibold mb-2 line-clamp-2 hover:text-primary cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setLocation(`/packages/${pkg.id}`)}
          >
            {pkg.title}
          </motion.h3>
          <motion.p 
            className="text-gray-600 text-sm mb-4 line-clamp-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {pkg.description}
          </motion.p>

          <motion.div 
            className="flex justify-between text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span>{pkg.duration} days</span>
            <span>{pkg.destination}</span>
          </motion.div>
        </CardContent>

        <CardFooter className="p-4 pt-0 space-x-2">
          <Button 
            variant="outline"
            className="w-1/2"
            onClick={() => setLocation(`/packages/${pkg.id}`)}
          >
            View Details
          </Button>
          <Button 
            className="w-1/2 bg-primary hover:bg-primary/90"
            onClick={() => setLocation(`/contact?package=${pkg.id}`)}
          >
            Book Now
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}