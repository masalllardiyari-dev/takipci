import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ShieldCheck, Loader2 
} from "lucide-react";
import { auth } from "../lib/firebase";
import { 
  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword 
} from "firebase/auth";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (err: any) { setError("Domain hatası."); }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("");
    try { await signInWithEmailAndPassword(auth, email, password); } catch { setError("Hatalı giriş."); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="flex items-center justify-center p-8 md:p-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md text-center">
          <Link to="/" className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-red-200">
            <ShieldCheck className="w-7 h-7" />
          </Link>
          <h2 className="text-3xl font-black text-gray-800 mb-1">Admin Paneli</h2>
          <p className="text-gray-500 text-sm mb-8">Yönetici girişi</p>
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-semibold mb-4">{error}</div>}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input type="email" required placeholder="E-Posta" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-400 text-center" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" required placeholder="Şifre" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-400 text-center" value={password} onChange={e => setPassword(e.target.value)} />
            <button disabled={loading} className="w-full py-3.5 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-md shadow-red-200 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Giriş Yap"}
            </button>
          </form>
          <div className="flex items-center gap-3 my-6"><div className="flex-1 h-px bg-gray-200" /><span className="text-xs text-gray-400 font-bold">veya</span><div className="flex-1 h-px bg-gray-200" /></div>
          <button onClick={handleGoogleLogin} className="w-full py-3.5 bg-white border border-gray-200 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" /> Google ile Giriş
          </button>
        </motion.div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-20">
        <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} src="/ChatGPT Image 13 May 2026 18_10_46.png" alt="Mascot" className="w-full max-w-md drop-shadow-2xl" />
      </div>
    </div>
  );
};

export default AdminLogin;
