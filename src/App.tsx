import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Mail, Phone, Instagram, User, MessageSquare, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  message: string;
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  instagram: "",
  message: "",
};

export default function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Bir hata oluştu");
      }

      setStatus("success");
      setFormData(initialFormData);
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: any) {
      console.error("Submission Error:", error);
      setStatus("error");
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-6 sm:p-12 font-sans overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl border border-[#E5E0D8] overflow-hidden"
      >
        <div className="grid md:grid-cols-5 min-h-[600px]">
          {/* Left Branding Section */}
          <div className="md:col-span-2 bg-[#5A5A40] p-10 flex flex-col justify-between text-[#F7F5F0]">
            <div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-serif italic mb-16 opacity-90"
              >
                Artemis Digital
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl lg:text-5xl font-serif leading-tight mb-6"
              >
                Bize Bir Not Bırakın.
              </motion.h1>
              <p className="text-lg opacity-80 font-light leading-relaxed">
                Fikirlerinizi gerçeğe dönüştürmek için buradayız. Formu doldurun, en kısa sürede size dönüş yapalım.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 opacity-90">
                <div className="w-10 h-10 rounded-full bg-[#6B6B4D] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#F7F5F0]" />
                </div>
                <span className="text-sm tracking-wide">hello@artemis.digital</span>
              </div>
              <div className="flex items-center gap-4 opacity-90">
                <div className="w-10 h-10 rounded-full bg-[#6B6B4D] flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-5 h-5 text-[#F7F5F0]" />
                </div>
                <span className="text-sm tracking-wide font-medium">@artemis.design</span>
              </div>
              <div className="pt-8 block">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-bold">API Active: Resend integration</span>
              </div>
            </div>
          </div>

          {/* Right Form Section */}
          <div className="md:col-span-3 p-10 lg:p-14 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xs uppercase tracking-[0.2em] text-[#5A5A40] font-bold">İletişim Formu</h2>
              <span className="text-[11px] text-gray-400 font-mono opacity-60">z</span>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-6 flex flex-col">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">İsim</label>
                  <input
                    required
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ahmet"
                    className="w-full px-5 py-3 bg-[#FBFBFA] border border-[#E5E0D8] rounded-2xl focus:border-[#5A5A40] focus:outline-none text-[#5A5A40] transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Soyisim</label>
                  <input
                    required
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Yılmaz"
                    className="w-full px-5 py-3 bg-[#FBFBFA] border border-[#E5E0D8] rounded-2xl focus:border-[#5A5A40] focus:outline-none text-[#5A5A40] transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">E-posta</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ahmet@email.com"
                    className="w-full px-5 py-3 bg-[#FBFBFA] border border-[#E5E0D8] rounded-2xl focus:border-[#5A5A40] focus:outline-none text-[#5A5A40] transition-colors placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Telefon</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+90 5XX XXX XX XX"
                    className="w-full px-5 py-3 bg-[#FBFBFA] border border-[#E5E0D8] rounded-2xl focus:border-[#5A5A40] focus:outline-none text-[#5A5A40] transition-colors placeholder:text-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="@kullaniciadi"
                  className="w-full px-5 py-3 bg-[#FBFBFA] border border-[#E5E0D8] rounded-2xl focus:border-[#5A5A40] focus:outline-none text-[#5A5A40] transition-colors placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-2 flex-1 flex flex-col min-h-[140px]">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Mesajınız</label>
                <textarea
                  required
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Projenizden veya merak ettiklerinizden bahsedin..."
                  className="w-full flex-1 px-5 py-4 bg-[#FBFBFA] border border-[#E5E0D8] rounded-2xl focus:border-[#5A5A40] focus:outline-none text-[#5A5A40] transition-colors placeholder:text-gray-300 resize-none min-h-[140px]"
                />
              </div>

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center gap-3 border border-emerald-100"
                  >
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-medium">Mesajınız başarıyla gönderildi! Teşekkür ederiz.</p>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-rose-50 text-rose-700 rounded-2xl flex items-center gap-3 border border-rose-100"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-medium">{errorMessage || "Bir hata oluştu. Tekrar deneyin."}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={status === "loading"}
                  className="w-full py-4 bg-[#5A5A40] hover:bg-[#4A4A35] text-[#F7F5F0] rounded-2xl font-bold shadow-lg shadow-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group tracking-wide"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Gönder</span>
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                Mesajınız Resend API altyapısı ile güvenle iletilecektir.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

