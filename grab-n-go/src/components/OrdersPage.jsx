import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const OrdersPage = () => {
  const { canteenId } = useParams();
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/orders/${canteenId}`,
          config
        );
        setOrders(res.data);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [canteenId]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus },
        config
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...res.data, user: order.user } // preserve user info
            : order
        )
      );
    } catch (error) {
      alert("Failed to update order status");
      console.error(error.response?.data || error.message);
    }
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 text-lg mt-10">
        Loading orders...
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700">
        Orders for Canteen
      </h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No orders found.
        </p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 p-6 rounded-lg mb-6 shadow hover:shadow-lg transition-shadow"
          >
            {/* Status badge on top */}
            <div className="mb-4">
              <span
                className={`text-lg font-bold px-6 py-2 rounded-xl inline-block ${
                  order.status === "Pending"
                    ? "bg-orange-100 text-orange-800"
                    : order.status === "Preparing"
                    ? "bg-yellow-100 text-yellow-900"
                    : order.status === "Ready"
                    ? "bg-green-100 text-green-800"
                    : order.status === "Delivered"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-700"
                } shadow-md`}
              >
                {order.status === "Pending"
                  ? "🟠 Payment done, preparing..."
                  : order.status === "Preparing"
                  ? "🟡 Preparing your order"
                  : order.status === "Ready"
                  ? "✅ Ready for pickup/delivery"
                  : order.status === "Delivered"
                  ? "📦 Delivered"
                  : order.status}
              </span>
            </div>

            <p className="mb-2">
              <strong>Order ID:</strong> {order._id}
            </p>
            <p className="mb-2">
              <strong>User:</strong>{" "}
              {order.user?.fullName || order.user?.name || "Unknown User"} (
              {order.user?.email || "No email"})
            </p>

            <p className="mb-2">
              <strong>Items:</strong>
            </p>
            <ul className="list-disc list-inside mb-4">
              {order.items.map(({ name, quantity }, idx) => (
                <li key={idx}>
                  {name} x {quantity}
                </li>
              ))}
            </ul>

            <div className="mt-4 space-x-3">
              {order.status === "Delivered" ? (
                <p className="text-lg font-semibold text-blue-700">
                  ✅ Order has been delivered
                </p>
              ) : (
                // Show buttons in this order: Preparing, Ready, Delivered
                ["Preparing", "Ready", "Delivered"].map((statusOption) => {
                  const disabled = order.status === statusOption;

                  return (
                    <button
                      key={statusOption}
                      onClick={() =>
                        handleStatusUpdate(order._id, statusOption)
                      }
                      className={`px-4 py-2 rounded-full text-white font-semibold transition ${
                        disabled
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700"
                      }`}
                      disabled={disabled}
                    >
                      Mark as {statusOption}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
