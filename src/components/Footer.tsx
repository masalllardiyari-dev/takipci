import React from "react";
import { Link } from "react-router-dom";
import { Heart, Instagram as InstaIcon, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
              <span className="text-xl font-black text-gray-800">Artemis<span className="text-red-500">.</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">Sosyal medyada büyümenin en güvenilir adresi. Gerçek kullanıcılar, anında teslimat.</p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3">Sayfalar</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <Link to="/services" className="hover:text-red-500">Hizmetler</Link>
              <Link to="/blog" className="hover:text-red-500">Blog</Link>
              <Link to="/contact" className="hover:text-red-500">İletişim</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3">Yasal</h4>
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <Link to="/legal/kvkk" className="hover:text-red-500">KVKK</Link>
              <Link to="/legal/kvkk" className="hover:text-red-500">Gizlilik</Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-5 text-gray-400">
            <InstaIcon className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
            <Twitter className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
            <Mail className="w-4 h-4 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
          <p className="text-xs text-gray-400 font-semibold">&copy; {new Date().getFullYear()} Artemis Digital</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
