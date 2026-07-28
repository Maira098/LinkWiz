import mongoose from "mongoose";

const ExchangeSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    serviceOffered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    serviceRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    message: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("Exchange", ExchangeSchema);