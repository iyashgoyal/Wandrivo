import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://static.vecteezy.com/system/resources/previews/009/420/470/mp4/drone-flying-low-over-sea-mikra-strava-greece-free-video.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Overlay with gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg"
        >
          Discover Your Next Adventure
          <br />
          with Wandrivo
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-shadow-md"
        >
          Experience unforgettable journeys to the world's most breathtaking destinations
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={() => setLocation("/packages")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
          >
            Explore Packages
          </Button>
        </motion.div>
      </div>
    </div>
  );
}