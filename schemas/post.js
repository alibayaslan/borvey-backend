import mongoose from "mongoose";

export const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "personalUser" },
  type: {
    type: String,
    enum: ["home", "single", "office", "short"],
    default: "home",
  },
  questions: [
    {
      question: {
        type: String,
        required: false,
      },
      answer: {
        type: String,
        required: false,
      },
    },
  ],
  additionalInfo: {
    type: String,
    required: false,
  },
  address: {
    from: {
      city: {
        type: String,
        required: false,
      },
      district: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
    },
    to: {
      city: {
        type: String,
        required: false,
      },
      district: {
        type: String,
        required: false,
      },
      street: {
        type: String,
        required: false,
      },
    },
  },

  offers: [{ type: mongoose.Schema.Types.ObjectId, ref: "offer" }],

  status: {
    type: String,
    enum: ["online", "working", "offline", "blocked", "completed"],
    default: "online",
  },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: "comment" },

  date: { type: Date, default: Date.now },
});
