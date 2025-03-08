import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Moon, Sun, Phone, User } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";

const categories = [
  {
    name: "Travel Packages",
    items: [
      { name: "Domestic Trips", href: "/packages?category=Domestic Trips" },
      { name: "International Trips", href: "/packages?category=International Trips" },
      { name: "Group Tours", href: "/packages?category=Group Tours" },
      { name: "Honeymoon Packages", href: "/packages?category=Honeymoon Packages" },
      { name: "Weekend Getaways", href: "/packages?category=Weekend Getaways" },
      { name: "Adventure Trips", href: "/packages?category=Adventure Trips" },
    ]
  }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/packages?destination=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">Wandrivo</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/">
                    <NavigationMenuLink 
                      className={cn(
                        "px-3 py-2 hover:text-primary transition-colors",
                        location === "/" && "text-primary"
                      )}
                    >
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/about">
                    <NavigationMenuLink 
                      className={cn(
                        "px-3 py-2 hover:text-primary transition-colors",
                        location === "/about" && "text-primary"
                      )}
                    >
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Travel Packages</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      {categories[0].items.map((item) => (
                        <li key={item.name}>
                          <Link href={item.href}>
                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                              {item.name}
                            </NavigationMenuLink>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact">
                    <NavigationMenuLink 
                      className={cn(
                        "px-3 py-2 hover:text-primary transition-colors",
                        location === "/contact" && "text-primary"
                      )}
                    >
                      Contact Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right side items */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50">
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50">
                About Us
              </a>
            </Link>
            <Link href="/packages">
              <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50">
                Travel Packages
              </a>
            </Link>
            <Link href="/contact">
              <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50">
                Contact Us
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary hover:bg-gray-50">
                Dashboard
              </a>
            </Link>
          </div>
        </div>
      )}

      {/* Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Destinations</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSearch} className="mt-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit">Search</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
}