import mongoose from "mongoose";
import { MessageSchema } from "../schemas/message.js";

export const Message = mongoose.model("message", MessageSchema);
