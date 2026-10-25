
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Parse incoming form and JSON data
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// Serve the website's static files locally.
// Vercel can serve files from the root-level public/ folder.
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname, "public")));
}

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

  // Validate required fields and input types
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

  // Limit input lengths
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

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address."
    });
  }

  // Temporary handling: log the enquiry on the server
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

// Basic health-check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Viaom Group API is running."
  });
});

// Export Express app for Vercel
module.exports = app;

// Run a local server when developing on your computer
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Viaom Group website running at http://localhost:${PORT}`);
  });
}
