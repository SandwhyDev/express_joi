import express from "express";
import cors from "cors";
import env from "dotenv";
env.config();
import path from "path";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import userController from "./controller/userController";

const app = express();
const { PORT } = process.env;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// middleware
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
// app.use(limiter);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../public")));

// ROUTES
app.use("/api", userController);

// listener
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
    LISTENED TO PORT ${PORT}
    `);
});
