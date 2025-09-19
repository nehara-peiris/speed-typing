import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./User";
import { ISnippet } from "./Snippet";

export interface IResult extends Document {
  user: IUser["_id"];
  snippet: ISnippet["_id"];
  time: number;
  wpm: number;
  accuracy: number;
  createdAt: Date;
}

const resultSchema: Schema<IResult> = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  snippet: { type: Schema.Types.ObjectId, ref: "Snippet", required: true },
  time: { type: Number, required: true }, // time in seconds
  wpm: { type: Number, required: true },
  accuracy: { type: Number, required: true }, // percentage
}, { timestamps: true });

export default mongoose.model<IResult>("Result", resultSchema);
