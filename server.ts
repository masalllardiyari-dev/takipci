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
  // API endpoint for fetching Instagram Profile Info
  app.get("/api/ig-info/:username", async (req, res) => {
    const { username } = req.params;
    console.log(`--- IG Profil Sorgulama: ${username} ---`);
    
    try {
      const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
        headers: {
          "x-ig-app-id": "936619743392459",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "referer": `https://www.instagram.com/${username}/`,
        }
      });

      if (!response.ok) {
        throw new Error(`Instagram Hatası: ${response.status}`);
      }

      const data: any = await response.json();
      const user = data.data.user;

      if (!user) {
        return res.status(404).json({ error: "Kullanıcı bulunamadı." });
      }

      return res.status(200).json({
        username: user.username,
        fullName: user.full_name,
        biography: user.biography,
        profilePicUrl: user.profile_pic_url_hd || user.profile_pic_url,
        followers: user.edge_followed_by?.count || 0,
        following: user.edge_follow?.count || 0,
        posts: user.edge_owner_to_timeline_media?.count || 0,
        isPrivate: user.is_private,
        isVerified: user.is_verified
      });

    } catch (error: any) {
      console.error("IG Proxy Hatası:", error.message);
      // If Instagram blocks us, we return a 429 or 500
      return res.status(error.message.includes("404") ? 404 : 500).json({ 
        error: "Veri çekilemedi. Instagram sunucusu şu an talebi reddediyor olabilir.",
        details: error.message
      });
    }
  });

  app.post("/api/send-email", async (req, res) => {
    console.log("--- E-posta Gönderim Talebi Başladı ---");
    console.log("Gelen Veri:", JSON.stringify(req.body, null, 2));
    
    try {
      const { firstName, lastName, email, phone, instagram, message, serviceName, orderId } = req.body;

      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: "Lütfen tüm zorunlu alanları doldurun." });
      }

      const resend = getResend();
      
      // Sanitizing environment variables to remove any unintended quotes
      const sanitize = (val: string | undefined) => (val || "").replace(/"/g, "").trim();

      const fromEmailValue = sanitize(process.env.RESEND_FROM_EMAIL) || "info@takipcisatis.shop";
      const adminEmailValue = sanitize(process.env.ADMIN_EMAIL) || "masalllardiyari@gmail.com";
      
      // Resend specifically requires the format "Name <email@domain.com>" or just "email@domain.com"
      // The from address MUST be from a verified domain in Resend.
      const fromEmail = `Artemis Digital <${fromEmailValue}>`;
      const toAdmin = [adminEmailValue];
      const toCustomer = [email];

      console.log(`Attempting to send email. From: ${fromEmail}, To: ${adminEmailValue}`);

      // 1. Yöneticiye Bildirim
      const { data: adminData, error: adminError } = await resend.emails.send({
        from: fromEmail,
        to: toAdmin,
        subject: `🔔 [Sipariş: ${orderId || 'Yeni'}] ${serviceName ? `: ${serviceName}` : ""} - ${firstName} ${lastName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">Yeni Sipariş Talebi</h2>
            <p><strong>Sipariş Kodu:</strong> <span style="font-size: 1.2em; font-weight: bold; color: #ef4444;">${orderId || "Bilinmiyor"}</span></p>
            ${serviceName ? `<p><strong>Seçilen Hizmet:</strong> ${serviceName}</p>` : ""}
            <p><strong>Müşteri:</strong> ${firstName} ${lastName}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <p><strong>Telefon:</strong> ${phone || "Belirtilmedi"}</p>
            <p><strong>Instagram:</strong> ${instagram || "Belirtilmedi"}</p>
            <div style="margin-top: 20px; padding: 15px; background: #fef2f2; border-radius: 10px; border: 1px solid #fee2e2;">
              <strong>Mesaj:</strong><br/>
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
        `,
      });

      if (adminError) {
        console.error("Resend Admin Error:", adminError);
        throw new Error(`Yönetici maili gönderilemedi: ${adminError.message}`);
      }

      // 2. Müşteriye Onay Maili
      const { data: customerData, error: customerError } = await resend.emails.send({
        from: fromEmail,
        to: toCustomer,
        subject: `Siparişiniz Alınmıştır (Takip Kodu: ${orderId || ''}) - Artemis Digital`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.6;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ef4444; margin-bottom: 5px;">Artemis Digital</h1>
              <p style="color: #666; font-size: 0.9em; margin-top: 0;">Sosyal Medyanın Güvenilir Adresi</p>
            </div>
            
            <h2 style="color: #333;">Merhaba ${firstName},</h2>
            <p>Siparişiniz başarıyla alınmıştır. Aşağıdaki takip kodu ile anasayfamızdan sipariş durumunuzu her an kontrol edebilirsiniz.</p>
            
            <div style="padding: 20px; background: #fef2f2; border-radius: 15px; text-align: center; margin: 30px 0; border: 2px dashed #ef4444;">
              <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; color: #999; margin-bottom: 5px; letter-spacing: 2px;">Sipariş Takip Kodunuz</p>
              <p style="font-size: 28px; font-weight: 900; color: #ef4444; margin: 0; letter-spacing: 1px;">${orderId || "Hata"}</p>
            </div>

            <div style="padding: 15px; border: 1px solid #eee; background: #fafafa; border-radius: 10px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Hizmet:</strong> ${serviceName || "-"}</p>
              <p style="margin: 5px 0 0 0;"><strong>Instagram:</strong> ${instagram || "-"}</p>
            </div>
            
            <p>En kısa sürede işleminiz tamamlanacaktır.</p>
            <p style="font-size: 0.9em; color: #666;">Bizi tercih ettiğiniz için teşekkür ederiz!</p>
            <p>Saygılarımızla,<br/><strong>Artemis Digital Ekibi</strong></p>
          </div>
        `,
      });

      if (customerError) {
        console.warn("Müşteri onay maili gönderilemedi:", customerError.message);
      }

      return res.status(200).json({ 
        success: true, 
        message: "Siparişiniz alındı."
      });

    } catch (error: any) {
      console.error("CRITICAL: Mail Gönderim Hatası!");
      console.error("Hata Detayı:", error);
      
      // Specialize the error message for Resend
      let errorMsg = error.message;
      if (error.name === "ResendError") {
        errorMsg = `Resend Hatası: ${error.message}`;
      }

      return res.status(500).json({ 
        error: "E-posta servisinde bir sorun oluştu.",
        details: errorMsg,
        suggestion: "Lütfen RESEND_API_KEY'in doğruluğunu ve 'info@takipcisatis.shop' alan adının Resend üzerinde doğrulanmış olduğunu kontrol edin."
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
