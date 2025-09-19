import express, { Response } from "express";
import Result from "../models/Result";
import User from "../models/User";
import { verifyToken, AuthRequest } from "../middleware/verifyToken";

const router = express.Router();

router.post("/", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { snippet, time, wpm, accuracy } = req.body;
    const userId = req.userId;

    // Save the result
    const result = new Result({ user: userId, snippet, time, wpm, accuracy });
    await result.save();

    // Update user stats
    const user = await User.findById(userId);
    if (user) {
      const { stats } = user;
      const totalSnippets = stats.snippetsCompleted + 1;
      const newAvgSpeed = ((stats.avgSpeed * stats.snippetsCompleted) + wpm) / totalSnippets;
      const newAccuracy = ((stats.accuracy * stats.snippetsCompleted) + accuracy) / totalSnippets;

      user.stats.avgSpeed = newAvgSpeed;
      user.stats.accuracy = newAccuracy;
      user.stats.snippetsCompleted = totalSnippets;
      await user.save();
    }

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
