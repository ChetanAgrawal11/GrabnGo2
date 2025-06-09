import express from "express";
import {
  addMenuItem,
  updateMenuItem,
  getMenuByCanteenId, // 🆕
  deleteMenuItem, // 🆕
} from "../controllers/menu.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Get menu for a specific canteen
router.get("/:canteenId", protectRoute, getMenuByCanteenId);

// Add a menu item to a specific category in a canteen
router.put(
  "/:canteenId/add-item",
  protectRoute,
  restrictTo("owner"),
  addMenuItem
);

router.delete(
  "/:canteenId/:category/:itemIndex",
  protectRoute,
  restrictTo("owner"),
  deleteMenuItem
);
router.put(
  "/:canteenId/:category/:itemIndex",
  protectRoute,
  restrictTo("owner"),
  updateMenuItem
);

export default router;
