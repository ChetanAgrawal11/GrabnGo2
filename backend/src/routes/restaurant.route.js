import express from "express";
import {
  addRestaurant,
  getAllRestaurants,
  getMyRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/restaurant.controller.js";

import { protectRoute } from "../middleware/protectRoute.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Owner-only routes
router.get("/my", protectRoute, restrictTo("owner"), getMyRestaurants);

router.get("/:id", getRestaurantById); // get restaurant by id
router.get("/", getAllRestaurants); // get all restaurants (public)

// Only this route is enhanced with image upload
router.post(
  "/",
  protectRoute,
  restrictTo("owner"),
  upload.single("image"), // << Only added here
  addRestaurant
);

router.put("/:id", protectRoute, restrictTo("owner"), updateRestaurant);
router.delete("/:id", protectRoute, restrictTo("owner"), deleteRestaurant);

// Menu item routes (owner only)
router.post("/:id/menu", protectRoute, restrictTo("owner"), addMenuItem);
router.put(
  "/:id/menu/:itemId",
  protectRoute,
  restrictTo("owner"),
  updateMenuItem
);
router.delete(
  "/:id/menu/:itemId",
  protectRoute,
  restrictTo("owner"),
  deleteMenuItem
);

export default router;
