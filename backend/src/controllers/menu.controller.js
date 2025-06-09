import MenuItem from "../models/menu.model.js";
import Canteen from "../models/canteen.model.js";
import CanteenMenu from "../models/menu.model.js";

export const addMenuItem = async (req, res) => {
  try {
    const { canteenId } = req.params;
    const { name, price, description, image, category } = req.body;

    if (!["breakfast", "lunch", "chinese", "specialFood"].includes(category)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const canteen = await Canteen.findById(canteenId);
    if (!canteen) return res.status(404).json({ message: "Canteen not found" });

    if (canteen.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Find or create menu doc
    let menu = await CanteenMenu.findOne({ canteen: canteenId });
    if (!menu) {
      menu = new CanteenMenu({ canteen: canteenId });
    }

    menu[category].push({ name, price, description, image });
    await menu.save();

    res.status(201).json({ message: "Item added", menu });
  } catch (error) {
    console.error("Failed to add item:", error.response?.data || error.message);
  }
};
export const deleteMenuItem = async (req, res) => {
  try {
    const { canteenId, category, itemIndex } = req.params;

    const menu = await CanteenMenu.findOne({ canteen: canteenId }).populate(
      "canteen"
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (menu.canteen.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const index = parseInt(itemIndex, 10);

    if (!menu[category] || !menu[category][index]) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Remove item from category array
    menu[category].splice(index, 1);
    await menu.save();

    res.status(200).json({ message: "Menu item deleted", menu });
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { canteenId, category, itemIndex } = req.params;
    const { name, price, description, image } = req.body;

    const menu = await CanteenMenu.findOne({ canteen: canteenId }).populate(
      "canteen"
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    if (menu.canteen.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const index = parseInt(itemIndex, 10);

    if (!menu[category] || !menu[category][index]) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Update the item
    menu[category][index].name = name || menu[category][index].name;
    menu[category][index].price = price || menu[category][index].price;
    menu[category][index].description =
      description || menu[category][index].description;
    menu[category][index].image = image || menu[category][index].image;

    await menu.save();

    res.status(200).json({ message: "Item updated successfully", menu });
  } catch (error) {
    console.error("Error updating item:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMenuByCanteenId = async (req, res) => {
  try {
    const { canteenId } = req.params;

    const menu = await CanteenMenu.findOne({ canteen: canteenId });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
