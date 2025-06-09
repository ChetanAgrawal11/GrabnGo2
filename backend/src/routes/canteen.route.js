import express from "express";
import {
  createCanteen,
  getAllCanteens,
  getMyCanteen,
  getCanteenById,
  updateCanteen,
  deleteCanteen,
  requestCanteen,
  updateCanteenRequestStatus,
  getCanteenRequestsForOwner,
} from "../controllers/canteen.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();
// ✅ File upload middleware for licenseImage and canteenPhoto
const canteenUploads = upload.fields([
  { name: "licenseImage", maxCount: 1 },
  { name: "canteenPhoto", maxCount: 1 },
]);

// ✅ Routes
router.post(
  "/",
  protectRoute,
  restrictTo("owner"),
  canteenUploads, // apply file upload middleware
  createCanteen
);
router.get("/all", getAllCanteens);
router.get("/my", protectRoute, restrictTo("owner"), getMyCanteen);
router.get("/:id", getCanteenById);
router.put(
  "/:id",
  protectRoute,
  restrictTo("owner"),
  canteenUploads, // apply file upload middleware
  updateCanteen
);
router.delete("/:id", protectRoute, restrictTo("owner"), deleteCanteen);

router.post("/request/:id", protectRoute, restrictTo("user"), requestCanteen);
router.put(
  "/request/:canteenId/:userId",
  protectRoute,
  restrictTo("owner"),
  updateCanteenRequestStatus
);
router.get(
  "/my-canteen/requests",
  protectRoute,
  restrictTo("owner"),
  getCanteenRequestsForOwner
);

export default router;
