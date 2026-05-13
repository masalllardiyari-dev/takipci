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
    console.log("--- E-posta Gönderim Talebi Başladı ---");
    console.log("Talep Başlığı:", req.headers["content-type"]);
    console.log("Talep Gövdesi:", JSON.stringify(req.body));
    
    try {
      const { firstName, lastName, email, phone, instagram, message, serviceName } = req.body;

      if (!firstName || !lastName || !email || !message) {
        console.log("Hata: Gerekli alanlar eksik");
        return res.status(400).json({ error: "Lütfen tüm zorunlu alanları doldurun." });
      }

      const resend = getResend();
      const FROM_EMAIL = "Artemis Digital <info@takipcisatis.shop>";

      // 1. Yöneticiye Bildirim
      console.log("Yöneticiye mail gönderiliyor...");
      const adminResponse = await resend.emails.send({
        from: FROM_EMAIL,
        to: "masalllardiyari@gmail.com",
        subject: `🔔 Yeni Sipariş${serviceName ? `: ${serviceName}` : ""} - ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <h2 style="color: #5A5A40; border-bottom: 2px solid #5A5A40; padding-bottom: 10px;">Yeni Sipariş Talebi</h2>
            ${serviceName ? `<p><strong>Seçilen Hizmet:</strong> ${serviceName}</p>` : ""}
            <p><strong>Müşteri:</strong> ${firstName} ${lastName}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || "Belirtilmedi"}</p>
            <p><strong>Instagram:</strong> ${instagram || "Belirtilmedi"}</p>
            <div style="margin-top: 20px; padding: 15px; background: #F7F5F0; border-radius: 10px; border: 1px solid #E5E0D8;">
              <strong>Mesaj:</strong><br/>
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
        `,
      });

      if (adminResponse.error) {
        console.error("Yönetici Mail Hatası:", adminResponse.error);
        return res.status(400).json({ error: adminResponse.error.message });
      }

      console.log("Yönetici maili başarıyla gönderildi:", adminResponse.data?.id);

      // 2. Müşteriye Onay Maili
      console.log("Müşteriye onay maili gönderiliyor...");
      const customerResponse = await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Siparişiniz Alınmıştır - Artemis Digital",
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <h2 style="color: #5A5A40;">Merhaba ${firstName},</h2>
            <p>Siparişiniz/talebiniz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçeceğiz.</p>
            <div style="padding: 15px; border-left: 4px solid #5A5A40; background: #F7F5F0; margin: 20px 0;">
              <strong>Sipariş Detayları:</strong><br/>
              Ad Soyad: ${firstName} ${lastName}<br/>
              Instagram: ${instagram || "-"}
            </div>
            <p>Bizi tercih ettiğiniz için teşekkür ederiz!</p>
            <p>Saygılarımızla,<br/><strong>Artemis Digital Ekibi</strong></p>
          </div>
        `,
      });

      if (customerResponse.error) {
        console.error("Müşteri Onay Mail Hatası (Kritik değil):", customerResponse.error);
      } else {
        console.log("Müşteri maili gönderildi:", customerResponse.data?.id);
      }

      console.log("--- İşlem Başarıyla Tamamlandı ---");
      return res.status(200).json({ 
        success: true, 
        message: "Mesajınız alındı."
      });

    } catch (error: any) {
      console.error("Beklenmedik Sunucu Hatası:", error);
      return res.status(500).json({ 
        error: "Sunucu tarafında bir hata oluştu.",
        details: error.message
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
