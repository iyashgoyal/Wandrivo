import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h1 className="text-4xl font-bold mb-6">About Wandrivo</h1>
          <p className="text-lg text-gray-600">
            Your trusted partner in creating unforgettable travel experiences since 2010.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="aspect-video rounded-lg overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
              alt="Travel team"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-3">Passion</h3>
            <p className="text-gray-600">
              We're passionate about travel and sharing the world's wonders with our clients.
            </p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-3">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in every journey we plan and every service we provide.
            </p>
          </div>
          <div className="text-center p-6">
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-gray-600">
              We constantly innovate to create unique and memorable travel experiences.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
