import express, { Request, Response } from "express";
import Result from "../models/Result";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const leaderboard = await Result.find()
      .sort({ wpm: -1 })
      .limit(10)
      .populate("user", "username")
      .populate("snippet", "language difficulty");

    res.json(leaderboard);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
