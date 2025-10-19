"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Home, Package, Map, Calendar, User, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkLoginStatus();
    
    const handleLoginChange = () => checkLoginStatus();
    window.addEventListener('loginStatusChanged', handleLoginChange);
    
    return () => window.removeEventListener('loginStatusChanged', handleLoginChange);
  }, []);

  const checkLoginStatus = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      setIsLoggedIn(true);
    } else {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('loginStatusChanged'));
    window.location.href = "/";
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
              🌍 Travel Bucket List
            </span>
          </Link>
          
          <div className="hidden md:flex md:gap-2">
            <Link href="/">
              <Button variant={isActive("/") ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/packages">
              <Button variant={isActive("/packages") ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                Packages
              </Button>
            </Link>
            <Link href="/map">
              <Button variant={isActive("/map") ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
                <Map className="h-4 w-4" />
                Map
              </Button>
            </Link>
            {isLoggedIn && (
              <>
                <Link href="/bookings">
                  <Button variant={isActive("/bookings") ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    My Bookings
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant={isActive("/dashboard") ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant={isActive("/profile") ? "default" : "ghost"} size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome, {user?.full_name || user?.username}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-1">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">Register</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}