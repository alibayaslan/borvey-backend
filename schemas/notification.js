import mongoose from "mongoose";

export const NotificationSchema = mongoose.Schema({
  updateDate: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["offer", "message", "offerAnswer", "comment"],
  },
  isRead: {
    type: Boolean,
    required: false,
    default: false,
  },
  personalUserId: { type: mongoose.Schema.Types.ObjectId, ref: "personalUser" },
  serviceUserId: { type: mongoose.Schema.Types.ObjectId, ref: "serviceUser" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "offer" },
  text: {
    type: String,
    required: false,
  },
  createDate: {
    type: String,
    required: false,
  },
});
