import 'dotenv/config';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '../shared/schema';
import { packages } from '../shared/schema';

// Configure neon with websockets for serverless connections
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

// Create a proper pool connection like in db.ts
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log('🌱 Seeding database...');
  
  try {
    // Clear existing data
    console.log('Clearing existing packages...');
    await db.delete(packages);
    console.log('Existing packages cleared successfully');
    
    // Define international destinations
    console.log('Adding international destinations...');
    const internationalDestinations = [
      {
        title: "Golden Triangle Tour - India",
        description: "Experience the rich cultural heritage of India with this 7-day tour of Delhi, Agra, and Jaipur. Visit the iconic Taj Mahal, explore ancient forts, and enjoy authentic Indian cuisine.",
        imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1471&auto=format&fit=crop",
        price: 28999,
        duration: 7,
        category: "Cultural",
        subCategory: "Heritage",
        destination: "India"
      },
      {
        title: "Kerala Backwaters Cruise - India",
        description: "Glide through the serene backwaters of Kerala on a traditional houseboat during this 5-day South India retreat. Experience local village life, enjoy Ayurvedic treatments, and savor fresh seafood.",
        imageUrl: "https://images.unsplash.com/photo-1602215399818-651d9d308136?q=80&w=1374&auto=format&fit=crop",
        price: 24999,
        duration: 5,
        category: "Relaxation",
        subCategory: "Cruise",
        destination: "Kerala, India"
      },
      {
        title: "Himalayan Adventure - India",
        description: "Trek through the breathtaking Himalayan mountains on this 8-day adventure. Visit Buddhist monasteries in Ladakh, experience local Tibetan culture, and enjoy stunning mountain views.",
        imageUrl: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=1470&auto=format&fit=crop",
        price: 42999,
        duration: 8,
        category: "Adventure",
        subCategory: "Trekking",
        destination: "Himalayas, India"
      },
      {
        title: "Tokyo Cultural Experience",
        description: "Discover the blend of traditional and modern Japan with this 6-day Tokyo package. Visit ancient temples, explore bustling markets, and enjoy authentic cuisine.",
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1587&auto=format&fit=crop",
        price: 135999,
        duration: 6,
        category: "City",
        subCategory: "Cultural",
        destination: "Tokyo, Japan"
      },
      {
        title: "Santorini Sunset Getaway",
        description: "Experience the famous Santorini sunsets with this 4-day romantic getaway. Enjoy luxury accommodations, private tours, and fine dining. Perfect for honeymooners!",
        imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1587&auto=format&fit=crop",
        price: 98999,
        duration: 4,
        category: "Island",
        subCategory: "Romantic",
        destination: "Santorini, Greece"
      },
      {
        title: "Machu Picchu Inca Trail Trek",
        description: "Trek the legendary Inca Trail to Machu Picchu on this 7-day adventure. Explore ancient ruins and experience breathtaking Andean landscapes.",
        imageUrl: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1470&auto=format&fit=crop",
        price: 175999,
        duration: 7,
        category: "Mountain",
        subCategory: "Trekking",
        destination: "Machu Picchu, Peru"
      }
    ];
    
    // Define domestic destinations (US-based)
    console.log('Adding domestic destinations...');
    const domesticDestinations = [
      {
        title: "Grand Canyon Adventure",
        description: "Explore the awe-inspiring Grand Canyon on this 4-day adventure. Hike stunning trails, enjoy sunset views, and learn about the canyon's geology.",
        imageUrl: "https://images.unsplash.com/photo-1615551043360-33de8b5f410c?q=80&w=1476&auto=format&fit=crop",
        price: 109999,
        duration: 4,
        category: "National Park",
        subCategory: "Adventure",
        destination: "Grand Canyon, Arizona"
      },
      {
        title: "New York City Weekend",
        description: "Experience the energy of the Big Apple on this 3-day city break. See iconic landmarks, catch a Broadway show, and enjoy world-class dining.",
        imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop",
        price: 129999,
        duration: 3,
        category: "City",
        subCategory: "Weekend",
        destination: "New York City, New York"
      },
      {
        title: "Hawaii Beach Escape",
        description: "Relax on the beautiful beaches of Hawaii on this 6-day tropical getaway. Snorkel in crystal-clear waters, hike to waterfalls, and attend a traditional luau.",
        imageUrl: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?q=80&w=1374&auto=format&fit=crop",
        price: 145999,
        duration: 6,
        category: "Beach",
        subCategory: "Relaxation",
        destination: "Maui, Hawaii"
      },
      {
        title: "Yellowstone Wildlife Safari",
        description: "Discover the incredible wildlife and geothermal features of Yellowstone National Park on this 5-day safari. Spot wolves, bison, and bears in their natural habitat.",
        imageUrl: "https://images.unsplash.com/photo-1576003880778-b2f25429f688?q=80&w=1470&auto=format&fit=crop",
        price: 119999,
        duration: 5,
        category: "National Park",
        subCategory: "Wildlife",
        destination: "Yellowstone, Wyoming"
      },
      {
        title: "Nashville Music Experience",
        description: "Immerse yourself in the heart of country music on this 4-day Nashville experience. Visit famous recording studios, enjoy live performances, and tour the Country Music Hall of Fame.",
        imageUrl: "https://images.unsplash.com/photo-1545486332-9e0999c535b2?q=80&w=1587&auto=format&fit=crop",
        price: 89999,
        duration: 4,
        category: "City",
        subCategory: "Music",
        destination: "Nashville, Tennessee"
      },
      {
        title: "Alaska Northern Lights",
        description: "Witness the spectacular aurora borealis on this 5-day winter adventure in Alaska. Stay in a cozy lodge, go dog sledding, and photograph the dancing northern lights.",
        imageUrl: "https://images.unsplash.com/photo-1579033485043-6aa6e5d44ba6?q=80&w=1364&auto=format&fit=crop",
        price: 159999,
        duration: 5,
        category: "Northern Lights",
        subCategory: "Winter",
        destination: "Fairbanks, Alaska"
      },
      {
        title: "California Wine Country Tour",
        description: "Taste world-class wines on this 4-day tour of Napa and Sonoma valleys. Visit renowned wineries, enjoy gourmet meals, and relax in luxury accommodations.",
        imageUrl: "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?q=80&w=1374&auto=format&fit=crop",
        price: 104999,
        duration: 4,
        category: "Wine",
        subCategory: "Culinary",
        destination: "Napa Valley, California"
      },
      {
        title: "Florida Keys Road Trip",
        description: "Drive the iconic Overseas Highway on this 5-day Florida Keys road trip. Snorkel at coral reefs, try key lime pie, and experience the laid-back island atmosphere.",
        imageUrl: "https://images.unsplash.com/photo-1517861469713-bd91d849e680?q=80&w=1374&auto=format&fit=crop",
        price: 94999,
        duration: 5,
        category: "Road Trip",
        subCategory: "Island",
        destination: "Florida Keys, Florida"
      },
      {
        title: "New Orleans Cultural Experience",
        description: "Explore the unique culture and cuisine of New Orleans on this 4-day city break. Enjoy jazz music, take a swamp tour, and taste authentic Creole and Cajun food.",
        imageUrl: "https://images.unsplash.com/photo-1570223257921-9af9a1bd8041?q=80&w=1470&auto=format&fit=crop",
        price: 84999,
        duration: 4,
        category: "City",
        subCategory: "Cultural",
        destination: "New Orleans, Louisiana"
      },
      {
        title: "Colorado Mountain Retreat",
        description: "Escape to the Rocky Mountains on this 5-day mountain retreat. Hike scenic trails, relax in natural hot springs, and enjoy spectacular mountain views.",
        imageUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1470&auto=format&fit=crop",
        price: 99999,
        duration: 5,
        category: "Mountain",
        subCategory: "Relaxation",
        destination: "Aspen, Colorado"
      },
      {
        title: "Charleston Historic Tour",
        description: "Step back in time with this 3-day tour of Charleston's historic district. Explore antebellum mansions, cobblestone streets, and beautiful gardens.",
        imageUrl: "https://images.unsplash.com/photo-1582859600110-6261a5b7ca8e?q=80&w=1470&auto=format&fit=crop",
        price: 79999,
        duration: 3,
        category: "City",
        subCategory: "Historical",
        destination: "Charleston, South Carolina"
      },
      {
        title: "Olympic National Park Adventure",
        description: "Experience the diverse ecosystems of Olympic National Park on this 6-day adventure. Explore rainforests, mountains, and coastal beaches.",
        imageUrl: "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?q=80&w=1374&auto=format&fit=crop",
        price: 114999,
        duration: 6,
        category: "National Park",
        subCategory: "Adventure",
        destination: "Olympic Peninsula, Washington"
      },
      {
        title: "Chicago City Break",
        description: "Enjoy the best of the Windy City with this 4-day urban getaway. Visit world-class museums, enjoy deep-dish pizza, and take in stunning lakefront views.",
        imageUrl: "https://images.unsplash.com/photo-1564414777547-955023f71a38?q=80&w=1473&auto=format&fit=crop",
        price: 89999,
        duration: 4,
        category: "City",
        subCategory: "Weekend",
        destination: "Chicago, Illinois"
      },
      {
        title: "Sedona Spiritual Retreat",
        description: "Reconnect with nature and yourself during this 5-day spiritual retreat in Sedona. Experience energy vortexes, meditative hikes, and stunning red rock formations.",
        imageUrl: "https://images.unsplash.com/photo-1535139262971-c51845709a48?q=80&w=1470&auto=format&fit=crop",
        price: 92999,
        duration: 5,
        category: "Wellness",
        subCategory: "Spiritual",
        destination: "Sedona, Arizona"
      },
      {
        title: "Kerala Romantic Escape",
        description: "Enjoy a perfect honeymoon amidst the serene backwaters and beaches of Kerala. This 5-day romance package includes private houseboat stay, couple's ayurvedic spa treatments, and candlelit dinners.",
        imageUrl: "https://images.unsplash.com/photo-1571987502227-9231b837d92a?q=80&w=1470&auto=format&fit=crop",
        price: 32999,
        duration: 5,
        category: "Beach",
        subCategory: "Romantic",
        destination: "Kerala, India"
      },
      {
        title: "Goa Weekend Escape",
        description: "Get away for a quick 3-day beach retreat in beautiful Goa. Enjoy sun, sand, and vibrant nightlife with accommodation at a beachfront resort.",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1374&auto=format&fit=crop",
        price: 19999,
        duration: 3,
        category: "Beach",
        subCategory: "Weekend",
        destination: "Goa, India"
      },
      {
        title: "Dubai Shopping Weekend",
        description: "Enjoy a luxury 3-day shopping experience in dazzling Dubai. Stay in a 5-star hotel, visit the world's largest mall, and experience the vibrant city nightlife.",
        imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1470&auto=format&fit=crop",
        price: 89999,
        duration: 3,
        category: "City",
        subCategory: "Weekend",
        destination: "Dubai, UAE"
      }
    ];
    
    // Insert all packages individually using the ORM
    console.log('Inserting packages...');
    
    // Combining all destinations
    const allDestinations = [...internationalDestinations, ...domesticDestinations];
    
    for (const pkg of allDestinations) {
      try {
        await db.insert(packages).values({
          title: pkg.title,
          description: pkg.description,
          imageUrl: pkg.imageUrl,
          price: pkg.price,
          duration: pkg.duration,
          category: pkg.category,
          subCategory: pkg.subCategory,
          destination: pkg.destination
        });
        console.log(`Added package: ${pkg.title}`);
      } catch (err) {
        console.error(`Failed to insert package "${pkg.title}":`, err);
      }
    }
    
    // Verify packages were inserted
    try {
      const count = await db.select().from(packages);
      console.log(`✅ Database seeded successfully! Verified ${count.length} packages in database.`);
      console.log(`   - ${internationalDestinations.length} international destinations`);
      console.log(`   - ${domesticDestinations.length} domestic destinations`);
    } catch (err) {
      console.error('Error verifying package count:', err);
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    console.log('Database seeding completed');
    process.exit(0);
  }
}

seed(); 