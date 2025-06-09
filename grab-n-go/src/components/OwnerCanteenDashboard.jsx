import React, { useEffect, useState } from "react";
import axios from "axios";

const categories = ["breakfast", "lunch", "chinese", "specialFood"];

const OwnerCanteenDashboard = () => {
  const [canteen, setCanteen] = useState(null);
  const [menu, setMenu] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    category: "breakfast",
    image: "",
  });

  const [editIndex, setEditIndex] = useState({});
  const [editItem, setEditItem] = useState(null);

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchMyCanteen = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/canteens/my",
        config
      );
      setCanteen(res.data);
      fetchMenu(res.data._id);
    } catch (error) {
      console.error(
        "Error fetching canteen:",
        error.response?.data || error.message
      );
    }
  };

  const fetchMenu = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/canteen-menus/${id}`,
        config
      );
      setMenu(res.data);
    } catch (error) {
      console.error(
        "Error fetching menu:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddItem = async () => {
    if (!canteen) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/canteen-menus/${canteen._id}/add-item`,
        { ...newItem },
        config
      );
      setMenu(res.data.menu);
      alert("Item added!");
      setNewItem({
        name: "",
        price: "",
        description: "",
        category: "breakfast",
        image: "",
      });
    } catch (error) {
      alert("Failed to add item");
      console.error(error.response?.data || error.message);
    }
  };

  const startEditItem = (category, index) => {
    const item = menu[category][index];
    setEditItem({ ...item });
    setEditIndex({ category, index });
  };

  const cancelEdit = () => {
    setEditIndex({});
    setEditItem(null);
  };

  const handleUpdateItem = async () => {
    const { category, index } = editIndex;
    try {
      await axios.put(
        `http://localhost:5000/api/canteen-menus/${canteen._id}/${category}/${index}`,
        editItem,
        config
      );
      alert("Item updated!");
      setEditIndex({});
      setEditItem(null);
      fetchMenu(canteen._id);
    } catch (error) {
      alert("Update failed");
      console.error(error.response?.data || error.message);
    }
  };

  const handleDeleteItem = async (category, index) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/canteen-menus/${canteen._id}/${category}/${index}`,
        config
      );
      alert("Item deleted!");
      fetchMenu(canteen._id);
    } catch (error) {
      alert("Delete failed");
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMyCanteen();
  }, []);

  if (!canteen) {
    return (
      <div className="p-8 text-center text-gray-600">Loading canteen...</div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Owner Canteen Dashboard
      </h2>

      {/* Canteen Info */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-8 border border-blue-100">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          🏠 Canteen Information
        </h3>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-medium">Name:</span> {canteen.canteenName}
          </p>
          <p>
            <span className="font-medium">Address:</span>{" "}
            {canteen.canteenAddress}
          </p>
          <p>
            <span className="font-medium">College:</span> {canteen.collegeName}
          </p>
        </div>
      </div>

      {/* Add New Item */}
      <div className="bg-white p-6 rounded-2xl shadow-md mb-10 border border-green-100">
        <h3 className="text-xl font-semibold text-green-700 mb-4">
          ➕ Add New Menu Item
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Category
            </label>
            <select
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full border px-3 py-2 rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleAddItem}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
        >
          Add Item
        </button>
      </div>

      {/* Menu List */}
      {menu &&
        categories.map((cat) => (
          <div
            key={cat}
            className="mb-4 border rounded-lg bg-gray-50 shadow-sm"
          >
            <div
              className="bg-gray-200 px-4 py-3 cursor-pointer flex justify-between items-center"
              onClick={() =>
                setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }))
              }
            >
              <h4 className="text-lg font-bold capitalize">{cat} Menu</h4>
              <span className="text-xl">{expanded[cat] ? "▲" : "▼"}</span>
            </div>

            {expanded[cat] && (
              <div className="px-6 py-4">
                {menu[cat]?.length > 0 ? (
                  <ul className="space-y-3">
                    {menu[cat].map((item, index) => (
                      <li
                        key={index}
                        className="bg-white rounded-lg p-3 border shadow-sm"
                      >
                        {editIndex.category === cat &&
                        editIndex.index === index ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              value={editItem.name}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  name: e.target.value,
                                })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                            <input
                              type="number"
                              value={editItem.price}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  price: e.target.value,
                                })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                            <input
                              type="text"
                              value={editItem.description}
                              onChange={(e) =>
                                setEditItem({
                                  ...editItem,
                                  description: e.target.value,
                                })
                              }
                              className="w-full border px-2 py-1 rounded"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={handleUpdateItem}
                                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-semibold text-gray-800">
                              {item.name}{" "}
                              <span className="text-sm text-gray-500">
                                ₹{item.price}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.description || "No description"}
                            </p>
                            <div className="flex gap-4 mt-3">
                              <button
                                onClick={() => startEditItem(cat, index)}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-1 px-3 rounded"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDeleteItem(cat, index)}
                                className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded"
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No items in this category
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default OwnerCanteenDashboard;
