import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  FileText, ArrowRight, Loader2 
} from "lucide-react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { BlogPost } from "../lib/utils";

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: (doc.data().createdAt as any)?.toDate?.() || doc.data().createdAt
      }) as BlogPost));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-red-500 w-8 h-8" />
    </div>
  );

  return (
    <div className="pt-32 pb-32 px-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4">Blog</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">Dijital Büyüme <span className="text-red-500">Rehberi</span></h1>
        <p className="text-gray-500">Sosyal medya stratejileri ve güncel ipuçları.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.id}`}>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-red-200 hover:shadow-2xl transition-all h-full flex flex-col"
            >
              <div className="aspect-[16/10] bg-gray-100 overflow-hidden relative">
                {post.image ? (
                  <img src={post.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={post.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-red-50">
                    <FileText className="w-12 h-12 text-red-300" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                   <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString("tr-TR") : "Yeni"}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-xl font-black text-gray-800 mb-3 group-hover:text-red-500 transition-colors line-clamp-2 leading-tight">{post.title}</h2>
                <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                   <span className="text-xs font-black text-red-500 flex items-center gap-2 group-hover:gap-3 transition-all uppercase tracking-widest">
                    Yazıyı Oku <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
