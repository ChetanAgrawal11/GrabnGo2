import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialWeeklyMenu = {
  Monday: "",
  Tuesday: "",
  Wednesday: "",
  Thursday: "",
  Friday: "",
  Saturday: "",
  Sunday: "",
};

const TiffinService = () => {
  const navigate = useNavigate();
  const [tiffins, setTiffins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [price, setPrice] = useState(""); // new price state for Add form
  const [address, setAddress] = useState("");

  // Form state for add
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [weeklyMenu, setWeeklyMenu] = useState(initialWeeklyMenu);
  const [status, setStatus] = useState("Pending");

  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editWeeklyMenu, setEditWeeklyMenu] = useState(initialWeeklyMenu);
  const [editStatus, setEditStatus] = useState("Pending");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  // New state for showing add form modal
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch tiffin services for logged-in owner
  const fetchTiffins = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please login.");

      const response = await axios.get("http://localhost:5000/api/tiffins/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTiffins(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch tiffin services."
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTiffins();
  }, []);

  // Weekly menu input change handler for Add form
  const handleMenuChange = (day, value) => {
    setWeeklyMenu((prev) => ({ ...prev, [day]: value }));
  };

  // Weekly menu input change handler for Edit form
  const handleEditMenuChange = (day, value) => {
    setEditWeeklyMenu((prev) => ({ ...prev, [day]: value }));
  };

  // Add new tiffin service
  const handleAddTiffin = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError("");
    setAddSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please login.");

      const newTiffin = {
        name,
        description,
        startDate,
        weeklyMenu,
        status,
        price,
        address, // Add address here if used
      };

      await axios.post(
        "http://localhost:5000/api/tiffins/createTiffin",
        newTiffin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setAddSuccess("Tiffin service added successfully!");
      // Clear form
      setName("");
      setDescription("");
      setStartDate("");
      setWeeklyMenu(initialWeeklyMenu);
      setStatus("Pending");
      setShowAddModal(false); // Close modal after success

      fetchTiffins();
    } catch (err) {
      setAddError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add tiffin service."
      );
    }
    setAdding(false);
  };

  // Start editing a tiffin - fill edit form with current values
  const startEdit = (tiffin) => {
    setEditingId(tiffin._id);
    setEditName(tiffin.name || "");
    setEditDescription(tiffin.description || "");
    setEditStartDate(tiffin.startDate ? tiffin.startDate.substring(0, 10) : "");
    setEditWeeklyMenu(tiffin.weeklyPlan || initialWeeklyMenu);
    setEditStatus(tiffin.status || "Pending");
    setEditError("");
    setEditSuccess("");
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
  };

  // Submit update
  const handleUpdateTiffin = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please login.");

      const updatedTiffin = {
        name: editName,
        description: editDescription,
        startDate: editStartDate,
        weeklyPlan: editWeeklyMenu,
        status: editStatus,
      };

      await axios.put(
        `http://localhost:5000/api/tiffins/updateTiffin/${editingId}`,
        updatedTiffin,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEditSuccess("Tiffin service updated successfully!");
      setEditingId(null);
      fetchTiffins();
    } catch (err) {
      setEditError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update tiffin service."
      );
    }
    setEditLoading(false);
  };

  // Delete tiffin service
  const handleDeleteTiffin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tiffin service?"))
      return;
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please login.");

      await axios.delete(
        `http://localhost:5000/api/tiffins/deleteTiffin/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchTiffins();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete tiffin service."
      );
    }
  };

  // Approve mess (only if not already approved)
  const handleApproveMess = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("No authentication token found. Please login.");

      await axios.put(
        `http://localhost:5000/api/tiffins/approveMess/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchTiffins();
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Failed to approve mess."
      );
    }
  };
  const capitalizeWords = (str) =>
    str
      ? str
          .toString()
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "";
  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-extrabold mb-10 text-center tracking-wide text-gray-900">
          My Tiffin Services
        </h1>

        {loading && (
          <p className="text-center text-lg text-gray-600 animate-pulse">
            Loading tiffin services...
          </p>
        )}
        {error && (
          <p className="text-center text-red-600 font-semibold mb-6">{`Error: ${error}`}</p>
        )}
        {!loading && !error && tiffins.length === 0 && (
          <p className="text-center text-gray-700 text-lg">
            No tiffin services found. You can add some!
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {tiffins.map((tiffin) => (
            <div
              key={tiffin._id}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-500 ease-in-out "
            >
              {editingId === tiffin._id ? (
                <form onSubmit={handleUpdateTiffin} className="space-y-5 ">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Tiffin Name"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />

                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />

                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    required
                  />

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Weekly Plan
                    </h3>
                    {Object.entries(editWeeklyMenu).map(([day, value]) => (
                      <div key={day}>
                        <label className="capitalize block mb-1">{day}</label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleEditMenuChange(day, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      </div>
                    ))}
                  </div>

                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {editError && <p className="text-red-500">{editError}</p>}
                  {editSuccess && (
                    <p className="text-green-600">{editSuccess}</p>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={editLoading}
                      className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      {editLoading ? "Updating..." : "Update"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-500 text-white px-5 py-2 rounded-lg font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900 tracking-tight">
                    {capitalizeWords(tiffin.name || "Untitled")}
                  </h2>

                  <p className="mb-3 text-gray-700 text-lg">
                    <strong className="capitalize">Description:</strong>{" "}
                    {capitalizeWords(tiffin.description || "No description")}
                  </p>

                  <p className="mb-3 text-gray-700 text-lg">
                    <strong className="capitalize">Start Date:</strong>{" "}
                    {tiffin.messStartDate
                      ? new Date(tiffin.messStartDate).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "N/A"}
                  </p>

                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3 tracking-wide text-gray-900 capitalize">
                      Weekly Menu
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 text-lg max-h-full overflow-visible">
                      {tiffin.weeklyPlan &&
                        Object.entries(tiffin.weeklyPlan).map(([day, meal]) => (
                          <li key={day} className="capitalize">
                            <span className="font-semibold capitalize">
                              {day}:
                            </span>{" "}
                            {capitalizeWords(meal || "No meal specified")}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <p className="mb-3 text-gray-700 text-lg">
                    <strong className="capitalize">Status:</strong>{" "}
                    {capitalizeWords(tiffin.status || "Pending")}
                  </p>

                  <p className="mb-6 text-lg">
                    <strong className="capitalize">
                      Mess Approval Status:
                    </strong>{" "}
                    {tiffin.messApproved ? (
                      <span className="inline-block px-4 py-1 bg-green-100 text-green-800 rounded-full font-semibold transition-colors duration-300">
                        Approved
                      </span>
                    ) : (
                      <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full font-semibold transition-colors duration-300">
                        Not Approved
                      </span>
                    )}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => startEdit(tiffin)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTiffin(tiffin._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
                    >
                      Delete
                    </button>
                    {!tiffin.messApproved && (
                      <button
                        onClick={() => handleApproveMess(tiffin._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-colors duration-300 shadow-md hover:shadow-lg"
                      >
                        Approve Mess
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Floating View Requests Button - 1st button (lower) */}
      {/* View Requests Button - higher up */}
      <button
        onClick={() => navigate("/tiffinRequests")}
        className="fixed bottom-24 right-8 bg-green-600 hover:bg-green-700 focus:bg-blue-800 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:scale-110 z-50"
        aria-label="View Tiffin Requests"
      >
        View Tiffin Requests
      </button>

      {/* Add Tiffin Service Button - lower */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 focus:scale-110 z-50"
        aria-label="Add Tiffin Service"
      >
        + Add Tiffin Service
      </button>

      {/* Modal Overlay */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm"
          onClick={() => setShowAddModal(false)}
          aria-modal="true"
          role="dialog"
        >
          {/* Modal content container */}
          <div
            className="bg-white/90 rounded-lg shadow-xl p-8 w-[900px] h-[600px] overflow-y-auto transform transition-all duration-700 ease-in-out opacity-100 scale-100 max-w-full max-h-full"
            onClick={(e) =>
              e.stopPropagation()
            } /* Prevent modal close when clicking inside */
            style={{ minWidth: "400px" }}
          >
            <h2 className="text-3xl font-extrabold mb-6 text-gray-800">
              Add New Tiffin Service
            </h2>

            {addError && (
              <p className="text-red-600 mb-4 font-medium">{addError}</p>
            )}
            {addSuccess && (
              <p className="text-green-600 mb-4 font-medium">{addSuccess}</p>
            )}

            <form onSubmit={handleAddTiffin} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Tiffin Service Name"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={1}
                  placeholder="Describe your tiffin service"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-semibold" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3} // Makes it 3 rows tall
                  className="w-full border rounded px-3 py-2 resize-none"
                  placeholder="Enter address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Start Date
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-gray-700">
                  Weekly Menu
                </h3>
                {Object.entries(weeklyMenu).map(([day, meal]) => (
                  <div key={day} className="mb-3 flex items-center space-x-3">
                    <label
                      htmlFor={`menu-${day}`}
                      className="font-medium w-20 text-gray-600"
                    >
                      {day}:
                    </label>
                    <input
                      id={`menu-${day}`}
                      type="text"
                      value={meal}
                      onChange={(e) => handleMenuChange(day, e.target.value)}
                      placeholder={`Meal for ${day}`}
                      className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                ))}
              </div>
              {/* Add Price input field here */}
              <div>
                <label
                  htmlFor="price"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Price (₹)
                </label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block font-semibold mb-2 text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  <option value="Pending">Pending</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={adding}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-transform duration-150 ease-in-out active:scale-95 flex-1"
                >
                  {adding ? "Adding..." : "Add Tiffin Service"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-transform duration-150 ease-in-out active:scale-95 flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TiffinService;
