const express = require("express");
const cors = require("cors");
const session = require("express-session");

const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 550, // Limit each IP to 50 requests per windowMs
  message: {
    success: false,
    msg: "Too many requests from this IP, please try again after 10 minutes",
  },
  statusCode: 400,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    return req.ip;
  },
  validate: {
    xForwardedForHeader: false, // Disable xForwardedForHeader validation
  },
});

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://tripunite.vercel.app"
].concat(
  (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.set("trust proxy", 1);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//rate limiter
app.use(limiter);

//testing routes
app.get("/", (req, res) => {
  console.dev({ route: "home sweet home" }, "home");
  return res.status(200).send({
    msg: `home route ${
      process.env.production == "true" ? "production" : "dev"
    }!`,
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// production routes
const chatBotRoute = require("./routes/chatBot.route.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/api/v1", chatBotRoute);
app.use("/api/auth", require("./routes/auth.js"));

module.exports = { app };
