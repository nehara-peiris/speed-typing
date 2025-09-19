const fs = require("fs");
const path = require("path");

// Utility: create folder if not exists
function mkdirp(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Utility: write file with content
function write(filePath, content) {
    mkdirp(path.dirname(filePath));
    fs.writeFileSync(filePath, content);
    console.log("✅ Created:", filePath);
}

// ---------- Backend Files ----------
write("backend/package.json", `{
  "name": "backend",
  "version": "1.0.0",
  "main": "src/index.ts",
  "type": "module",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "ts-node": "^10.9.1",
    "typescript": "^5.0.4",
    "@types/bcrypt": "^5.0.0",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/node": "^20.4.2"
  }
}`);

write("backend/tsconfig.json", `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src/**/*"]
}`);

write("backend/.env", `MONGO_URI=mongodb://127.0.0.1:27017/typing-speed
JWT_SECRET=supersecretkey
`);

write("backend/src/index.ts", `import express, { Application } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import snippetRoutes from "./routes/snippetRoutes";

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/snippets", snippetRoutes);

mongoose.connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(8080, () => console.log("🚀 Server running on port 8080"));
  })
  .catch(err => console.error(err));
`);

write("backend/src/models/User.ts", `import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  stats: {
    avgSpeed: number;
    accuracy: number;
    snippetsCompleted: number;
  };
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  stats: {
    avgSpeed: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    snippetsCompleted: { type: Number, default: 0 }
  }
});

export default mongoose.model<IUser>("User", userSchema);
`);

write("backend/src/models/Snippet.ts", `import mongoose, { Document, Schema } from "mongoose";

export interface ISnippet extends Document {
  code: string;
  language: string;
  difficulty: string;
}

const snippetSchema: Schema<ISnippet> = new mongoose.Schema({
  code: { type: String, required: true },
  language: { type: String, default: "javascript" },
  difficulty: { type: String, default: "easy" }
});

export default mongoose.model<ISnippet>("Snippet", snippetSchema);
`);

write("backend/src/routes/authRoutes.ts", `import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user: IUser = new User({ username, email, password: hashed });
    await user.save();
    res.json({ message: "✅ User registered" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: IUser | null = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
`);

write("backend/src/routes/snippetRoutes.ts", `import express, { Request, Response } from "express";
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
`);

// ---------- Frontend Placeholder ----------
write("frontend/README.txt", `Run:
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

Then add pages/Login.tsx and pages/Practice.tsx with the code provided.`);
