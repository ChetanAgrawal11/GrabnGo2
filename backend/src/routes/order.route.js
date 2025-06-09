import express from "express";
import {
  createOrder,
  getCanteenOrders,
  updateOrderStatus,
  getUserOrders, // import your new controller
} from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/user", protectRoute, getUserOrders); // <-- ADD THIS ROUTE
router.get("/:canteenId", protectRoute, restrictTo("owner"), getCanteenOrders);
router.put("/:orderId", protectRoute, restrictTo("owner"), updateOrderStatus);

export default router;
