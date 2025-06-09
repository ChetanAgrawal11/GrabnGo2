import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResOwner = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [restaurantImage, setRestaurantImage] = useState(null);
  const handleLogout = () => {
    localStorage.removeItem("token"); // or sessionStorage if you're using that
    navigate("/");
  };

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    location: "",
    address: "", // ✅ New field
    contactNumber: "",
    email: "",
    openingHours: "",
    isOpen: true,
    image: null,
  });

  const [menuInputs, setMenuInputs] = useState({});
  const [editMenuInputs, setEditMenuInputs] = useState({});
  const [editMode, setEditMode] = useState({});
  const [addingMenuAnimating, setAddingMenuAnimating] = useState({});
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [ownerInfo, setOwnerInfo] = useState({
    fullName: "",
    email: "",
  });

  const fetchRestaurants = async () => {
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/restaurants/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(res.data.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch restaurants error:", err);
      setError("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setOwnerInfo(JSON.parse(storedUser));
    }
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewRestaurant((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    setError("");

    // Validate and parse openingHours as before
    let parsedHours = {};
    try {
      if (newRestaurant.openingHours.trim()) {
        parsedHours = JSON.parse(newRestaurant.openingHours);
        if (typeof parsedHours !== "object" || Array.isArray(parsedHours)) {
          throw new Error("Opening hours must be a valid object");
        }
      }
    } catch (err) {
      setError('Invalid openingHours format. Use {"Monday": "9-5"}');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newRestaurant.name);
      formData.append("location", newRestaurant.location);
      formData.append("address", newRestaurant.address); // ✅ ADD THIS LINE
      formData.append("contactNumber", newRestaurant.contactNumber);
      formData.append("email", newRestaurant.email);
      formData.append("isOpen", newRestaurant.isOpen);
      formData.append("openingHours", JSON.stringify(parsedHours));

      if (restaurantImage) {
        formData.append("image", restaurantImage);
      }

      const res = await axios.post(
        "http://localhost:5000/api/restaurants",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newRes = res.data.data || res.data;
      setRestaurants((prev) => [...prev, newRes]);

      // Reset form
      setNewRestaurant({
        name: "",
        location: "",
        address: "", // ✅ Reset this too
        contactNumber: "",
        email: "",
        openingHours: "",
        isOpen: true,
      });
      setRestaurantImage(null);
      setShowForm(false);
      setError("");
    } catch (err) {
      console.error("Add restaurant error:", err);
      setError("Failed to add restaurant (check all fields and image)");
    }
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setTimeout(async () => {
      try {
        await axios.delete(`http://localhost:5000/api/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants((prev) => prev.filter((r) => r._id !== id));
        setError("");
      } catch (err) {
        console.error("Delete restaurant error:", err);
        setError("Failed to delete restaurant");
      } finally {
        setDeletingId(null);
      }
    }, 500);
  };

  const handleMenuInputChange = (restaurantId, e) => {
    const { name, value } = e.target;
    setMenuInputs((prev) => ({
      ...prev,
      [restaurantId]: {
        ...prev[restaurantId],
        [name]: value,
      },
    }));
  };

  const handleAddMenuItem = async (restaurantId) => {
    const menuItem = menuInputs[restaurantId];
    if (!menuItem || !menuItem.name || !menuItem.price) {
      setError("Menu name and price are required");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/restaurants/${restaurantId}/menu`,
        menuItem,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedMenu = res.data.data || res.data;

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId ? { ...r, menu: updatedMenu } : r
        )
      );

      setMenuInputs((prev) => ({
        ...prev,
        [restaurantId]: { name: "", price: "" },
      }));

      setAddingMenuAnimating((prev) => ({
        ...prev,
        [restaurantId]: true,
      }));

      setTimeout(() => {
        setAddingMenuAnimating((prev) => ({
          ...prev,
          [restaurantId]: false,
        }));
      }, 600);

      setError("");
    } catch (err) {
      console.error("Add menu item error:", err);
      setError("Failed to add menu item");
    }
  };

  const handleEditInputChange = (restaurantId, itemId, e) => {
    const { name, value } = e.target;
    setEditMenuInputs((prev) => ({
      ...prev,
      [restaurantId]: {
        ...prev[restaurantId],
        [itemId]: {
          ...prev[restaurantId]?.[itemId],
          [name]: value,
        },
      },
    }));
  };

  const handleUpdateMenuItem = async (restaurantId, itemId) => {
    const itemData = editMenuInputs[restaurantId]?.[itemId];
    if (!itemData || !itemData.name || !itemData.price) {
      setError("Both name and price are required to update");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/restaurants/${restaurantId}/menu/${itemId}`,
        itemData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedItem = res.data;

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId
            ? {
                ...r,
                menu: r.menu.map((item) =>
                  item._id === itemId ? updatedItem : item
                ),
              }
            : r
        )
      );

      setEditMode((prev) => ({
        ...prev,
        [restaurantId]: { ...prev[restaurantId], [itemId]: false },
      }));
      setError("");
    } catch (err) {
      console.error("Update menu item error:", err);
      setError("Failed to update menu item");
    }
  };

  const handleDeleteMenuItem = async (restaurantId, itemId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/restaurants/${restaurantId}/menu/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRestaurants((prev) =>
        prev.map((r) =>
          r._id === restaurantId
            ? { ...r, menu: r.menu.filter((item) => item._id !== itemId) }
            : r
        )
      );

      setError("");
    } catch (err) {
      console.error("Delete menu item error:", err);
      setError("Failed to delete menu item");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="relative max-w-6xl mx-auto p-4 pb-32">
      {/* Profile Navbar */}
      {/* Profile Navbar */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow mb-6 relative">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {ownerInfo.fullName}</h1>
          <p className="text-sm">{ownerInfo.email}</p>
        </div>

        {/* Logout Button on top-right inside navbar */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-white text-blue-600 font-bold px-4 py-2 rounded-full shadow hover:bg-gray-100 transform hover:scale-110 transition duration-300"
          title="Logout"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Restaurant List */}
      <ul className="space-y-6">
        {restaurants.map((r) => (
          <li
            key={r._id}
            className={`border p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white transform ${
              deletingId === r._id
                ? "opacity-0 scale-90 transition-opacity transition-transform duration-500"
                : "opacity-100 scale-100"
            }`}
          >
            <h2 className="text-2xl font-semibold text-blue-700">{r.name}</h2>
            <p className="text-gray-600">{r.location}</p>
            <p className="text-sm text-gray-500">{r.email}</p>
            <p className="text-sm mb-2 text-gray-500">{r.contactNumber}</p>

            <div className="mt-2">
              <h3 className="font-semibold">Menu Items:</h3>
              {r.menu && r.menu.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {r.menu.map((item, index) => {
                    const isNewlyAdded =
                      addingMenuAnimating[r._id] && index === r.menu.length - 1;

                    return (
                      <li
                        key={item._id}
                        className={`flex items-center justify-between gap-2 flex-wrap
                          transition-opacity duration-600 ease-in-out
                          ${
                            isNewlyAdded
                              ? "opacity-0 animate-fadeIn"
                              : "opacity-100"
                          }
                        `}
                        style={{
                          animationFillMode: "forwards",
                          animationDuration: "600ms",
                        }}
                      >
                        {editMode[r._id]?.[item._id] ? (
                          <div className="flex gap-2 flex-wrap items-center flex-grow">
                            <input
                              type="text"
                              name="name"
                              value={
                                editMenuInputs[r._id]?.[item._id]?.name ||
                                item.name
                              }
                              onChange={(e) =>
                                handleEditInputChange(r._id, item._id, e)
                              }
                              className="border p-1 rounded flex-grow min-w-[120px]"
                            />
                            <input
                              type="number"
                              name="price"
                              value={
                                editMenuInputs[r._id]?.[item._id]?.price ||
                                item.price
                              }
                              onChange={(e) =>
                                handleEditInputChange(r._id, item._id, e)
                              }
                              className="border p-1 rounded w-[100px]"
                            />
                          </div>
                        ) : (
                          <span className="flex-grow text-gray-700">
                            {item.name} - ₹{item.price}
                          </span>
                        )}

                        <div className="flex gap-2 flex-shrink-0">
                          {editMode[r._id]?.[item._id] ? (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateMenuItem(r._id, item._id)
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-transform transform hover:scale-105"
                                type="button"
                              >
                                Save
                              </button>
                              <button
                                onClick={() =>
                                  setEditMode((prev) => ({
                                    ...prev,
                                    [r._id]: {
                                      ...prev[r._id],
                                      [item._id]: false,
                                    },
                                  }))
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-transform transform hover:scale-105"
                                type="button"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  setEditMode((prev) => ({
                                    ...prev,
                                    [r._id]: {
                                      ...prev[r._id],
                                      [item._id]: true,
                                    },
                                  }))
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-transform transform hover:scale-105"
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteMenuItem(r._id, item._id)
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-transform transform hover:scale-105"
                                type="button"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No items yet</p>
              )}
            </div>

            {/* Add Menu */}
            <div className="mt-4 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={menuInputs[r._id]?.name || ""}
                onChange={(e) => handleMenuInputChange(r._id, e)}
                className="border p-2 rounded flex-grow min-w-[120px]"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={menuInputs[r._id]?.price || ""}
                onChange={(e) => handleMenuInputChange(r._id, e)}
                className="border p-2 rounded w-[100px]"
              />
              <button
                onClick={() => handleAddMenuItem(r._id)}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-transform transform hover:scale-105"
                type="button"
              >
                Add Menu Item
              </button>
            </div>

            <button
              onClick={() => handleDelete(r._id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-transform transform hover:scale-105"
              type="button"
            >
              Delete Restaurant
            </button>
          </li>
        ))}
      </ul>

      {/* Floating Add Restaurant Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110"
      >
        + Add Restaurant
      </button>

      {/* Tiffin Service Navigation Button */}
      <button
        onClick={() => navigate("/tiffin")}
        className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition-transform transform hover:scale-110 "
        title="Go to Tiffin Service"
      >
        Go to Tiffin Service
      </button>

      {/* Modal Popup */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-[90%] md:w-[50%] shadow-2xl animate-scaleIn relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-6 text-xl font-bold text-gray-600 hover:text-red-600"
              type="button"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Add New Restaurant</h2>
            <form onSubmit={handleAddRestaurant} className="space-y-3">
              <input
                type="text"
                name="name"
                placeholder="Restaurant Name"
                value={newRestaurant.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={newRestaurant.location}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Full Address"
                value={newRestaurant.address}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="text"
                name="contactNumber"
                placeholder="Contact Number"
                value={newRestaurant.contactNumber}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newRestaurant.email}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                name="openingHours"
                placeholder='Opening Hours (e.g. {"Mon": "9-5"})'
                value={newRestaurant.openingHours}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={newRestaurant.isOpen}
                  onChange={handleChange}
                />
                <span>Is Open</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setRestaurantImage(e.target.files[0])}
                className="w-full border p-2 rounded"
              />

              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
              >
                Add
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation-name: fadeIn;
          animation-fill-mode: forwards;
          animation-duration: 600ms;
          animation-timing-function: ease-out;
        }
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation-name: scaleIn;
          animation-fill-mode: forwards;
          animation-duration: 300ms;
          animation-timing-function: ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResOwner;
