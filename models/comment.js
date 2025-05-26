import mongoose from "mongoose";
import { CommentSchema } from "../schemas/comment.js";

export const Comment = mongoose.model("comment", CommentSchema);
