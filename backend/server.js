import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectMongoDB from "./src/db/connectMongoDB.js";

import authRoutes from "./src/routes/auth.route.js";
import restaurantRoutes from "./src/routes/restaurant.route.js";
import tiffinRoutes from "./src/routes/tiffin.route.js";
import menuRoutes from "./src/routes/menu.route.js";

import canteenRoutes from "./src/routes/canteen.route.js";
import canteenMenuRoutes from "./src/routes/menu.route.js"; // same file reused for canteen menu
import orderRoutes from "./src/routes/order.route.js";

dotenv.config();

const app = express();

// Enable CORS with credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

// ✅ Serve uploaded images statically
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tiffins", tiffinRoutes);
app.use("/api/menus", menuRoutes);

// 🆕 Canteen Management APIs
app.use("/api/canteens", canteenRoutes);
app.use("/api/canteen-menus", canteenMenuRoutes);
app.use("/api/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 5000;
connectMongoDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
