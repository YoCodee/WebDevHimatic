import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes.js";
import barangRoutes from "./routes/BarangRoutes.js";
import barangMasukRoutes from "./routes/BarangMasukRoutes.js";
import barangKeluarRoutes from "./routes/BarangKeluarRoutes.js";

dotenv.config();

const allowedOrigins = ["http://localhost:5173"];

const app = express();

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/barang", barangRoutes);
app.use("/api/barangMasuk", barangMasukRoutes);
app.use("/api/barangkeluar", barangKeluarRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
