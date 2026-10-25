const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Parse JSON and form data
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Serve website files
app.use(express.static(path.join(__dirname, "public")));

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Rate limit enquiry submissions
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many enquiries. Please try again later."
  }
});

// Enquiry endpoint
app.post("/api/enquiries", enquiryLimiter, (req, res) => {
  const {
    name,
    email,
    phone = "",
    service = "",
    message
  } = req.body || {};

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    typeof phone !== "string" ||
    typeof service !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "Please fill in your name, email and message."
    });
  }

  if (
    name.length > 100 ||
    email.length > 254 ||
    phone.length > 30 ||
    service.length > 100 ||
    message.length > 5000
  ) {
    return res.status(400).json({
      success: false,
      message: "One or more fields are too long."
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address."
    });
  }

  // Temporary enquiry handling: server logs only
  console.log("New Viaom Group enquiry:", {
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    service: service.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString()
  });

  return res.status(200).json({
    success: true,
    message: "Thank you! Your enquiry has been received."
  });
});

// Health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Viaom Group API is running."
  });
});

// Start local server only on your computer
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Viaom Group website running at http://localhost:${PORT}`);
  });
}

const fs = require("fs");

app.get("/api/debug", (req, res) => {
  const pub = path.join(__dirname, "public");
  res.json({
    dirname: __dirname,
    rootFiles: fs.readdirSync(__dirname),
    publicExists: fs.existsSync(pub),
    publicFiles: fs.existsSync(pub) ? fs.readdirSync(pub) : []
  });
});
module.exports = app;