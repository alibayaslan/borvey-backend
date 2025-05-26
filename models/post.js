import mongoose from "mongoose";
import { PostSchema } from "../schemas/post.js";

export const Post = mongoose.model("post", PostSchema);
