import React from "react";
import { ShieldCheck } from "lucide-react";

const KVKKPage = () => (
  <div className="pt-32 pb-32 px-6 max-w-4xl mx-auto bg-white min-h-screen">
    <div className="flex items-center gap-3 mb-10">
      <ShieldCheck className="w-8 h-8 text-red-500" />
      <h1 className="text-3xl md:text-4xl font-black text-gray-800">KVKK ve Gizlilik Politikası</h1>
    </div>
    <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
      <p>Artemis Digital olarak kişisel verilerinizin güvenliğine azami önem veriyoruz. 6698 sayılı KVKK kapsamında verileriniz korunmaktadır.</p>
      <h3 className="text-xl font-bold text-gray-800">1. Veri Sorumlusu</h3>
      <p>Veri sorumlusu Artemis Digital'dir.</p>
      <h3 className="text-xl font-bold text-gray-800">2. İşlenen Veriler</h3>
      <p>Ad-Soyad, E-posta, Telefon ve Sosyal Medya kullanıcı adı. Şifreniz kesinlikle talep edilmez.</p>
    </div>
  </div>
);

export default KVKKPage;
