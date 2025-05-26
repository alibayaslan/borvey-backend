import mongoose from "mongoose";

export const OfferSchema = mongoose.Schema({
  personalUserID: { type: mongoose.Schema.Types.ObjectId, ref: "personalUser" },
  serviceUserID: { type: mongoose.Schema.Types.ObjectId, ref: "serviceUser" },
  postID: { type: mongoose.Schema.Types.ObjectId, ref: "post" },
  type: {
    type: String,
    enum: ["home", "single", "office", "short"],
    default: "home",
  },
  time: {
    from: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: false,
    },
  },
  date: {
    from: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: false,
    },
  },
  price: {
    type: String,
    required: false,
  },
  conditions: [
    {
      title: {
        type: String,
        required: false,
      },
      status: {
        type: Boolean,
        required: false,
      },
    },
  ],

  status: {
    type: String,
    enum: ["hold", "accept", "decline"],
    default: "hold",
  },

  createDate: { type: Date, default: Date.now },
});
