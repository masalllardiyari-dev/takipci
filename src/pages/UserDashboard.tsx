import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ShoppingCart, LogOut, Loader2 
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { cn, Order } from "../lib/utils";

const UserDashboard = ({ user }: { user: any }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/"); return; }
    
    // Migrate to Firestore
    const q = query(
      collection(db, "orders"), 
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      })) as any[];
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Listen Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-800">Siparişlerim</h1>
          <p className="text-gray-500 mt-1">Tüm sipariş geçmişiniz.</p>
        </div>
        <button onClick={() => signOut(auth)} className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl font-semibold text-sm hover:bg-red-100 transition-all flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-500 w-8 h-8" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
          <ShoppingCart className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 font-semibold mb-6">Henüz siparişiniz yok.</p>
          <Link to="/services" className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all">Hemen Başla</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-white rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-red-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{order.serviceName}</h4>
                  <p className="text-xs text-gray-400">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("tr-TR") : "-"}</p>
                </div>
              </div>
              <span className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider",
                order.status === 'completed' ? "bg-green-50 text-green-600" :
                  order.status === 'processing' ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
              )}>
                {order.status === 'completed' ? 'Tamamlandı' : order.status === 'processing' ? 'İşleniyor' : 'Beklemede'}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
