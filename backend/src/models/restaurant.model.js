import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true }, // <--- Added this
  location: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  contactNumber: { type: String }, // For reservations or queries
  email: { type: String }, // For contact or admin use

  openingHours: {
    type: Map,
    of: String, // e.g., { "Monday": "9 AM - 10 PM" }
  },

  isOpen: { type: Boolean, default: true }, // For soft-disable
  rating: { type: Number, default: 0 }, // Average user rating
  totalRatings: { type: Number, default: 0 }, // Number of ratings

  image: {
    type: String,
    default: null,
  },
  // Array of image URLs
  menu: [
    {
      // Optional menu items
      name: String,
      price: Number,
      description: String,
    },
  ],

  createdAt: { type: Date, default: Date.now }, // Timestamps
  updatedAt: { type: Date, default: Date.now },
});

restaurantSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
