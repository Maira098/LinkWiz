import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);