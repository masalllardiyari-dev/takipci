import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Users, Star, Award, ArrowRight, Heart,
  ShieldCheck, Clock, ChevronRight, MessageCircle,
  Globe, Facebook, Youtube, Twitter, Instagram as InstaIcon,
  Tablet, MessageSquare, Send, Zap, Briefcase, FileText, LucideIcon
} from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn, Category } from "../lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  Instagram: InstaIcon,
  TikTok: Tablet,
  Twitter: Twitter,
  Facebook: Facebook,
  Youtube: Youtube,
  Google: MessageCircle,
  Default: Globe
};

const HomePage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceCounts, setServiceCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from Firestore
    const qCats = query(collection(db, "categories"), orderBy("order"));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      if (!snapshot.empty) {
        setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
      } else {
        setCategories([
          { id: '1', name: "Instagram", slug: "instagram", icon: "Instagram", description: "Takipçi, Beğeni ve İzlenme paketleriyle hesabını büyüt.", color: "from-pink-500 to-red-500", textColor: "text-red-500", order: 1 },
          { id: '2', name: "TikTok", slug: "tiktok", icon: "TikTok", description: "Videolarına anında izlenme ve takipçi kazandır.", color: "from-gray-800 to-black", textColor: "text-gray-900", order: 2 },
          { id: '3', name: "Twitter", slug: "twitter", icon: "Twitter", description: "Etkileşim, retweet ve beğeni gönder.", color: "from-sky-500 to-blue-600", textColor: "text-sky-600", order: 3 },
          { id: '4', name: "Facebook", slug: "facebook", icon: "Facebook", description: "Sayfa beğenisi ve gönderi etkileşimi.", color: "from-blue-600 to-blue-700", textColor: "text-blue-700", order: 4 },
          { id: '5', name: "Youtube", slug: "youtube", icon: "Youtube", description: "İzlenme, abone ve beğeni paketleri.", color: "from-red-600 to-red-700", textColor: "text-red-600", order: 5 },
        ] as any);
      }
    });

    // Fetch service counts from Firestore
    const unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach((doc) => {
        const service = doc.data();
        const cat = service.category?.toLowerCase();
        if (cat) counts[cat] = (counts[cat] || 0) + 1;
      });
      setServiceCounts(counts);
    });

    return () => {
      unsubCats();
      unsubServices();
    };
  }, []);

  return (
    <div className="pt-20 bg-gray-50/50">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] bg-gray-900 flex items-center justify-center px-6 overflow-hidden">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[120px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -ml-20 -mb-20" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10 w-full pt-10 pb-32">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full mb-8 border border-white/10">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-[10px] font-black text-white uppercase"><Sparkles className="w-3 h-3" /> Popüler</span>
              <span className="text-xs font-bold text-gray-300 tracking-wide uppercase">Sosyal Medya Çözümleri</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">Sosyal Medyada<br /><span className="relative inline-block"><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">Zirveye Ulaş</span></span></h1>
            <p className="text-lg text-gray-400 font-medium mb-8 max-w-lg leading-relaxed">Güvenli, hızlı ve şifresiz sosyal medya paketleriyle hesabınızı bugün büyütmeye başlayın.</p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/services" className="group px-8 py-4 bg-red-600 text-white rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 flex items-center gap-2">Paketleri İncele <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Link>
              <Link to="/contact" className="px-8 py-4 bg-white/5 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all border border-white/10">Destek Al</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative flex items-center justify-center">
            <div className="relative z-10">
              <motion.img animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} src="/ChatGPT Image 13 May 2026 17_22_12.png" alt="Mascot" className="w-full max-w-[440px] relative z-10 drop-shadow-[0_20px_50px_rgba(239,68,68,0.2)]" />
            </div>

            {/* Floating Icons Layer */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              {[
                { Icon: InstaIcon, color: "bg-gradient-to-br from-pink-500 to-red-500", x: -200, y: -200, delay: 0 },
                { Icon: Tablet, color: "bg-black", x: -200, y: -10, delay: 0.2 },
                { Icon: Youtube, color: "bg-red-600", x: -180, y: 140, delay: 0.3 },
                { Icon: Twitter, color: "bg-sky-500", x: 200, y: -200, delay: 0.4 },
                { Icon: Facebook, color: "bg-blue-600", x: 220, y: -10, delay: 0.5 },
                { Icon: Globe, color: "bg-indigo-500", x: 180, y: 140, delay: 0.6 },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, x: item.x, y: item.y }} transition={{ delay: item.delay + 0.5, type: "spring", stiffness: 150, damping: 15 }} className="absolute" style={{ left: '50%', top: '50%' }}>
                  <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 + i, ease: "easeInOut" }} className={cn("w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl text-white border-2 border-white/20 backdrop-blur-md", item.color)}>
                    <item.Icon className="w-8 h-8" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Section - OVERLAPPING */}
      <section className="relative z-30 -mt-55 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat, i) => {
              const Icon = ICON_MAP[cat.icon] || ICON_MAP.Default;
              const count = serviceCounts[cat.slug.toLowerCase()] || (i === 0 ? 20 : i === 1 ? 6 : i === 2 ? 7 : i === 3 ? 4 : 8);
              return (
                <Link key={cat.id} to={`/services?category=${cat.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                    whileHover={{ y: -10 }}
                    className="group bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-red-500/10 transition-all text-center border border-gray-100 flex flex-col items-center h-full"
                  >
                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg bg-gray-50 group-hover:scale-110 transition-transform", cat.textColor)}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-gray-800">{cat.name}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 mb-6">Hizmetler</p>

                    <div className="w-full h-px bg-gray-100 mb-6" />

                    <p className={cn("text-sm font-black tracking-wide group-hover:scale-105 transition-transform", cat.textColor)}>
                      {count} Hizmet
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Güvenli Ödeme", desc: "256-bit SSL Koruması" },
              { icon: Clock, title: "Anında Teslimat", desc: "Otomatik Sistem" },
              { icon: Users, title: "Gerçek Kullanıcı", desc: "Bot Kullanılmaz" },
              { icon: Heart, title: "7/24 Destek", desc: "Canlı Yardım" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0"><item.icon className="w-6 h-6 text-red-500" /></div>
                <div><h4 className="text-sm font-bold text-gray-800">{item.title}</h4><p className="text-xs text-gray-400">{item.desc}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center p-12 md:p-16 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl shadow-red-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <Heart className="w-12 h-12 text-white fill-white mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Hazır mısın? Haydi Büyümeye Başla!</h2>
              <p className="text-red-100 text-lg mb-8 max-w-lg mx-auto">Ücretsiz üye ol, ilk siparişine özel indirimleri kaçırma.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/services" className="px-8 py-4 bg-white text-red-500 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all shadow-lg">Paketleri İncele</Link>
                <Link to="/login" className="px-8 py-4 bg-red-700 text-white rounded-2xl font-bold text-lg hover:bg-red-800 transition-all border border-red-400">Ücretsiz Üye Ol</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
