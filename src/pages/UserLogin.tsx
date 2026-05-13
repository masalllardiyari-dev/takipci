import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Heart, Loader2 
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { 
  signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      // Save user to Firestore
      await setDoc(doc(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        lastLogin: serverTimestamp()
      }, { merge: true });
      navigate("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Giriş yapılamadı.");
    }
  };

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      const user = userCredential.user;
      // Save/Update user in Firestore
      await setDoc(doc(db, `users/${user.uid}`), {
        uid: user.uid,
        email: user.email,
        lastLogin: serverTimestamp()
      }, { merge: true });
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? "E-posta kullanımda." : "Hatalı giriş bilgileri.");
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      <div className="flex items-center justify-center p-8 md:p-16">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm mb-10 hover:text-red-600">
            ← Ana Sayfa
          </Link>
          <div className="mb-8">
            <Heart className="w-10 h-10 text-red-500 fill-current mb-4" />
            <h2 className="text-3xl font-black text-gray-800 mb-1">{isSignUp ? "Kayıt Ol" : "Hoş Geldin"}</h2>
            <p className="text-gray-500 text-sm">
              {isSignUp ? "Hesabın var mı?" : "Yeni misin?"}{" "}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-red-500 font-bold hover:underline">{isSignUp ? "Giriş Yap" : "Kayıt Ol"}</button>
            </p>
          </div>
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-xl text-sm font-semibold mb-4">{error}</div>}
          <button onClick={handleGoogleLogin} className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all mb-4 shadow-sm">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" /> Google ile Giriş
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-bold">veya</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <form onSubmit={handleEmailAction} className="space-y-3">
            <input type="email" required placeholder="E-Posta" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-400 text-gray-700 font-medium" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" required placeholder="Şifre" className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-400 text-gray-700 font-medium" value={password} onChange={e => setPassword(e.target.value)} />
            <button disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-200 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : (isSignUp ? "Kayıt Ol" : "Giriş Yap")}
            </button>
          </form>
        </motion.div>
      </div>
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-20">
        <motion.img initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }} src="/ChatGPT Image 13 May 2026 18_10_46.png" alt="Mascot" className="w-full max-w-md drop-shadow-2xl" />
      </div>
    </div>
  );
};

export default UserLogin;
