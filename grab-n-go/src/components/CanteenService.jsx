import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CanteenService = () => {
  const [canteen, setCanteen] = useState(null);
  const [formData, setFormData] = useState({
    canteenName: "",
    canteenAddress: "",
    collegeName: "",
    licenseImage: null,
    canteenPhoto: null,
    aadharCardNumber: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchMyCanteen = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/canteens/my",
        config
      );
      setCanteen(res.data);
    } catch (error) {
      console.log("No canteen found:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMyCanteen();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const prepareFormData = () => {
    const data = new FormData();
    data.append("canteenName", formData.canteenName);
    data.append("canteenAddress", formData.canteenAddress);
    data.append("collegeName", formData.collegeName);
    data.append("aadharCardNumber", formData.aadharCardNumber);
    if (formData.licenseImage)
      data.append("licenseImage", formData.licenseImage);
    if (formData.canteenPhoto)
      data.append("canteenPhoto", formData.canteenPhoto);
    data.append("ownerName", user.fullName);
    data.append("ownerEmail", user.email);
    data.append("ownerPhone", user.number);
    return data;
  };

  const handleCreate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/canteens",
        prepareFormData(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Canteen created successfully");
      setCanteen(res.data);
      navigate(`/owner/canteen/${res.data._id}`);
    } catch (error) {
      alert("Error creating canteen");
      console.error(error.response?.data || error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/canteens/${canteen._id}`,
        prepareFormData(),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Canteen updated");
      setCanteen(res.data);
      navigate(`/owner/canteen/${canteen._id}`);
    } catch (error) {
      alert("Error updating canteen");
      console.error(error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/canteens/${canteen._id}`,
        config
      );
      alert("Canteen deleted");
      setCanteen(null);
      setFormData({
        canteenName: "",
        canteenAddress: "",
        collegeName: "",
        licenseImage: null,
        canteenPhoto: null,
        aadharCardNumber: "",
      });
    } catch (error) {
      alert("Error deleting canteen");
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl mt-10">
      <h2 className="text-3xl font-extrabold mb-8 text-center text-blue-800">
        {canteen ? "Update Your Canteen" : "Create Your Canteen"}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          canteen ? handleUpdate() : handleCreate();
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        encType="multipart/form-data"
      >
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Canteen Name:
          </label>
          <input
            type="text"
            name="canteenName"
            value={formData.canteenName}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Canteen Address:
          </label>
          <input
            type="text"
            name="canteenAddress"
            value={formData.canteenAddress}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            College Name:
          </label>
          <input
            type="text"
            name="collegeName"
            value={formData.collegeName}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Aadhar Card Number:
          </label>
          <input
            type="text"
            name="aadharCardNumber"
            value={formData.aadharCardNumber}
            onChange={handleChange}
            required
            className="block w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Upload License Image:
          </label>
          <input
            type="file"
            name="licenseImage"
            accept="image/*"
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Upload Canteen Photo:
          </label>
          <input
            type="file"
            name="canteenPhoto"
            accept="image/*"
            onChange={handleChange}
            className="block w-full border border-gray-300 rounded-lg px-4 py-2 bg-white"
          />
        </div>

        <div className="col-span-1 md:col-span-2 flex flex-wrap justify-center gap-4 mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full"
          >
            {canteen ? "Update" : "Create"}
          </button>

          {canteen && (
            <>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() =>
                  user?._id
                    ? navigate(`/owner/canteen/${user._id}`)
                    : alert("User ID not found")
                }
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </form>

      {canteen && (
        <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800">
            My Canteen Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            {[
              { key: "canteenName", label: "Canteen Name" },
              { key: "canteenAddress", label: "Canteen Address" },
              { key: "collegeName", label: "College Name" },
              { key: "ownerName", label: "Owner Name" },
              { key: "ownerPhone", label: "Owner Phone No" },
              { key: "aadharCardNumber", label: "Aadhar Card Number" },
            ].map(({ key, label }) => (
              <div
                key={key}
                className="bg-blue-50 p-4 rounded-lg shadow-inner border"
              >
                <p className="font-semibold text-blue-700">{label}</p>
                <p className="text-sm mt-1 break-words">{canteen[key]}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* See Orders Button fixed at bottom right */}
      {canteen && (
        <button
          onClick={() => navigate(`/owner/canteen/${canteen._id}/orders`)}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:scale-110"
          title="See Orders"
          aria-label="See Orders"
        >
          See Orders
        </button>
      )}
    </div>
  );
};

export default CanteenService;
