import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Send, Mail, Phone, Instagram, User, MessageSquare, 
  CheckCircle2, AlertCircle, Loader2, Menu, X, 
  Instagram as InstaIcon, Twitter, Tablet, MessageCircle, 
  ChevronRight, LogIn, Plus, Trash2, Edit3, Settings,
  LogOut, Home, Briefcase, FileText, ShoppingCart, 
  TrendingUp, Star, Zap, ShieldCheck, Globe, Search
} from "lucide-react";
import { auth, db } from "./lib/firebase";
import { 
  signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut,
  signInWithEmailAndPassword
} from "firebase/auth";
import { 
  collection, addDoc, getDocs, query, orderBy, 
  deleteDoc, doc, updateDoc, serverTimestamp, getDoc, where 
} from "firebase/firestore";
import { cn, Service, BlogPost, Order } from "./lib/utils";

const ADMIN_EMAILS = ['yukselaral1@gmail.com', 'masalllardiyari@gmail.com'];

// --- Components ---

const Navbar = ({ user }: { user: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: "Anasayfa", path: "/" },
    { name: "Hizmetler", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "İletişim", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
            <Zap className="w-6 h-6 fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent">
            Artemis Digital
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={cn(
                "text-sm font-semibold tracking-wide transition-all",
                location.pathname === link.path ? "text-brand-primary" : "text-gray-400 hover:text-brand-primary"
              )}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl font-bold text-sm hover:bg-brand-primary/20 transition-all">
                <User className="w-4 h-4" /> Profilim
              </Link>
              {ADMIN_EMAILS.includes(user.email) && (
                <Link to="/admin" className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-brand-primary/10 hover:text-brand-primary transition-all">
                  <Settings className="w-5 h-5" />
                </Link>
              )}
            </div>
          ) : (
            <Link 
              to="/admin"
              className="px-6 py-2.5 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-brand-primary transition-all shadow-lg shadow-brand-dark/10"
            >
              Giriş Yap / Üye Ol
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-gray-600 p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 shadow-2xl p-6 flex flex-col gap-4 overflow-hidden"
          >
            {links.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-gray-700 hover:text-brand-primary p-4 rounded-2xl bg-gray-50/50"
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-brand-primary p-4 rounded-2xl bg-brand-primary/10 flex items-center gap-2"
                >
                  <User className="w-5 h-5" /> Profilim
                </Link>
                {ADMIN_EMAILS.includes(user.email) && (
                  <Link 
                    to="/admin" 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-gray-400 p-4 rounded-2xl bg-gray-50 flex items-center gap-2"
                  >
                    <Settings className="w-5 h-5" /> Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <Link 
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-lg font-bold text-white p-4 rounded-2xl bg-brand-dark flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" /> Giriş Yap / Üye Ol
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = () => {
  return (
    <div className="pt-20">
      {/* Wubito Style Hero */}
      <section className="relative min-h-[90vh] bg-[#0f172a] text-white flex items-center justify-center px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full">
           <div className="absolute top-20 left-20 w-96 h-96 bg-brand-primary/20 rounded-full blur-[150px]" />
           <div className="absolute bottom-20 right-20 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10 w-full">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-md">
              <span className="px-3 py-1 bg-brand-primary rounded-full text-[10px] font-black uppercase">Yeni</span>
              <span className="text-[10px] font-bold tracking-widest text-gray-300">TAKİPÇİ SATIN AL</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8">
              Kaliteli ve Etkili <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">Sosyal Medya</span> <br />
              Hizmetleri
            </h1>
            
            <p className="text-xl text-gray-400 font-medium mb-12 max-w-xl leading-relaxed">
              Artemis Digital, tüm sosyal medya platformları için benzersiz ve kaliteli hizmetler sunan en güvenilir büyüme ortağınızdır!
            </p>

            <div className="flex flex-wrap items-center gap-6">
               <Link to="/services" className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-brand-primary/30">
                 Hemen İncele
               </Link>
               
               <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                 <div className="w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center text-2xl font-black">4.9</div>
                 <div>
                   <p className="text-sm font-bold">12.000+ Değerlendirme</p>
                   <div className="flex text-amber-400">
                     {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                   </div>
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Mascot Side */}
          <div className="relative">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 flex items-center justify-center"
            >
              {/* Floating Icons */}
              <div className="absolute inset-0">
                 {[
                   { Icon: InstaIcon, color: "bg-pink-500", x: -60, y: -80, delay: 0 },
                   { Icon: Twitter, color: "bg-blue-400", x: -100, y: 40, delay: 0.2 },
                   { Icon: Tablet, color: "bg-white text-black", x: 120, y: -100, delay: 0.4 },
                   { Icon: MessageCircle, color: "bg-green-500", x: 140, y: 0, delay: 0.6 },
                   { Icon: globe => <Globe />, color: "bg-purple-500", x: 100, y: 120, delay: 0.8 }
                 ].map((item, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0 }}
                     animate={{ 
                       opacity: 1, 
                       x: item.x, 
                       y: item.y,
                       rotate: [0, 5, -5, 0]
                     }}
                     transition={{
                       opacity: { delay: item.delay },
                       rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                     }}
                     className={cn("absolute w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl", item.color)}
                   >
                     {typeof item.Icon === 'function' ? <item.Icon /> : <item.Icon className="w-6 h-6" />}
                   </motion.div>
                 ))}
              </div>

              {/* Koala Mascot */}
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-[80px]" />
                <img  
                  src="/ChatGPT Image 13 May 2026 17_22_12.png" 
                  alt="Koala Mascot"
                  className="w-full max-w-[500px] relative z-20 drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
          <Globe className="w-24 h-8" />
          <TrendingUp className="w-24 h-8" />
          <ShieldCheck className="w-24 h-8" />
          <Zap className="w-24 h-8" />
        </div>
      </section>

      {/* Platforms Grid */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight">Hangi Platformda <span className="italic">Parlamak İstersiniz?</span></h2>
          <p className="text-gray-400 max-w-xl mx-auto font-medium">Uzman ekibimizle tüm popüler platformlarda yanınızdayız.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: InstaIcon, name: "Instagram", desc: "Takipçi, Beğeni, İzlenme", color: "bg-pink-50 text-pink-500" },
            { icon: Tablet, name: "TikTok", desc: "İzlenme ve Takipçi", color: "bg-black text-white" },
            { icon: Twitter, name: "Twitter (X)", desc: "RT ve Like Etkileşimi", color: "bg-blue-50 text-blue-500" },
            { icon: MessageCircle, name: "Google Yorum", desc: "SEO ve Güven Artırımı", color: "bg-emerald-50 text-emerald-500" },
          ].map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white rounded-[40px] border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all"
            >
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8 shadow-inner", cat.color)}>
                <cat.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-3 tracking-tight">{cat.name}</h3>
              <p className="text-gray-400 font-medium mb-6">{cat.desc}</p>
              <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary group-hover:translate-x-2 transition-transform">
                Paketleri Gör <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const q = query(collection(db, "services"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service)));
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 className="animate-spin text-brand-primary" /></div>;

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <span className="text-brand-primary text-xs font-extrabold uppercase tracking-widest mb-4 block underline underline-offset-4 decoration-2">Premium Hizmetler</span>
          <h1 className="text-5xl font-black text-brand-dark tracking-tighter">Dijital Büyüme <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary italic">Paketleri</span></h1>
        </div>
        <p className="text-gray-400 max-w-md font-medium text-lg leading-relaxed">
          Tüm paketlerimiz gerçek kullanıcılar tarafından sağlanmaktadır. Şifrenize gerek olmadan, sadece kullanıcı adınızla işlem yapın.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <motion.div 
            key={service.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group glass relative p-10 rounded-[48px] overflow-hidden flex flex-col hover:shadow-3xl hover:shadow-brand-primary/20 transition-all border border-gray-100"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <span className="px-5 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  {service.category}
                </span>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Aktif
                </div>
              </div>
              
              <h3 className="text-3xl font-black text-brand-dark mb-4 tracking-tight leading-none">{service.name}</h3>
              <p className="text-gray-400 font-medium mb-8 leading-relaxed text-sm">
                {service.description}
              </p>
              
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-brand-dark tracking-tighter">{service.price}</span>
                <span className="text-xl font-bold text-gray-300 italic self-end">TL</span>
              </div>

              <div className="space-y-4 mb-10">
                {service.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-semibold text-gray-500">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link 
              to={`/contact?service=${encodeURIComponent(service.name)}&serviceId=${service.id}`}
              className="group/btn relative w-full py-6 bg-brand-dark text-white rounded-[24px] font-bold text-center hover:bg-brand-primary transition-all overflow-hidden flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              Siparişi Oluştur <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [params] = useState(new URLSearchParams(window.location.search));
  const serviceName = params.get("service") || "";
  const serviceId = params.get("serviceId") || "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    instagram: "",
    message: serviceName ? `${serviceName} paketini satın almak istiyorum.` : ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await addDoc(collection(db, "orders"), {
        ...formData,
        userId: auth.currentUser?.uid || null,
        serviceId,
        serviceName,
        status: status === "idle" ? "pending" : "pending", // just making sure logic flows
        createdAt: serverTimestamp()
      });

      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, serviceName })
      });

      if (!res.ok) throw new Error("Email error");

      setStatus("success");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", instagram: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 min-h-screen flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-primary/5 to-transparent -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl shadow-3xl shadow-brand-primary/10 rounded-[64px] overflow-hidden grid lg:grid-cols-5 glass"
      >
        <div className="lg:col-span-2 bg-brand-dark p-16 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px]" />
          <div className="relative z-10">
            <h1 className="text-5xl font-black leading-tight mb-8 tracking-tighter italic">Hayalindeki <br/> Kitleye <br/> Kavuş.</h1>
            <p className="text-xl text-gray-400 font-medium mb-12">
              Formu gönderdiğinde sipariş kodun oluşturulur ve teknik ekibimiz anında işleme başlar.
            </p>
            {serviceName && (
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/10 backdrop-blur-md">
                <span className="text-[10px] uppercase tracking-[0.3em] text-brand-primary font-black block mb-4">Seçilen Hizmet</span>
                <div className="flex items-center gap-4">
                  <ShoppingCart className="w-8 h-8 text-white opacity-50" />
                  <span className="text-2xl font-bold tracking-tight">{serviceName}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 pt-12 opacity-30">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">AES-256 SSL Encryption Secure</span>
          </div>
        </div>

        <div className="lg:col-span-3 p-16 lg:p-24 bg-white/40">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">İsim</label>
                <input 
                  required placeholder="Örn: Aral"
                  className="w-full px-8 py-5 bg-white border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none font-bold transition-all"
                  value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Soyisim</label>
                <input 
                  required placeholder="Örn: Yüksel"
                  className="w-full px-8 py-5 bg-white border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none font-bold transition-all"
                  value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">E-posta Adresi</label>
              <input 
                required type="email" placeholder="mail@ornek.com"
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none font-bold transition-all"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Gsm (Opsiyonel)</label>
                <input 
                  placeholder="05..."
                  className="w-full px-8 py-5 bg-white border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none font-bold transition-all"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Kullanıcı Adı / Link</label>
                <input 
                  placeholder="@username"
                  className="w-full px-8 py-5 bg-white border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none font-bold transition-all"
                  value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Detaylı İstekleriniz</label>
              <textarea 
                rows={4} placeholder="Yorum içeriği, hedef kitle vb..."
                className="w-full px-8 py-5 bg-white border border-gray-100 rounded-[28px] focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none font-bold transition-all resize-none"
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="flex items-center gap-3 px-4">
              <div className="w-5 h-5 bg-brand-primary rounded shadow-lg flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">KVKK ve Mesafeli Satış Sözleşmesini Kabul Ediyorum.</p>
            </div>

            <AnimatePresence>
              {status === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-emerald-50 text-emerald-700 rounded-[32px] border border-emerald-100 flex items-center gap-4 font-bold">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span>Harika! Siparişiniz alındı. E-posta kutunuzu kontrol edin, detaylar orada!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              disabled={status === "loading"}
              className="relative w-full py-6 bg-brand-primary text-white rounded-[32px] font-black text-xl flex items-center justify-center gap-3 hover:bg-brand-secondary transition-all shadow-3xl shadow-brand-primary/20 disabled:opacity-50 overflow-hidden group/submit"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/submit:translate-y-0 transition-transform duration-500" />
              {status === "loading" ? <Loader2 className="animate-spin" /> : <>Siparişi Onayla <Send className="w-6 h-6"/></>}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-20"><Loader2 className="animate-spin text-brand-primary" /></div>;

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <span className="text-brand-primary text-xs font-black uppercase tracking-widest mb-6 block">Haberler ve İpuçları</span>
        <h1 className="text-6xl font-black text-brand-dark tracking-tighter italic">Dijital Büyüme <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary underline decoration-8 decoration-white/20">Blogu</span></h1>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {posts.map((post) => (
          <motion.article 
            key={post.id} 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="aspect-[16/9] bg-gray-100 rounded-[56px] mb-10 overflow-hidden relative shadow-2xl shadow-gray-200 group-hover:shadow-brand-primary/20 transition-all border border-gray-100">
               <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
               {post.image ? (
                 <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
               ) : (
                 <div className="w-full h-full flex items-center justify-center"><FileText className="w-20 h-20 text-gray-200" /></div>
               )}
            </div>
            <div className="px-4">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                 <span className="bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest">{new Date(post.createdAt?.seconds * 1000).toLocaleDateString("tr-TR")}</span>
                 <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                 <span>Dijital Pazarlama</span>
              </div>
              <h2 className="text-4xl font-black text-brand-dark mb-6 group-hover:text-brand-primary leading-tight transition-colors tracking-tight italic line-clamp-2">{post.title}</h2>
              <p className="text-lg text-gray-400 font-medium leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-sm font-black text-brand-dark group-hover:gap-5 transition-all">
                Daha Fazla Oku <ChevronRight className="w-5 h-5 text-brand-primary" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

// --- Legal Page ---
const KVKKPage = () => {
  return (
    <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto">
      <h1 className="text-5xl font-black text-brand-dark tracking-tighter mb-12 italic">KVKK ve <span className="text-brand-primary">Gizlilik Politikası</span></h1>
      <div className="prose prose-lg text-gray-500 font-medium leading-loose space-y-8">
        <p>Artemis Digital olarak kişisel verilerinizin güvenliği hususuna azami hassasiyet göstermekteyiz. Bu bilinçle, Ajans olarak hizmetlerimizden faydalanan kişilere ait her türlü kişisel verinin 6698 sayılı Kişisel Verilerin Korunması Kanunu'na uygun olarak işlenerek muhafaza edilmesine büyük önem vermekteyiz.</p>
        
        <h3 className="text-2xl font-bold text-brand-dark">1. Veri Sorumlusu</h3>
        <p>6698 sayılı KVKK uyarınca kişisel verileriniz; veri sorumlusu olarak Artemis Digital tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

        <h3 className="text-2xl font-bold text-brand-dark">2. Kişisel Verilerin İşlenme Amacı</h3>
        <ul className="list-disc pl-8 space-y-4">
          <li>Sunduğumuz hizmetlerin ifa edilmesi,</li>
          <li>Siparişlerinizin doğrulanması ve takibi,</li>
          <li>Resend üzerinden e-posta bildirimlerinin iletilmesi,</li>
          <li>Müşteri taleplerinin yanıtlanması.</li>
        </ul>

        <h3 className="text-2xl font-bold text-brand-dark">3. İşlenen Veriler</h3>
        <p>Form üzerinden topladığımız; Ad-Soyad, E-posta, Telefon ve Sosyal Medya Kullanıcı adları hizmetin sunulabilmesi için zorunlu olan minimum verilerdir. Şifreleriniz kesinlikle talep edilmemekte ve işlenmemektedir.</p>
      </div>
    </div>
  );
};

// --- User Dashboard ---

const UserDashboard = ({ user }: { user: any }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  if (!user) return null;

  return (
    <div className="pt-32 pb-32 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-black text-brand-dark tracking-tighter italic">Siparişlerim</h1>
          <p className="text-gray-400 font-medium mt-2">Geçmişte oluşturduğunuz tüm talepler burada listelenir.</p>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="px-6 py-3 bg-rose-50 text-rose-500 rounded-xl font-bold text-sm hover:bg-rose-100 transition-all flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-primary" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 glass rounded-[48px] border-dashed border-2 border-gray-100">
           <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-6" />
           <p className="text-gray-400 font-bold mb-8">Henüz bir siparişiniz bulunmuyor.</p>
           <Link to="/services" className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold">Hemen Başla</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 bg-white border border-gray-100 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center text-2xl">
                  <Zap className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-brand-dark italic">{order.serviceName}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                    {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("tr-TR") : "İşleniyor..."}
                  </p>
                </div>
              </div>

              <div className={cn(
                "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest",
                order.status === 'completed' ? "bg-emerald-50 text-emerald-600" : 
                order.status === 'processing' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
              )}>
                {order.status === 'completed' ? 'Tamamlandı' : order.status === 'processing' ? 'İşleniyor' : 'Beklemede'}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Admin Panel Refresh ---

const AdminPanel = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'posts' | 'orders'>('orders');
  const [list, setList] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      navigate("/");
      return;
    }
    fetchData();
  }, [activeTab, user]);

  const fetchData = async () => {
    setLoading(true);
    const q = query(collection(db, activeTab), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    setList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  const handleCreate = async () => {
    await addDoc(collection(db, activeTab), { ...newItem, createdAt: serverTimestamp() });
    setShowAdd(false);
    setNewItem({});
    fetchData();
  };

  const handleDelete = async (id: string, coll: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    await deleteDoc(doc(db, coll, id));
    fetchData();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateDoc(doc(db, "orders", id), { status });
    fetchData();
  };

  if (!user) return null;

  return (
    <div className="pt-20 min-h-screen bg-[#fafafa] flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r border-gray-100 p-10 flex flex-col justify-between sticky h-screen">
        <div>
          <div className="mb-12 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary p-1 shadow-xl">
              <img src={user.photoURL} className="w-full h-full object-cover rounded-xl" alt="avatar" />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Veri Merkezi</p>
               <h4 className="font-black text-brand-dark">{user.displayName?.split(' ')[0]}</h4>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { id: 'orders', name: 'Siparişler', icon: ShoppingCart },
              { id: 'services', name: 'Ürünlerimiz', icon: Briefcase },
              { id: 'posts', name: 'Blog Yazıları', icon: FileText }
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full px-6 py-4 rounded-2xl flex items-center gap-4 font-bold transition-all border outline-none", 
                  activeTab === tab.id 
                    ? "bg-brand-dark text-white border-brand-dark shadow-xl" 
                    : "text-gray-400 border-transparent hover:bg-gray-50"
                )}
              >
                <tab.icon className="w-5 h-5"/> {tab.name}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="mt-12 w-full px-6 py-4 text-rose-500 font-bold flex items-center gap-4 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-2xl transition-all outline-none"
        >
          <LogOut className="w-5 h-5"/> Panelden Çık
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-8 lg:p-16 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
          <div>
             <h1 className="text-5xl font-black text-brand-dark tracking-tighter italic">
               {activeTab === 'orders' ? 'Sipariş Takibi' : activeTab === 'services' ? 'Ürün Yönetimi' : 'Blog Yönetimi'}
             </h1>
             <p className="text-gray-400 font-medium mt-2">Toplam {list.length} kayıt listeleniyor.</p>
          </div>
          {activeTab !== 'orders' && (
            <button 
              onClick={() => setShowAdd(true)}
              className="px-8 py-4 bg-brand-primary text-white rounded-[24px] font-bold flex items-center gap-3 hover:shadow-2xl hover:shadow-brand-primary/20 transition-all outline-none"
            >
              <Plus className="w-6 h-6" /> Yeni İçerik Ekle
            </button>
          )}
        </div>

        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-16 p-12 bg-white rounded-[48px] border border-gray-100 shadow-2xl space-y-6"
          >
            {activeTab === 'services' ? (
              <div className="grid md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                   <input placeholder="Hizmet Adı (Örn: 500 Takipçi)" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, name: e.target.value})} />
                   <input placeholder="Kategori (Instagram, TikTok vb.)" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, category: e.target.value})} />
                   <input type="number" placeholder="Fiyat (Sadece rakam)" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} />
                 </div>
                 <div className="space-y-4">
                    <textarea placeholder="Kısa Açıklama" rows={5} className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, description: e.target.value})} />
                    <p className="text-xs text-gray-400 ml-4 font-bold">Özellikleri eklemek için daha sonra güncelleyebilirsiniz.</p>
                 </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <input placeholder="Yazı Başlığı" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, title: e.target.value})} />
                  <input placeholder="URL Uzantısı (slug)" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, slug: e.target.value})} />
                  <input placeholder="Görsel URL" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, image: e.target.value})} />
                </div>
                <div className="space-y-4">
                  <textarea placeholder="Özet (SEO için)" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, excerpt: e.target.value})} />
                  <textarea rows={10} placeholder="Tüm İçerik" className="w-full p-4 border rounded-2xl font-bold bg-gray-50 outline-none" onChange={e => setNewItem({...newItem, content: e.target.value})} />
                </div>
              </div>
            )}
            <div className="flex gap-4 pt-6">
               <button onClick={handleCreate} className="px-10 py-5 bg-brand-primary text-white rounded-[24px] font-black hover:scale-105 transition-transform shadow-xl shadow-brand-primary/20">Kaydet ve Yayınla</button>
               <button onClick={() => setShowAdd(false)} className="px-10 py-5 bg-gray-100 rounded-[24px] font-black">Vazgeç</button>
            </div>
          </motion.div>
        )}

        <div className="grid gap-6">
          {loading ? (
             <div className="flex justify-center p-20"><Loader2 className="animate-spin text-brand-primary" /></div>
          ) : list.length === 0 ? (
             <div className="text-center p-20 glass rounded-[48px]">
               <Search className="w-12 h-12 text-gray-200 mx-auto mb-6" />
               <p className="text-gray-400 font-bold">Henüz kayıt bulunmamaktadır.</p>
             </div>
          ) : (
            list.map(item => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-8 bg-white border border-gray-100 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-6">
                   <div className={cn(
                     "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0",
                     activeTab === 'orders' ? "bg-emerald-50 text-emerald-500" : activeTab === 'services' ? "bg-brand-primary/10 text-brand-primary" : "bg-purple-50 text-purple-500"
                   )}>
                     {activeTab === 'orders' ? <ShoppingCart className="w-8 h-8"/> : activeTab === 'services' ? <Briefcase className="w-8 h-8"/> : <FileText className="w-8 h-8"/>}
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-brand-dark tracking-tight leading-tight italic">
                        {activeTab === 'orders' ? `${item.firstName} ${item.lastName}` : (item.name || item.title)}
                      </h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {activeTab === 'orders' ? item.email : (item.category || item.slug)}
                        {item.createdAt && ` • ${new Date(item.createdAt.seconds * 1000).toLocaleDateString()}`}
                      </p>
                   </div>
                </div>

                {activeTab === 'orders' && (
                   <div className="flex-1 max-w-sm px-6 border-x border-gray-50">
                      <p className="text-xs text-gray-400 font-bold uppercase mb-2">Sipariş: <span className="text-brand-primary">{item.serviceName || "Özel Mesaj"}</span></p>
                      <p className="text-sm font-medium text-gray-500 italic line-clamp-1">"{item.message}"</p>
                      <p className="text-xs font-bold text-gray-400 mt-2">Kullanıcı: {item.instagram || "-"}</p>
                   </div>
                )}

                <div className="flex items-center gap-3">
                  {activeTab === 'orders' && (
                     <select 
                        value={item.status} 
                        onChange={(e) => handleStatusUpdate(item.id, e.target.value)}
                        className="px-4 py-2 border border-gray-100 rounded-xl text-xs font-black outline-none bg-gray-50"
                     >
                       <option value="pending">BEKLEMEDE</option>
                       <option value="processing">İŞLENİYOR</option>
                       <option value="completed">TAMAMLANDI</option>
                     </select>
                  )}
                  <button onClick={() => handleDelete(item.id, activeTab)} className="p-4 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100 outline-none">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError("Firebase: Error (auth/unauthorized-domain). Lütfen domain'i Firebase Authorized Domains listesine ekleyin.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError("Hatalı giriş: E-posta veya şifre yanlış.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[48px] shadow-2xl border border-gray-100"
      >
        <Zap className="w-16 h-16 text-brand-primary mb-8 mx-auto" />
        <h2 className="text-3xl font-black text-brand-dark mb-2 tracking-tighter italic text-center">Giriş Yap</h2>
        <p className="text-gray-400 font-medium mb-10 text-center">Paneliniz için giriş yapın.</p>

        {error && <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl text-xs font-bold mb-6 border border-rose-100">{error}</div>}

        <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4">E-posta</label>
            <input 
              type="email" 
              required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-brand-primary transition-all font-bold"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4">Şifre</label>
            <input 
              type="password" 
              required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-brand-primary transition-all font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black text-lg hover:bg-brand-primary transition-all disabled:opacity-50 shadow-xl shadow-brand-dark/10"
          >
            {loading ? <Loader2 className="animate-spin mx-auto text-white" /> : "Giriş Yap"}
          </button>
        </form>

        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-black text-gray-300 uppercase">Veya</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-4 bg-white border border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" /> Google ile Devam Et
        </button>

        <Link to="/" className="mt-10 block text-center text-sm font-bold text-gray-400 hover:text-brand-primary transition-all">Anasayfaya Dön</Link>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#fafafa]"><Loader2 className="animate-spin text-brand-primary" /></div>;

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <ScrollToTop />
        <Navbar user={user} />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/dashboard" element={<UserDashboard user={user} />} />
          <Route path="/legal/kvkk" element={<KVKKPage />} />
          <Route path="/admin" element={user ? (ADMIN_EMAILS.includes(user.email) ? <AdminPanel user={user} /> : <UserDashboard user={user} />) : <AdminLogin />} />
        </Routes>

        <footer className="py-32 bg-brand-dark overflow-hidden relative border-t border-white/5">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-full bg-brand-primary/5 rounded-[100%] blur-[120px] pointer-events-none" />
           
           <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="grid lg:grid-cols-4 gap-20 mb-32">
                <div className="lg:col-span-2">
                   <div className="flex items-center gap-2 mb-8">
                     <Zap className="w-8 h-8 text-brand-primary fill-current" />
                     <span className="text-2xl font-black tracking-tighter text-white">Artemis Digital</span>
                   </div>
                   <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-md">
                     Sınırları zorlayan, yaratıcı ve güvenilir sosyal medya ortağınız. Yarının dijital dünyasını bugünden inşa ediyoruz.
                   </p>
                </div>
                <div className="space-y-6">
                   <h4 className="text-white font-black text-sm uppercase tracking-widest">Hızlı Erişim</h4>
                   <div className="flex flex-col gap-4 text-gray-500 font-bold text-sm">
                      <Link to="/services" className="hover:text-brand-primary transition-colors">Hizmetler</Link>
                      <Link to="/blog" className="hover:text-brand-primary transition-colors">Dijital Blog</Link>
                      <Link to="/contact" className="hover:text-brand-primary transition-colors">İletişim</Link>
                   </div>
                </div>
                <div className="space-y-6">
                   <h4 className="text-white font-black text-sm uppercase tracking-widest">Yasal</h4>
                   <div className="flex flex-col gap-4 text-gray-500 font-bold text-sm">
                      <Link to="/legal/kvkk" className="hover:text-brand-primary transition-colors">KVKK Aydınlatma Metni</Link>
                      <Link to="/legal/kvkk" className="hover:text-brand-primary transition-colors">Gizlilik Politikası</Link>
                      <Link to="/legal/kvkk" className="hover:text-brand-primary transition-colors">Mesafeli Satış</Link>
                   </div>
                </div>
             </div>

             <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-8">
                   <InstaIcon className="w-6 h-6 text-gray-600 hover:text-white transition-colors cursor-pointer" />
                   <Twitter className="w-6 h-6 text-gray-600 hover:text-white transition-colors cursor-pointer" />
                   <Mail className="w-6 h-6 text-gray-600 hover:text-white transition-colors cursor-pointer" />
                </div>
                <div className="text-[12px] font-black uppercase tracking-[0.3em] text-gray-600 whitespace-nowrap">
                   &copy; {new Date().getFullYear()} Artemis Digital &bull; Crafted for Luxury Büyüme
                </div>
             </div>
           </div>
        </footer>
      </div>
    </Router>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
