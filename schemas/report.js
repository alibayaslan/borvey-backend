import mongoose from "mongoose";

export const ReportSchema = mongoose.Schema({
  personalUserId: { type: mongoose.Schema.Types.ObjectId, ref: "personalUser" },
  serviceUserId: { type: mongoose.Schema.Types.ObjectId, ref: "serviceUser" },
  messageId: { type: mongoose.Schema.Types.ObjectId, ref: "message" },
  reason: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    enum: ["personal", "service"],
  },
  createDate: {
    type: String,
    required: false,
  },
});
