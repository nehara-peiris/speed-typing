import express, { Response } from "express";
import User from "../models/User";
import Result from "../models/Result";
import { verifyToken, AuthRequest } from "../middleware/verifyToken";

const router = express.Router();

router.get("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    // Get user stats
    const user = await User.findById(userId).select("stats");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get recent results
    const recentResults = await Result.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("snippet", "language difficulty");

    res.json({
      stats: user.stats,
      history: recentResults,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
