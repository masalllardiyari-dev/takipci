import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { auth, db } from "./lib/firebase";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import UserLogin from "./pages/UserLogin";
import UserDashboard from "./pages/UserDashboard";
import KVKKPage from "./pages/KVKKPage";
import AdminPanel from "./pages/AdminPanel";
import AdminLogin from "./pages/AdminLogin";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const adminEnv = import.meta.env.VITE_ADMIN_EMAILS || "";
        const adminList = adminEnv.split(",").map((e: string) => e.trim()).filter(Boolean);
        
        if (adminList.includes(u.email || '')) {
          setIsAdmin(true);
        } else {
          try {
            const adminRef = doc(db, "admins", u.uid);
            const snapshot = await getDoc(adminRef);
            setIsAdmin(snapshot.exists());
          } catch { setIsAdmin(false); }
        }
      } else { setIsAdmin(false); }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-red-500 w-10 h-10" /></div>;

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <ScrollToTop />
        <Navbar user={user} isAdmin={isAdmin} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/track" element={<OrderTrackingPage />} />
            <Route path="/login" element={user ? <UserDashboard user={user} /> : <UserLogin />} />
            <Route path="/dashboard" element={<UserDashboard user={user} />} />
            <Route path="/legal/kvkk" element={<KVKKPage />} />
            <Route path="/admin" element={user ? (isAdmin ? <AdminPanel user={user} isAdmin={isAdmin} /> : <UserDashboard user={user} />) : <AdminLogin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}