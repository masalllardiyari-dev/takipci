import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Search, Package, CheckCircle2, 
  Clock, AlertCircle, Loader2, CreditCard, XCircle
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { cn } from "../lib/utils";

const OrderTrackingPage = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const idTrimmed = orderId.trim();
    if (!idTrimmed) return;

    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      // Migrate to Firestore
      const orderRef = doc(db, "orders", idTrimmed);
      const snapshot = await getDoc(orderRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setOrderData({ 
          id: snapshot.id, 
          ...data,
          // Handle Firestore Timestamps
          createdAt: data.createdAt?.toDate?.() || data.createdAt 
        });
      } else {
        setError("Sipariş kodu bulunamadı. Lütfen kodu kontrol ederek tekrar deneyin.");
      }
    } catch (err) {
      console.error(err);
      setError("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="relative mb-8">
              <motion.img 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                src="/search.png" 
                alt="Search" 
                className="w-full max-w-[280px] mx-auto drop-shadow-2xl relative z-10" 
              />
              <div className="absolute inset-0 bg-red-100/30 rounded-full blur-[60px] w-48 h-48 mx-auto -z-10" />
            </div>
            <h1 className="text-4xl font-black text-gray-800 mb-4">Sipariş <span className="text-red-500">Sorgulama</span></h1>
            <p className="text-gray-500 max-w-lg mx-auto">Sipariş kodunuzu girerek paketinizin durumunu ve ödeme bilgisini anlık olarak kontrol edebilirsiniz.</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200 border border-white">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Sipariş Kodunu Girin (Örn: -OR...)" 
                className="w-full pl-14 pr-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-bold text-gray-700 transition-all"
              />
            </div>
            <button 
              disabled={loading}
              className="px-10 py-5 bg-red-500 text-white rounded-2xl font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><Search className="w-5 h-5" /> Sorgula</>}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-red-50 text-red-500 rounded-2xl flex items-center gap-4 border border-red-100 font-bold">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <AnimatePresence>
            {orderData && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div className="p-8 bg-gray-900 rounded-[2rem] text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
                   <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sipariş Bilgisi</p>
                        <h4 className="text-2xl font-black">{orderData.serviceName}</h4>
                        <p className="text-gray-400 text-sm mt-1">{orderData.firstName} {orderData.lastName}</p>
                      </div>
                      <div className={cn(
                        "px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2",
                        orderData.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        orderData.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        orderData.status === 'unpaid' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      )}>
                        {orderData.status === 'completed' ? 'TAMAMLANDI' : 
                         orderData.status === 'processing' ? 'İŞLENİYOR' : 
                         orderData.status === 'unpaid' ? 'ÖDEME BEKLENİYOR' : 'BEKLEMEDE'}
                      </div>
                   </div>
                   
                   <div className="mt-8">
                     <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/5">
                        <div className={cn("h-full transition-all duration-1000", 
                          orderData.status === 'completed' ? 'bg-green-500 w-full' :
                          orderData.status === 'processing' ? 'bg-blue-500 w-2/3' :
                          orderData.status === 'unpaid' ? 'bg-red-500 w-[5%]' : 'bg-yellow-500 w-1/3'
                        )} />
                     </div>
                     <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-tighter">
                        <span>Sipariş Alındı</span>
                        <span>Hazırlanıyor</span>
                        <span>Tamamlandı</span>
                     </div>
                   </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6" /></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sipariş Tarihi</p>
                        <p className="font-bold text-gray-800">{new Date(orderData.createdAt).toLocaleDateString('tr-TR')} - {new Date(orderData.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  </div>
                  <div className={cn(
                    "p-6 border rounded-[1.5rem] shadow-sm",
                    orderData.status === 'unpaid' ? "bg-red-50 border-red-100" : "bg-white border-gray-100"
                  )}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        orderData.status === 'unpaid' ? "bg-red-500 text-white" : "bg-green-50 text-green-500"
                      )}>{orderData.status === 'unpaid' ? <XCircle className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}</div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ödeme Durumu</p>
                        <p className={cn("font-bold", orderData.status === 'unpaid' ? "text-red-500" : "text-green-600")}>
                          {orderData.status === 'unpaid' ? 'ÖDEME ALINMADI' : 'ÖDEME ONAYLANDI'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center flex-shrink-0"><Package className="w-5 h-5" /></div>
                    <p className="text-blue-800 font-medium leading-relaxed">
                      {orderData.status === 'completed' ? 'Paketiniz başarıyla teslim edilmiştir. Herhangi bir sorunuz için destek hattımızla iletişime geçebilirsiniz.' :
                       orderData.status === 'processing' ? 'Hizmetiniz şu an sistem tarafından işlenmektedir. Sosyal medya hesabınızın gizli olmadığından emin olun.' :
                       orderData.status === 'unpaid' ? 'Siparişinizin işleme alınması için ödemenizin onaylanması gerekmektedir. Lütfen WhatsApp hattımızdan bizimle iletişime geçin.' :
                       'Siparişiniz kuyruğa alınmıştır. Teknik ekibimiz inceledikten sonra işlem başlatılacaktır.'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
