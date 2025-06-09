import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Footer from "../Footer";
import Navbar from "../Navbar";
import Menu from "../Menu";
import Menu2 from "../Menu2";
import Menu3 from "../Menu3";
import canteenImage from "../../Images/g7.png"; // Replace with actual canteen image path

const CanteenPage = () => {
  const { canteenId } = useParams();
  const [canteen, setCanteen] = useState(null);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [clicked, setClicked] = useState(false);

  // User orders states
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // Fetch canteen details and menu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // No auth needed for canteen details
        const canteenRes = await axios.get(
          `http://localhost:5000/api/canteens/${canteenId}`
        );
        setCanteen(canteenRes.data);

        // Auth needed for menu
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view the menu.");
          setMenu(null);
          return;
        }

        const menuRes = await axios.get(
          `http://localhost:5000/api/canteen-menus/${canteenId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMenu(menuRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canteenId]);

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setLoadingOrders(true);
      setOrdersError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setOrdersError("You must be logged in to view your orders.");
        setUserOrders([]);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/orders/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserOrders(res.data);
    } catch (err) {
      console.error("Error fetching user orders:", err);
      setOrdersError("Failed to load your orders.");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUserOrders();
  }, []);

  if (loading)
    return <div className="p-8 text-xl font-bold text-center">Loading...</div>;
  if (error)
    return (
      <div className="p-8 text-red-600 font-bold text-center">{error}</div>
    );

  // Add to cart
  const handleAddToCart = (item) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((i) => i.name === item.name);
      if (existingItem) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  // Remove/decrease quantity from cart
  const handleRemoveFromCart = (itemName) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item.name === itemName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 150);
  };

  return (
    <div className="gap-5 bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <div className="w-full flex justify-center items-center">
          <div
            className="relative bg-cover bg-center h-[600px] w-[1200px] mt-12 rounded-lg"
            style={{
              backgroundImage: `url(${canteenImage})`,
            }}
          >
            {/* Background dim layer */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0 "></div>

            {/* Foreground card */}
            <div
              onClick={handleClick}
              className={`relative z-10 flex rounded-3xl overflow-hidden mt-24 max-w-6xl w-[1000px] h-[400px] m-12 transition-transform duration-200 ${
                clicked ? "scale-95" : "hover:scale-105"
              }`}
            >
              {/* Left content */}
              <div className="flex-1 px-10 py-12 flex flex-col justify-center relative">
                <p className="text-gray-700 mb-2 text-base font-medium">
                  Mouth watering dishes served here!!
                </p>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                  {canteen.canteenName}
                </h1>
                <div className="bg-black text-white text-lg font-semibold px-6 py-3 rounded-full w-max mb-8 shadow-md">
                  Contact no: {canteen.ownerPhone}
                </div>

                {/* Open status */}
              </div>

              {/* Right image area */}
              <div className="w-1/2 relative flex items-center justify-center">
                <img
                  src={canteenImage}
                  alt="Canteen"
                  className="w-full h-full object-cover"
                />

                {/* Rating overlay */}
                <div className="absolute bottom-6 left-6 bg-white px-6 py-4 rounded-xl shadow-xl text-center">
                  <p className="text-4xl font-bold text-gray-800">3.4</p>
                  <div className="flex justify-center text-yellow-500 text-xl mb-1">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span className="text-gray-300">☆</span>
                  </div>
                  <p className="text-sm text-gray-500">1,360 reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu and Cart Section */}
        <div className="gap-5 bg-white">
          <div className="flex justify-center w-full">
            <div className="menu-section flex justify-between gap-2 p-4 max-w-[80%] w-full">
              <div className="menu1 text-white p-4 basis-[20%] rounded-lg h-auto flex flex-col">
                <Menu
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  menu={menu}
                />
              </div>

              <div className="menu2 text-white p-4 basis-[40%]">
                <Menu2
                  selectedCategory={selectedCategory}
                  menu={menu}
                  onAdd={handleAddToCart}
                  onRemove={handleRemoveFromCart}
                />
              </div>

              <div className="menu3 bg-gray-100 text-black p-4 basis-[20%] rounded-lg">
                <Menu3
                  basketItems={cartItems}
                  canteenId={canteenId}
                  token={localStorage.getItem("token")}
                  onOrderPlaced={() => {
                    setCartItems([]); // clear cart on success
                    fetchUserOrders(); // refresh orders after placing
                  }}
                />
              </div>
            </div>
          </div>

          {/* User Orders Section */}
          <div className="max-w-4xl mx-auto my-6 p-4 border rounded shadow bg-white">
            <h2 className="text-2xl font-bold mb-4">My Orders</h2>
            {loadingOrders ? (
              <p>Loading your orders...</p>
            ) : ordersError ? (
              <p className="text-red-600">{ordersError}</p>
            ) : userOrders.length === 0 ? (
              <p>You have no orders yet.</p>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl border shadow-md p-6 space-y-4 transition-transform hover:scale-[1.01]"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Order ID:</p>
                        <h3 className="text-md font-semibold tracking-wide text-gray-800">
                          {order._id}
                        </h3>
                      </div>

                      {/* Order Status Pill */}
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
                    </div>

                    {/* Ordered Items */}
                    <div className="bg-gray-50 rounded-xl px-4 py-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Items Ordered:
                      </p>
                      <ul className="space-y-1 text-sm text-gray-800">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              ₹{item.price * item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Order Total */}
                    <div className="flex justify-between items-center">
                      <p className="text-gray-600 text-sm">
                        Placed on{" "}
                        <span className="font-medium text-gray-800">
                          {new Date(order.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </p>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total:</p>
                        <p className="text-xl font-bold text-green-700">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CanteenPage;
