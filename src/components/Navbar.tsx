import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, User, Settings, LogIn, Menu, X, Zap, Search
} from "lucide-react";
import { cn } from "../lib/utils";

const Navbar = ({ user, isAdmin }: { user: any, isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Anasayfa", path: "/" },
    { name: "Hizmetler", path: "/services" },
    { name: "Sipariş Sorgula", path: "/track", icon: Search },
    { name: "Demo Talebi", path: "/contact?demo=true", icon: Zap },
    { name: "Blog", path: "/blog" },
    { name: "İletişim", path: "/contact" },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-white/95 backdrop-blur-xl shadow-lg shadow-red-100/50" : "bg-white/80 backdrop-blur-md"
    )}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-gray-800">
              Artemis<span className="text-red-500">.</span>
            </span>
            <span className="text-[9px] font-bold text-red-400 tracking-[0.2em] block -mt-1">DIGITAL</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-5 py-2.5 text-sm font-semibold tracking-wide transition-all rounded-xl",
                location.pathname === link.path
                  ? "bg-red-50 text-red-500"
                  : "text-gray-600 hover:text-red-500 hover:bg-red-50/50"
              )}
            >
              {link.name}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100 transition-all">
                  <User className="w-4 h-4" /> Panelim
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold text-sm hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-200"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-600 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white border-t border-red-50 shadow-2xl p-6 flex flex-col gap-2"
          >
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "text-base font-semibold p-4 rounded-xl transition-all",
                  location.pathname === link.path
                    ? "bg-red-50 text-red-500"
                    : "text-gray-600 hover:bg-red-50/50 hover:text-red-500"
                )}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-base font-semibold text-red-500 p-4 rounded-xl bg-red-50 flex items-center gap-2">
                  <User className="w-5 h-5" /> Panelim
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="text-base font-semibold text-gray-600 p-4 rounded-xl bg-gray-50 flex items-center gap-2">
                    <Settings className="w-5 h-5" /> Admin
                  </Link>
                )}
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-base font-semibold text-white p-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center gap-2">
                <LogIn className="w-5 h-5" /> Giriş Yap
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
