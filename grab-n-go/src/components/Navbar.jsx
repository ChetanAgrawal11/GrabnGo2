import React, { useEffect, useState } from "react";
import avatar from "../Images/avatar.webp";
import g from "../Images/g.png";
import axios from "axios";

const Navbar = () => {
  const [user, setUser] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingReport, setLoadingReport] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Invalid user data in localStorage");
      }
    }
  }, []);

  const generateReport = async () => {
    setLoadingReport(true);
    try {
      const res = await axios.get("http://localhost:5000/api/orders/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
      setShowReport(true);
    } catch (err) {
      console.error("Failed to generate report:", err);
      alert("Error generating report.");
    } finally {
      setLoadingReport(false);
    }
  };

  return (
    <>
      <div className="p-4">
        <div className="Navbar flex flex-row items-center justify-between w-full p-3 bg-white rounded-lg shadow-md">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={g} alt="logo" className="rounded-full h-[24px]" />
          </div>

          {/* Profile Info and Report Button */}
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt="profile"
                className="rounded-full h-[32px]"
              />
              <div className="text-sm text-black">
                <p className="font-bold">{user.fullName || "Guest"}</p>
                <p className="text-gray-600 text-xs">
                  {user.email || "No Email"}
                </p>
              </div>
            </div>

            <button
              onClick={generateReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-semibold shadow-md transition transform hover:scale-110"
            >
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white max-h-[90vh] overflow-y-auto w-[90%] md:w-[70%] lg:w-[60%] rounded-2xl shadow-lg p-8 relative">
            <button
              onClick={() => setShowReport(false)}
              aria-label="Close report"
              className="absolute top-4 right-6 text-gray-500 hover:text-red-500 text-3xl font-bold leading-none"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center">
              📊 Order Report
            </h2>

            {loadingReport ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-gray-100 rounded-xl p-4 shadow-md"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-sm text-gray-500">Order ID:</p>
                        <p className="font-semibold break-all">{order._id}</p>
                      </div>
                      <div>
                        <span
                          className={`text-sm font-bold px-4 py-1 rounded-full ${
                            order.status === "Pending"
                              ? "bg-orange-200 text-orange-800"
                              : order.status === "Preparing"
                              ? "bg-yellow-200 text-yellow-900"
                              : order.status === "Ready"
                              ? "bg-green-200 text-green-800"
                              : order.status === "Delivered"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-gray-300 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      <p>
                        Placed on:{" "}
                        <span className="font-medium">
                          {new Date(order.createdAt).toLocaleString("en-IN")}
                        </span>
                      </p>
                      <p>
                        Total Amount:{" "}
                        <span className="font-semibold text-green-600">
                          {order.totalAmount.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </span>
                      </p>
                      <p className="mt-2 font-semibold">Items:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} × {item.quantity} —{" "}
                            {(item.price * item.quantity).toLocaleString(
                              "en-IN",
                              {
                                style: "currency",
                                currency: "INR",
                              }
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
