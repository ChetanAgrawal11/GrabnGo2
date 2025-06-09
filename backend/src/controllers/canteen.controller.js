import Canteen from "../models/canteen.model.js";

export const createCanteen = async (req, res) => {
  try {
    // Get filenames from uploaded files
    const licenseImageFileName = req.files?.licenseImage?.[0]?.filename || "";
    const canteenPhotoFileName = req.files?.canteenPhoto?.[0]?.filename || "";

    // Destructure other fields from req.body
    const {
      canteenName,
      canteenAddress,
      collegeName,
      ownerName,
      ownerPhone,
      aadharCardNumber,
    } = req.body;

    const canteen = await Canteen.create({
      canteenName,
      canteenAddress,
      collegeName,
      licenseImage: licenseImageFileName, // Use filename from uploaded file
      owner: req.user._id,
      ownerName,
      ownerPhone,
      canteenPhoto: canteenPhotoFileName, // Use filename from uploaded file
      aadharCardNumber,
    });

    res.status(201).json(canteen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find();
    res.status(200).json(canteens);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findOne({ owner: req.user._id });
    if (!canteen) {
      return res.status(404).json({ message: "Canteen not found" });
    }
    res.status(200).json(canteen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCanteenById = async (req, res) => {
  try {
    const { id } = req.params;
    const canteen = await Canteen.findById(id);
    if (!canteen) {
      return res.status(404).json({ message: "Canteen not found" });
    }
    res.status(200).json(canteen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCanteen = async (req, res) => {
  try {
    const { id } = req.params;

    const canteen = await Canteen.findById(id);
    if (!canteen) return res.status(404).json({ message: "Canteen not found" });

    if (canteen.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this canteen" });
    }

    const updatedCanteen = await Canteen.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedCanteen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCanteen = async (req, res) => {
  try {
    const { id } = req.params;

    const canteen = await Canteen.findById(id);
    if (!canteen) return res.status(404).json({ message: "Canteen not found" });

    if (canteen.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this canteen" });
    }

    await Canteen.findByIdAndDelete(id);
    res.status(200).json({ message: "Canteen deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestCanteen = async (req, res) => {
  try {
    const { id } = req.params; // canteen ID
    const userId = req.user._id;

    const canteen = await Canteen.findById(id);
    if (!canteen) return res.status(404).json({ message: "Canteen not found" });

    if (!canteen.requests) canteen.requests = [];

    const alreadyRequested = canteen.requests.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyRequested) {
      return res
        .status(400)
        .json({ message: "You already requested this canteen" });
    }

    canteen.requests.push({ user: userId, status: "pending" });
    await canteen.save();

    res
      .status(200)
      .json({ message: "Canteen request submitted", data: canteen });
  } catch (error) {
    res.status(500).json({ message: "Request failed", error: error.message });
  }
};

/**
 * Update request status (owner side)
 */
export const updateCanteenRequestStatus = async (req, res) => {
  try {
    const { canteenId, userId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const canteen = await Canteen.findOne({
      _id: canteenId,
      owner: req.user._id,
    });
    if (!canteen)
      return res
        .status(404)
        .json({ message: "Canteen not found or unauthorized" });

    const request = canteen.requests.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = status;
    if (status === "approved") {
      request.approvedAt = new Date();
    }

    await canteen.save();
    res.status(200).json({ message: `Request ${status}`, data: canteen });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: error.message });
  }
};

export const getCanteenRequestsForOwner = async (req, res) => {
  try {
    const canteens = await Canteen.find({ owner: req.user._id })
      .populate("requests.user", "fullName email")
      .lean();

    res.status(200).json({ data: canteens });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch requests", error: error.message });
  }
};
