import mongoose from "mongoose";
import { ContactSchema } from "../schemas/contact.js";

export const Contact = mongoose.model("contact", ContactSchema);
