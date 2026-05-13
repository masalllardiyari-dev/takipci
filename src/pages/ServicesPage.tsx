import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { 
  CheckCircle2, Loader2 
} from "lucide-react";
import { collection, onSnapshot, query, orderBy, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn, Service } from "../lib/utils";

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFilter = queryParams.get("category");

  useEffect(() => {
    let q = query(collection(db, "services"), orderBy("createdAt", "desc"));
    
    if (categoryFilter) {
      // Note: Firestore 'where' is case-sensitive. 
      // We assume categories are stored in a standard format.
      // If we want case-insensitivity, we'd fetch all and filter in JS or normalize.
      // For now, let's just fetch all and filter in JS to stay safe with existing data patterns.
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let allServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      
      if (categoryFilter) {
        allServices = allServices.filter(s => 
          s.category?.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
      
      setServices(allServices);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Services Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-red-500 w-8 h-8" />
    </div>
  );

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
          {categoryFilter ? `${categoryFilter.toUpperCase()} Paketleri` : "Hizmetlerimiz"}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
          Büyüme <span className="text-red-500">Paketleri</span>
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Tüm paketlerimiz gerçek kullanıcılar tarafından sağlanır. Şifresiz, güvenli işlem.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 font-semibold">Bu kategoride henüz hizmet bulunmuyor.</p>
          <Link to="/services" className="text-red-500 font-bold hover:underline mt-4 inline-block">Tüm Hizmetleri Gör</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative p-8 rounded-3xl border transition-all flex flex-col",
                index === 1
                  ? "bg-gradient-to-br from-red-50 to-orange-50 border-red-200 shadow-lg"
                  : "bg-white border-gray-100 hover:border-red-200 hover:shadow-lg"
              )}
            >
              {index === 1 && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-[10px] font-bold text-white">
                  EN POPÜLER
                </div>
              )}

              <span className="inline-block px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 self-start">
                {service.category}
              </span>

              <h3 className="text-2xl font-black text-gray-800 mb-2 leading-tight">{service.name}</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-1">{service.description}</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-gray-800">{service.price}</span>
                <span className="text-lg text-gray-400 font-bold">TL</span>
              </div>

              <div className="space-y-3 mb-8">
                {service.features?.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                    <CheckCircle2 className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to={`/contact?service=${encodeURIComponent(service.name)}&serviceId=${service.id}`}
                className={cn(
                  "block w-full py-4 rounded-2xl font-bold text-center transition-all",
                  index === 1
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 hover:from-red-600 hover:to-red-700"
                    : "bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-500"
                )}
              >
                Sipariş Ver
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
