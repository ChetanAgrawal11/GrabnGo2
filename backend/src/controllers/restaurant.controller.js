import { Restaurant } from "../models/restaurant.model.js";

// Public: Get all restaurants, no pagination
export const getAllRestaurants = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = search ? { name: new RegExp(search, "i") } : {};
    const data = await Restaurant.find(query);

    res.json({ total: data.length, data });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch restaurants", error: error.message });
  }
};

// Owner: Get all restaurants owned by logged-in user
export const getMyRestaurants = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const ownerId = req.user._id;

    const query = {
      owner: ownerId,
      ...(search && { name: new RegExp(search, "i") }),
    };

    const data = await Restaurant.find(query);
    res.json({ total: data.length, data });
  } catch (error) {
    console.error("Error fetching owner restaurants:", error);
    res.status(500).json({
      message: "Failed to fetch owner restaurants",
      error: error.message,
    });
  }
};

export const addRestaurant = async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      contactNumber,
      email,
      openingHours,
      isOpen,
    } = req.body;

    // Parse openingHours JSON string into an object for Map type
    let parsedOpeningHours = null;
    if (openingHours) {
      try {
        const obj = JSON.parse(openingHours);
        parsedOpeningHours = new Map(Object.entries(obj));
      } catch (err) {
        return res
          .status(400)
          .json({ message: "Invalid openingHours JSON format" });
      }
    }

    // Convert isOpen string to boolean
    const parsedIsOpen = isOpen === "true" || isOpen === true;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const restaurant = await Restaurant.create({
      name,
      location,
      address, // <--- added here
      contactNumber,
      email,
      openingHours: parsedOpeningHours,
      isOpen: parsedIsOpen,
      image,
      owner: req.user._id,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Error adding restaurant:", error);
    res.status(500).json({
      message: "Failed to add restaurant",
      error: error.message,
    });
  }
};

// Get a specific restaurant by ID
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch restaurant", error: error.message });
  }
};

// Update a restaurant (only if owner)
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res
      .status(500)
      .json({ message: "Failed to update restaurant", error: error.message });
  }
};

// Delete a restaurant (only if owner)
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res
      .status(500)
      .json({ message: "Failed to delete restaurant", error: error.message });
  }
};

export const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    restaurant.menu.push(req.body);
    await restaurant.save();
    res.status(201).json(restaurant.menu);
  } catch (error) {
    console.error("Add menu item error:", error);
    res
      .status(500)
      .json({ message: "Failed to add menu item", error: error.message });
  }
};

// Update a specific menu item
export const updateMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    Object.assign(item, req.body);
    await restaurant.save();

    res.json(item);
  } catch (error) {
    console.error("Update menu item error:", error);
    res
      .status(500)
      .json({ message: "Failed to update menu item", error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    if (!restaurant.owner.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const item = restaurant.menu.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    restaurant.menu.pull(item._id); // ✅ Correct way to remove
    await restaurant.save();

    res.json({ message: "Menu item deleted" });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res
      .status(500)
      .json({ message: "Failed to delete menu item", error: error.message });
  }
};
