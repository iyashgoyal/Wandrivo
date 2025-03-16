import { useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const [isPackagesPage] = useRoute("/packages");
  const { theme, setTheme } = useTheme();

  // Helper function to check if a path is the current active path
  const isActivePath = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  // Common style for active links
  const activeStyle = "bg-green-100 text-green-900";
  const hoverStyle = "hover:bg-green-50";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/packages?destination=${encodeURIComponent(searchQuery.trim())}`);
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
                        "px-4 py-2 rounded-md transition-colors font-medium",
                        isActivePath("/") ? activeStyle : hoverStyle
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
                        "px-4 py-2 rounded-md transition-colors font-medium",
                        isActivePath("/about") ? activeStyle : hoverStyle
                      )}
                    >
                      About Us
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/packages">
                    <NavigationMenuLink 
                      className={cn(
                        "px-4 py-2 rounded-md transition-colors font-medium",
                        isActivePath("/packages") ? activeStyle : hoverStyle
                      )}
                    >
                      Travel Packages
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/contact">
                    <NavigationMenuLink 
                      className={cn(
                        "px-4 py-2 rounded-md transition-colors font-medium",
                        isActivePath("/contact") ? activeStyle : hoverStyle
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
              <a className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActivePath("/") ? activeStyle : "hover:bg-gray-50"
              )}>
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActivePath("/about") ? activeStyle : "hover:bg-gray-50"
              )}>
                About Us
              </a>
            </Link>
            <Link href="/packages">
              <a className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActivePath("/packages") ? activeStyle : "hover:bg-gray-50"
              )}>
                Travel Packages
              </a>
            </Link>
            <Link href="/contact">
              <a className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActivePath("/contact") ? activeStyle : "hover:bg-gray-50"
              )}>
                Contact Us
              </a>
            </Link>
            <Link href="/dashboard">
              <a className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActivePath("/dashboard") ? activeStyle : "hover:bg-gray-50"
              )}>
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