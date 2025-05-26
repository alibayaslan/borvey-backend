import mongoose from "mongoose";

export const MessageSchema = mongoose.Schema({
  updateDate: {
    type: String,
    required: false,
  },
  personalUserID: { type: mongoose.Schema.Types.ObjectId, ref: "personalUser" },
  serviceUserID: { type: mongoose.Schema.Types.ObjectId, ref: "serviceUser" },
  messageData: [
    {
      text: {
        type: String,
        required: false,
      },
      sendDate: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        enum: ["personal", "service"],
      },
    },
  ],

  createDate: { type: Date, default: Date.now },
});
