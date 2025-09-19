import mongoose, { Document, Schema } from "mongoose";

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
