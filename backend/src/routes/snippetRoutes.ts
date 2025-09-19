import express, { Request, Response } from "express";
import Snippet, { ISnippet } from "../models/Snippet";

const router = express.Router();

router.get("/random", async (req: Request, res: Response) => {
  const count = await Snippet.countDocuments();
  const random = Math.floor(Math.random() * count);
  const snippet: ISnippet | null = await Snippet.findOne().skip(random);
  res.json(snippet || { code: "console.log('Hello World');" });
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { code, language, difficulty } = req.body;
    const snippet = new Snippet({ code, language, difficulty });
    await snippet.save();
    res.json(snippet);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
