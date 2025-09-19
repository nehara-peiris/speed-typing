import mongoose, { Document, Schema } from "mongoose";

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
