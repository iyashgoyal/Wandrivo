import { motion, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import OptimizedImage from "@/components/ui/optimized-image";

export default function About() {
  // Add scroll-linked animations
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Track component mounting for animation improvements
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Preload the hero image immediately
    const preloadImages = [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80"
    ];
    
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="py-16 px-4" ref={containerRef}>
      <div className="container mx-auto">
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4,
            ease: "easeOut",
            type: "tween"
          }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">About Wandrivo</h1>
          <p className="text-lg text-gray-600">
            Your trusted partner in creating unforgettable travel experiences since 2010.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={isMounted ? { opacity: 0, x: -20 } : false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
            }}
          >
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Wandrivo was founded with a simple mission: to make extraordinary travel experiences accessible to everyone. What started as a small team of passionate travelers has grown into a leading travel agency.
            </p>
            <p className="text-gray-600">
              We believe in creating journeys that go beyond the ordinary, combining adventure, comfort, and authentic local experiences.
            </p>
          </motion.div>

          <motion.div
            initial={isMounted ? { opacity: 0, scale: 0.95 } : false}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            className="aspect-video rounded-lg overflow-hidden shadow-lg"
          >
            <OptimizedImage
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop&q=80"
              alt="Travel team"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={isMounted ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ 
            duration: 0.4,
            staggerChildren: 0.08,
            type: "tween",
            ease: "easeOut"
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {/* Value cards with individual animations */}
          {[
            {
              title: "Passion",
              description: "We're passionate about travel and sharing the world's wonders with our clients."
            },
            {
              title: "Excellence",
              description: "We strive for excellence in every journey we plan and every service we provide."
            },
            {
              title: "Innovation",
              description: "We constantly innovate to create unique and memorable travel experiences."
            }
          ].map((value, index) => (
            <motion.div 
              key={value.title}
              initial={isMounted ? { opacity: 0, y: 15 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.08,
                ease: "easeOut"
              }}
              className="text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-bold mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
