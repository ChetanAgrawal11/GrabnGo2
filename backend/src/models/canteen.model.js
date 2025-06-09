import mongoose from "mongoose";

const canteenSchema = new mongoose.Schema(
  {
    canteenName: { type: String, required: true },
    canteenAddress: { type: String, required: true },
    collegeName: { type: String, required: true },
    licenseImage: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ownerName: { type: String },
    ownerPhone: { type: String },
    ownerEmail: { type: String },

    canteenPhoto: { type: String },
    aadharCardNumber: { type: String, required: true },

    // 🆕 Join Requests (similar to Tiffin)
    requests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        approvedAt: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Canteen", canteenSchema);
