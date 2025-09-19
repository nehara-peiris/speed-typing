import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import snippetRoutes from "./routes/snippetRoutes";
import resultRoutes from "./routes/resultRoutes";
import leaderboardRoutes from "./routes/leaderboardRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/dashboard", dashboardRoutes);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(8080, () => console.log("🚀 Server running on port 8080"));
  })
  .catch(err => console.error(err));
