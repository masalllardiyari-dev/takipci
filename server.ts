import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY environment variable is required");
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for sending emails
  app.post("/api/send-email", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, instagram, message } = req.body;

      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: "Lütfen gerekli tüm alanları (İsim, Soyisim, E-posta, Mesaj) doldurun." });
      }

      const resend = getResend();

      // KRİTİK: Alan adınızı doğruladığınız için artık 'onboarding@resend.dev' yerine 
      // kendi doğrulanmış adresinizi kullanmalısınız. 
      // Örn: "Artemis Digital <info@alanadiniz.com>"
      const FROM_EMAIL = "Artemis Digital <info@takipcisatis.shop>"; 

      // 1. Yöneticiye Bildirim (Size)
      const adminEmail = await resend.emails.send({
        from: FROM_EMAIL,
        to: "masalllardiyari@gmail.com",
        subject: `🔔 Yeni Sipariş: ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #5A5A40;">Yeni Bir Sipariş Talebi Geldi</h2>
            <p><strong>Müşteri:</strong> ${firstName} ${lastName}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || "Belirtilmedi"}</p>
            <p><strong>Instagram:</strong> ${instagram || "Belirtilmedi"}</p>
            <div style="margin-top: 20px; padding: 15px; background: #F7F5F0; border-radius: 10px;">
              <strong>Sipariş Notu:</strong><br/>
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
        `,
      });

      if (adminEmail.error) {
        console.error("Yönetici Mail Hatası (Resend):", adminEmail.error);
        throw new Error(adminEmail.error.message || "Bildirim gönderilemedi.");
      }

      // 2. Müşteriye Onay Maili (Karşı tarafa)
      // NOT: Domain doğrulaması yapıldığı için artık dışarıya mail gönderebilirsiniz.
      const customerEmail = await resend.emails.send({
        from: FROM_EMAIL,
        to: email, // Formu dolduran kişinin maili
        subject: "Siparişiniz Alınmıştır - Artemis Digital",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #5A5A40;">Merhaba ${firstName},</h2>
            <p>Siparişiniz/talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
            <div style="padding: 15px; border-left: 4px solid #5A5A40; background: #F7F5F0; margin: 20px 0;">
              <p><strong>Sipariş Özetiniz:</strong></p>
              <ul>
                <li><strong>Ad Soyad:</strong> ${firstName} ${lastName}</li>
                <li><strong>Instagram:</strong> ${instagram || "-"}</li>
              </ul>
            </div>
            <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
            <br/>
            <p>Saygılarımızla,<br/><strong>Artemis Digital Ekibi</strong></p>
          </div>
        `,
      });

      if (customerEmail.error) {
        console.error("Müşteri Onay Mail Hatası (Resend):", customerEmail.error);
      }

      res.status(200).json({ 
        success: true, 
        adminEmailId: adminEmail.data?.id,
        customerEmailId: customerEmail.data?.id 
      });
    } catch (error: any) {
      console.error("Genel Sunucu Hatası:", error);
      res.status(500).json({ 
        error: error.message || "Sunucu tarafında bir hata oluştu.",
        details: process.env.NODE_ENV !== "production" ? error.stack : undefined
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
