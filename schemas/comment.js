import mongoose from "mongoose";

export const CommentSchema = mongoose.Schema({
  personalUserID: { type: mongoose.Schema.Types.ObjectId, ref: "personalUser" },
  serviceUserID: { type: mongoose.Schema.Types.ObjectId, ref: "serviceUser" },
  postID: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  rate: {
    type: Number,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  date: { type: Date, default: Date.now },
});
