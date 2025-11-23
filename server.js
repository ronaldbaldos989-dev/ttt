import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import emailjs from "@emailjs/nodejs";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// ES Module fix for __dirname / __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para sa form submissions
app.use(express.static(__dirname));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Handle form submissions
app.post("/send", async (req, res) => {
  const formData = req.body;

  // 🔥 Template params (Dapat tugma sa EmailJS template mo)
  const templateParams = {
    name: formData.name,
    email: formData.email,
    message: formData.message,
    phone: formData.phone
  };

  try {
    const emailResponse = await emailjs.send(
      "service_w7q3bge",       // ✔️ EmailJS Service ID
      "template_oply56o",      // ✔️ EmailJS Template ID
      templateParams,          // ✔️ Dapat ito ang ipapasa
      {
        publicKey:  "JxfpYH0Ko8Z5E6tEz", // ✔️ EmailJS PUBLIC KEY
        privateKey: "CblrELnhPGSB5KdMO-Y3m"  // ✔️ EmailJS PRIVATE KEY
      }
    );

    console.log("📨 Email sent:", emailResponse.text);

    res.status(200).json({ success: true, message: "Form sent successfully!" });

  } catch (err) {
    console.error("❌ EmailJS error:", err);
    res.status(500).json({ success: false, message: "Failed to send form" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
