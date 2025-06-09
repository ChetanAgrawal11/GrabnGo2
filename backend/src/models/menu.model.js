import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    availability: { type: Boolean, default: true },
    image: { type: String }, // 🆕 Optional: image for menu item
  },
  { _id: false }
); // Prevent subdocument _id

const canteenMenuSchema = new mongoose.Schema(
  {
    canteen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canteen",
      required: true,
      unique: true, // 🛡️ Prevent duplicate menus for the same canteen
    },

    // Categorized items
    lunch: [itemSchema],
    chinese: [itemSchema],
    breakfast: [itemSchema],
    specialFood: [itemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CanteenMenu", canteenMenuSchema);
