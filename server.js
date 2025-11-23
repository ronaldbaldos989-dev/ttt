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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔹 Handle Card Payment + Billing form submissions
app.post("/send", async (req, res) => {
  const formData = req.body;

  // Template params for EmailJS
  const templateParams = {
    name: formData.name || "",
    email: formData.email || "",
    phone: formData.phone || "",
    address: formData.address || "",
    plan: formData.plan || "",
    message: formData.message || ""
  };

  try {
    const emailResponse = await emailjs.send(
      "service_w7q3bge",       // ✔️ EmailJS Service ID
      "template_oply56o",      // ✔️ EmailJS Template ID
      templateParams,          // ✔️ Params na ipapasa
      {
        publicKey:  "JxfpYH0Ko8Z5E6tEz",   // ✔️ EmailJS Public Key
        privateKey: "CblrELnhPGSB5KdMO-Y3m" // ✔️ EmailJS Private Key
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
