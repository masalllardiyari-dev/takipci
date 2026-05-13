import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingCart, Briefcase, FileText, LogOut, Plus, 
  Trash2, Loader2, Heart, ShieldCheck, Tag, Users,
  ChevronRight, Edit3, X, Eye, Calendar, Mail, Phone, Instagram as InstaIcon
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { 
  collection, query, orderBy, onSnapshot, doc, 
  setDoc, addDoc, updateDoc, deleteDoc, serverTimestamp 
} from "firebase/firestore";
import { cn, Category } from "../lib/utils";

const AdminPanel = ({ user, isAdmin }: { user: any, isAdmin: boolean }) => {
  const [activeTab, setActiveTab] = useState<'services' | 'posts' | 'orders' | 'categories' | 'users'>('orders');
  const [list, setList] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newItem, setNewItem] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !isAdmin) { navigate(user ? "/dashboard" : "/admin"); return; }
    
    setLoading(true);

    // Fetch categories for the selector (Firestore)
    const qCats = query(collection(db, "categories"), orderBy("order"));
    const unsubCats = onSnapshot(qCats, (snapshot) => {
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
    });

    // Fetch active tab data (Firestore)
    let q = query(collection(db, activeTab), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setList(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
      })));
      setLoading(false);
    }, (error) => {
      console.error(`Firestore ${activeTab} Error:`, error);
      setLoading(false);
    });

    return () => {
      unsubCats();
      unsubscribe();
    };
  }, [activeTab, user, isAdmin, navigate]);

  const handleSave = async () => {
    if (activeTab === 'orders') return;

    const data = { 
      ...newItem, 
      updatedAt: serverTimestamp() 
    };
    
    if (!editingItem) {
      data.createdAt = serverTimestamp();
    }

    if (activeTab === 'services' && !data.category) {
       alert("Lütfen bir kategori seçin.");
       return;
    }

    try {
      if (editingItem) {
        await updateDoc(doc(db, activeTab, editingItem.id), data);
      } else {
        await addDoc(collection(db, activeTab), data);
      }
      closeModal();
    } catch (error) {
      console.error("Save Error:", error);
      alert("Hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kaydı silmek istediğinize emin misiniz?")) return;
    try {
      await deleteDoc(doc(db, activeTab, id));
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "orders", id), { status });
    } catch (error) {
      console.error("Status Update Error:", error);
    }
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setNewItem(item);
    setShowAdd(true);
  };

  const closeModal = () => {
    setShowAdd(false);
    setEditingItem(null);
    setNewItem({});
    setSelectedOrder(null);
  };

  if (!user) return null;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="w-full lg:w-72 bg-white border-r border-gray-100 p-8 flex flex-col justify-between sticky top-20 h-[calc(100vh-80px)]">
        <div>
          <div className="mb-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Yönetim Paneli</p>
              <p className="font-bold text-gray-800">{user.displayName?.split(' ')[0] || 'Admin'}</p>
            </div>
          </div>
          <div className="space-y-1">
            {[
              { id: 'orders', name: 'Siparişler', icon: ShoppingCart }, 
              { id: 'users', name: 'Müşteriler', icon: Users },
              { id: 'categories', name: 'Kategoriler', icon: Tag },
              { id: 'services', name: 'Ürünler', icon: Briefcase }, 
              { id: 'posts', name: 'Blog Yazıları', icon: FileText }
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn(
                "w-full px-4 py-3 rounded-xl flex items-center gap-3 font-semibold text-sm transition-all",
                activeTab === tab.id ? "bg-red-50 text-red-500" : "text-gray-500 hover:bg-gray-50"
              )}><tab.icon className="w-4 h-4" /> {tab.name}</button>
            ))}
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="w-full px-4 py-3 text-red-500 font-semibold text-sm flex items-center gap-3 hover:bg-red-50 rounded-xl transition-all">
          <LogOut className="w-4 h-4" /> Çıkış Yap
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
               {activeTab === 'orders' ? 'Sipariş Yönetimi' : 
                activeTab === 'users' ? 'Müşteri Listesi' :
                activeTab === 'services' ? 'Ürün Yönetimi' : 
                activeTab === 'categories' ? 'Kategori Yönetimi' : 'Blog Yönetimi'}
            </h1>
            <p className="text-gray-400 text-sm font-medium mt-1">{list.length} toplam kayıt bulundu.</p>
          </div>
          {activeTab !== 'orders' && activeTab !== 'users' && (
            <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-red-500 text-white rounded-2xl font-bold text-sm hover:bg-red-600 transition-all flex items-center gap-2 shadow-lg shadow-red-200">
              <Plus className="w-4 h-4" /> Yeni Ekle
            </button>
          )}
        </div>

        {/* List Table/Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-red-500 w-10 h-10" /></div>
          ) : list.length === 0 ? (
            <div className="text-center p-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <p className="text-gray-400 font-bold">Henüz herhangi bir kayıt bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {list.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group p-6 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-red-500 group-hover:bg-red-50 transition-colors">
                      {activeTab === 'orders' ? <ShoppingCart className="w-6 h-6" /> : 
                       activeTab === 'users' ? <Users className="w-6 h-6" /> :
                       activeTab === 'services' ? <Briefcase className="w-6 h-6" /> : 
                       activeTab === 'categories' ? <Tag className="w-6 h-6" /> :
                       <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-800 text-lg leading-tight">
                        {activeTab === 'orders' ? `${item.firstName} ${item.lastName}` : 
                         activeTab === 'users' ? (item.email) :
                         (item.name || item.title)}
                      </h4>
                      <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                        {activeTab === 'orders' ? (item.serviceName || 'Hizmet Bilgisi Yok') : 
                         activeTab === 'users' ? `Son Giriş: ${item.lastLogin ? new Date(item.lastLogin).toLocaleDateString('tr-TR') : 'Bilinmiyor'}` :
                         (item.category || item.slug || 'Detay Yok')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {activeTab === 'orders' && (
                      <>
                        <select value={item.status} onChange={(e) => handleStatusUpdate(item.id, e.target.value)} className={cn(
                          "px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-wider outline-none transition-all",
                          item.status === 'completed' ? "bg-green-50 text-green-600 border-green-100" :
                          item.status === 'processing' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          item.status === 'unpaid' ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-yellow-50 text-yellow-600 border-yellow-100"
                        )}>
                          <option value="pending">Beklemede</option>
                          <option value="unpaid">Ödeme Alınmadı</option>
                          <option value="processing">İşleniyor</option>
                          <option value="completed">Tamamlandı</option>
                        </select>
                        <button onClick={() => setSelectedOrder(item)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                          <Eye className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {activeTab !== 'users' && activeTab !== 'orders' && (
                      <button onClick={() => openEdit(item)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                        <Edit3 className="w-5 h-5" />
                      </button>
                    )}

                    <button onClick={() => handleDelete(item.id)} className="p-3 bg-gray-50 text-red-300 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail/Edit Modal */}
      <AnimatePresence>
        {(showAdd || selectedOrder) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-800">
                    {selectedOrder ? 'Sipariş Detayları' : (editingItem ? 'Kaydı Düzenle' : 'Yeni Kayıt Ekle')}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">{activeTab.toUpperCase()}</p>
                </div>
                <button onClick={closeModal} className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-8 overflow-y-auto">
                {selectedOrder ? (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Müşteri Bilgileri</p>
                        <h4 className="text-lg font-black text-gray-800 mb-4">{selectedOrder.firstName} {selectedOrder.lastName}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-gray-500"><Mail className="w-4 h-4 text-red-500" /> {selectedOrder.email}</div>
                          <div className="flex items-center gap-3 text-sm text-gray-500"><Phone className="w-4 h-4 text-red-500" /> {selectedOrder.phone}</div>
                          {selectedOrder.instagram && <div className="flex items-center gap-3 text-sm text-gray-500"><InstaIcon className="w-4 h-4 text-red-500" /> @{selectedOrder.instagram}</div>}
                        </div>
                      </div>
                      <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Sipariş Bilgileri</p>
                        <h4 className="text-lg font-black text-red-600 mb-4">{selectedOrder.serviceName}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-red-500"><Calendar className="w-4 h-4" /> {new Date(selectedOrder.createdAt).toLocaleString('tr-TR')}</div>
                          <div className="flex items-center gap-3 text-sm text-red-500 font-black"><ShieldCheck className="w-4 h-4" /> ID: {selectedOrder.id.slice(-8)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-white border-2 border-dashed border-gray-100 rounded-3xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Müşteri Notu</p>
                      <p className="text-gray-600 italic">"{selectedOrder.message || 'Not bırakılmamış.'}"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {activeTab === 'categories' ? (
                         <>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Kategori Adı</label><input placeholder="Örn: Instagram" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.name || ""} onChange={e => setNewItem({ ...newItem, name: e.target.value })} /></div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Slug (URL)</label><input placeholder="Örn: instagram" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.slug || ""} onChange={e => setNewItem({ ...newItem, slug: e.target.value })} /></div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">İkon</label>
                             <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.icon || ""} onChange={e => setNewItem({ ...newItem, icon: e.target.value })}>
                                <option value="">Seçiniz</option>
                                <option value="Instagram">Instagram</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Youtube">Youtube</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Google">Google</option>
                                <option value="Default">Global</option>
                             </select>
                           </div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Renk Sınıfı</label><input placeholder="from-pink-500 to-red-500" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium text-xs" value={newItem.color || ""} onChange={e => setNewItem({ ...newItem, color: e.target.value })} /></div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Yazı Rengi Sınıfı</label><input placeholder="text-pink-600" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium text-xs" value={newItem.textColor || ""} onChange={e => setNewItem({ ...newItem, textColor: e.target.value })} /></div>
                           <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Sıralama</label><input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.order || ""} onChange={e => setNewItem({ ...newItem, order: Number(e.target.value) })} /></div>
                           <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-gray-400 ml-1">Açıklama</label><textarea rows={2} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.description || ""} onChange={e => setNewItem({ ...newItem, description: e.target.value })} /></div>
                         </>
                      ) : activeTab === 'services' ? (
                        <>
                          <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Ürün Adı</label><input placeholder="Örn: 1000 Takipçi" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.name || ""} onChange={e => setNewItem({ ...newItem, name: e.target.value })} /></div>
                          <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Kategori</label>
                            <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.category || ""} onChange={e => setNewItem({ ...newItem, category: e.target.value })}>
                              <option value="">Seçiniz</option>
                              {categories.map(cat => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Fiyat (TL)</label><input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.price || ""} onChange={e => setNewItem({ ...newItem, price: Number(e.target.value) })} /></div>
                          <div className="space-y-1.5"><label className="text-xs font-bold text-gray-400 ml-1">Özellikler (Virgülle ayırın)</label><input placeholder="Hızlı Gönderim, Şifresiz" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.features?.join(', ') || ""} onChange={e => setNewItem({ ...newItem, features: e.target.value.split(',').map(s => s.trim()) })} /></div>
                          <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-gray-400 ml-1">Açıklama</label><textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.description || ""} onChange={e => setNewItem({ ...newItem, description: e.target.value })} /></div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-gray-400 ml-1">Başlık</label><input placeholder="Blog Başlığı" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.title || ""} onChange={e => setNewItem({ ...newItem, title: e.target.value })} /></div>
                          <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-gray-400 ml-1">Resim URL</label><input placeholder="https://..." className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium text-xs" value={newItem.image || ""} onChange={e => setNewItem({ ...newItem, image: e.target.value })} /></div>
                          <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-gray-400 ml-1">Kısa Özet</label><textarea rows={3} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium" value={newItem.excerpt || ""} onChange={e => setNewItem({ ...newItem, excerpt: e.target.value })} /></div>
                          <div className="space-y-1.5 md:col-span-2"><label className="text-xs font-bold text-gray-400 ml-1">Tam İçerik</label><textarea rows={10} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-red-400 font-medium text-sm" value={newItem.content || ""} onChange={e => setNewItem({ ...newItem, content: e.target.value })} /></div>
                        </>
                      )}
                    </div>
                    <button onClick={handleSave} className="w-full py-4 bg-red-500 text-white rounded-[1.5rem] font-black text-lg hover:bg-red-600 transition-all shadow-xl shadow-red-100">
                      {editingItem ? 'Değişiklikleri Kaydet' : 'Kaydı Oluştur'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
