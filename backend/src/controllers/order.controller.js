import Order from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, canteenId } = req.body;

    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ error: "Order must include at least one item." });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res
        .status(400)
        .json({ error: "Total amount must be greater than zero." });
    }

    if (!canteenId) {
      return res.status(400).json({ error: "Canteen ID is required." });
    }

    // Ensure req.user._id is available (authentication middleware must set this)
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    // Create order using full item details (expected by your schema)
    const order = await Order.create({
      user: req.user._id,
      canteen: canteenId,
      items, // items should have: name, price, quantity, category, image (optional)
      totalAmount,
      status: "Pending", // optional, default is Pending anyway
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Get orders placed by the current user (student)
// Get orders placed by the current user (student)
export const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized. User not found." });
    }

    console.log("User ID in request:", req.user._id); // Log user ID

    const orders = await Order.find({ user: req.user._id })
      .populate("canteen", "name") // ✅ Only populate canteen name
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getCanteenOrders = async (req, res) => {
  try {
    const orders = await Order.find({ canteen: req.params.canteenId }).populate(
      "user",
      "fullName email"
    );

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
