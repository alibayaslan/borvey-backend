import mongoose from "mongoose";
import { NotificationSchema } from "../schemas/notification.js";

export const Notification = mongoose.model("notification", NotificationSchema);
