
// const express = require("express");
// const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
// const path = require("path");

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(helmet());
// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: false }));

// app.use(express.static(path.join(__dirname, "Public")));

// app.post(
//   "/api/enquiries",
//   rateLimit({
//     windowMs: 15 * 60 * 1000,
//     limit: 5
//   }),
//   (req, res) => {
//     const { name, email, phone = "", service = "", message } = req.body;

//     if (
//       typeof name !== "string" ||
//       typeof email !== "string" ||
//       typeof message !== "string" ||
//       !name.trim() ||
//       !email.trim() ||
//       !message.trim()
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill in all required fields."
//       });
//     }

//     console.log("New enquiry received:", {
//       name: name.trim(),
//       email: email.trim(),
//       phone: String(phone).slice(0, 30),
//       service: String(service).slice(0, 100),
//       message: message.trim()
//     });

//     res.json({
//       success: true,
//       message: "Thank you! Your enquiry has been received."
//     });
//   }
// );

// app.listen(PORT, () => {
//   console.log(`Viaom Group website running at http://localhost:${PORT}`);
// });
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false }));

// Explicitly serve the root-level images folder
app.use("/images", express.static(path.join(__dirname, "images")));

// Serve public files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

app.post(
  "/api/enquiries",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5
  }),
  (req, res) => {
    const { name, email, phone = "", service = "", message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields."
      });
    }

    console.log("New enquiry received:", {
      name: name.trim(),
      email: email.trim(),
      phone: String(phone).slice(0, 30),
      service: String(service).slice(0, 100),
      message: message.trim()
    });

    res.json({
      success: true,
      message: "Thank you! Your enquiry has been received."
    });
  }
);

app.listen(PORT, () => {
  console.log(`Viaom Group website running at http://localhost:${PORT}`);
});