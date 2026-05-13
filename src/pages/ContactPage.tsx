import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Send, Mail, Phone, Instagram, User, MessageSquare, 
  CheckCircle2, AlertCircle, Loader2, ShieldCheck
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";

const ContactPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const serviceName = params.get("service") || "";
  const serviceId = params.get("serviceId") || "";
  const isDemo = params.get("demo") === "true";
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", instagram: "",
    message: isDemo ? "Ücretsiz demo paketi talep ediyorum." : (serviceName ? `${serviceName} paketini satın almak istiyorum.` : "")
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Reset form when URL params change (e.g. from Contact to Demo)
  useEffect(() => {
    setFormData({
      firstName: "", lastName: "", email: "", phone: "", instagram: "",
      message: isDemo ? "Ücretsiz demo paketi talep ediyorum." : (serviceName ? `${serviceName} paketini satın almak istiyorum.` : "")
    });
    setStatus("idle");
    setErrorDetail(null);
    setOrderId(null);
    window.scrollTo(0, 0);
  }, [location.search, isDemo, serviceName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.instagram || !formData.email) {
      alert("Lütfen Kullanıcı Adı ve E-Posta alanlarını doldurun.");
      return;
    }
    setStatus("loading");
    setErrorDetail(null);
    try {
      // Migrate to Firestore
      const orderData = {
        ...formData,
        serviceName: isDemo ? "Demo Paket" : serviceName,
        serviceId: isDemo ? "demo-pkg" : serviceId,
        status: "pending",
        type: isDemo ? "demo" : "order",
        userId: auth.currentUser?.uid || "guest",
        createdAt: serverTimestamp()
      };
      
      let id = "";
      try {
        const docRef = await addDoc(collection(db, "orders"), orderData);
        id = docRef.id;
        setOrderId(id);
      } catch (dbError: any) {
        console.error("Firestore Kayıt Hatası (Sipariş yine de mail ile iletilecek):", dbError);
        id = "MAIL-ONLY-" + Math.random().toString(36).substr(2, 9).toUpperCase();
        setOrderId(id);
      }

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, serviceName: isDemo ? "Demo Paket" : serviceName, orderId: id }),
      });

      if (response.ok) {
        setStatus("success");
      } else {
        const errorData = await response.json();
        setStatus("error");
        setErrorDetail(errorData.details || errorData.error || "Bilinmeyen bir hata oluştu.");
      }
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorDetail(error.message);
    }
  };

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            {isDemo ? "Ücretsiz Deneyim" : "İletişim & Sipariş"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-6">
            {isDemo ? "Demo Paket" : "Sipariş"} <span className="text-red-500">{isDemo ? "Talep Et" : "Formu"}</span>
          </h1>
          
          {/* CRITICAL INSTRUCTIONS */}
          <div className="bg-orange-50 border-2 border-dashed border-orange-200 p-8 rounded-[2rem] mb-10">
            <div className="flex items-center gap-3 mb-6 text-orange-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-black text-lg">ÖNEMLİ: Sipariş Öncesi Ayarlar</h3>
            </div>
            <p className="text-orange-800 text-sm font-bold mb-6 leading-relaxed">Sipariş vermeden önce hesabınızda "İnceleme İçin İşaretle" özelliğini kapatmanız gerekmektedir. Aksi takdirde siparişiniz hataya düşecektir.</p>
            <div className="space-y-4">
              {[
                "1. 'Ayarlar ve Eylemler'e gidin",
                "2. 'Arkadaşlarını Davet Et ve Takip Et'i seçin",
                "3. 'İnceleme İçin İşaretle'yi Devre Dışı Bırakın"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-orange-100 text-sm font-black text-orange-700">
                   <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-[10px]">{i+1}</div>
                   {step}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-10 flex gap-4">
            <ShieldCheck className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-xs font-bold leading-relaxed">
              DİKKAT: Verilen siparişler dijital ortamda anında teslim edildiği için işlemlerin **iadesi mümkün değildir.** Lütfen bilgilerinizi kontrol ederek sipariş veriniz.
            </p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-red-100/20">
          {status === "success" ? (
            <div className="text-center py-10">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle2 className="w-12 h-12" /></div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">{isDemo ? "Talebiniz Alındı!" : "Sipariş Alındı!"}</h2>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                {isDemo ? "Demo paketiniz kısa süre içinde hesabınıza tanımlanacaktır." : "Siparişiniz başarıyla oluşturuldu. Takip kodunuz aşağıdadır:"}
              </p>
              
              {!isDemo && (
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8 select-all cursor-copy group">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Takip Kodunuz</p>
                  <p className="text-2xl font-black text-red-500 tracking-wider group-hover:scale-105 transition-transform">{orderId}</p>
                </div>
              )}

              <div className="space-y-4">
                <button onClick={() => setStatus("idle")} className="w-full py-4 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all">
                  {isDemo ? "Formu Kapat" : "Yeni Sipariş Ver"}
                </button>
                <Link to="/" className="block text-sm font-bold text-red-500 hover:underline">Anasayfaya Dön</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Adınız</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 text-sm font-medium" placeholder="Ad" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} /></div></div>
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Soyadınız</label><div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 text-sm font-medium" placeholder="Soyad" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} /></div></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">E-Posta (Zorunlu)</label><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="email" required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 text-sm font-medium" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div></div>
              
              {!isDemo && (
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">WhatsApp No</label><div className="relative"><Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input required={!isDemo} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 text-sm font-medium" placeholder="05XX XXX XX XX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div></div>
              )}

              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Instagram Kullanıcı Adı (Zorunlu)</label><div className="relative"><Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input required className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 text-sm font-medium" placeholder="@kullaniciadi" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} /></div></div>
              
              {!isDemo && (
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Mesajınız</label><div className="relative"><MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-400" /><textarea required rows={4} className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 text-sm font-medium" placeholder="Size nasıl yardımcı olabiliriz?" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} /></div></div>
              )}
              
              {status === "error" && (
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl flex flex-col gap-1 text-sm font-bold border border-red-100">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" /> 
                    Bir hata oluştu.
                  </div>
                  {errorDetail && (
                    <p className="text-[10px] font-medium opacity-80 mt-1 pl-8">
                      Hata: {errorDetail}
                    </p>
                  )}
                </div>
              )}
              
              <button disabled={status === "loading"} className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 disabled:opacity-50">
                {status === "loading" ? <Loader2 className="animate-spin w-6 h-6" /> : <><Send className="w-5 h-5" /> {isDemo ? "Ücretsiz Demo Al" : "Siparişi Tamamla"}</>}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
