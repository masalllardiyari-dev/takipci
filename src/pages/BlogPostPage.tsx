import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  ArrowRight, Heart, Send, Loader2 
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { BlogPost } from "../lib/utils";

const BlogPostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const postRef = doc(db, "posts", id);
    getDoc(postRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPost({ 
          id: snapshot.id, 
          ...data,
          createdAt: (data.createdAt as any)?.toDate?.() || data.createdAt
        } as BlogPost);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center pt-20">
      <Loader2 className="animate-spin text-red-500 w-8 h-8" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center pt-20">
      <h2 className="text-2xl font-black text-gray-800 mb-4">Yazı bulunamadı.</h2>
      <Link to="/blog" className="text-red-500 font-bold hover:underline">Blog'a Dön</Link>
    </div>
  );

  return (
    <div className="pt-32 pb-32 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors mb-12">
          <ArrowRight className="w-4 h-4 rotate-180" /> Blog'a Dön
        </Link>
        
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            {post.createdAt ? new Date(post.createdAt).toLocaleDateString("tr-TR") : "Yazı"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-800 leading-tight mb-8">
            {post.title}
          </h1>
          {post.image && (
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-red-100/50 mb-12 aspect-[21/9]">
              <img src={post.image} className="w-full h-full object-cover" alt={post.title} />
            </div>
          )}
        </div>

        <div className="prose prose-lg prose-red max-w-none">
          <div className="text-gray-600 leading-relaxed space-y-6 text-lg whitespace-pre-wrap">
            {post.content || post.excerpt}
          </div>
        </div>
        
        <div className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 font-black">
                A
              </div>
              <div>
                <p className="text-sm font-black text-gray-800">Artemis Digital</p>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Editör</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                <Send className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
