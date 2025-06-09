import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

export default function AllRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/restaurants");
        setRestaurants(res.data.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 overflow-hidden py-10 px-4">
      {/* Animated Background Balls */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          rotate: [0, 360, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-tr from-purple-500 to-indigo-700 rounded-full shadow-[inset_10px_10px_30px_rgba(255,255,255,0.6),inset_-10px_-10px_30px_rgba(0,0,0,0.4)]"
      />
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
          rotate: [0, -360, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-60 right-10 w-48 h-48 bg-gradient-to-tr from-pink-400 to-red-600 rounded-full shadow-[inset_10px_10px_25px_rgba(255,255,255,0.7),inset_-10px_-10px_25px_rgba(0,0,0,0.5)]"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -40, 0],
          scale: [1, 1.15, 1],
          rotate: [0, 360, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-1/2 w-36 h-36 bg-gradient-to-tr from-blue-400 to-cyan-600 rounded-full shadow-[inset_10px_10px_25px_rgba(255,255,255,0.8),inset_-10px_-10px_25px_rgba(0,0,0,0.4)]"
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-indigo-900 mb-12">
          All Restaurants
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {restaurants.map((rest, index) => (
            <motion.div
              key={rest._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {/* Restaurant Image */}
              {rest.image ? (
                <img
                  src={`http://localhost:5000${rest.image}`}
                  alt={rest.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">
                {rest.name}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Address:</span> {rest.address}
              </p>
              {rest.location && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Location:</span> {rest.location}
                </p>
              )}
              {rest.contactNumber && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Contact:</span>{" "}
                  {rest.contactNumber}
                </p>
              )}
              {rest.owner && rest.owner.name && (
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Owner:</span> {rest.owner.name}
                </p>
              )}
              {rest.openingHours && (
                <div className="text-gray-600 mb-2">
                  <p className="font-medium">Opening Hours:</p>
                  <ul className="list-disc list-inside">
                    {Object.entries(rest.openingHours).map(([day, time]) => (
                      <li key={day}>
                        <span className="capitalize">{day}:</span> {time}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {rest.menu?.length > 0 && (
                <div className="text-gray-600">
                  <p className="font-medium mb-1">Menus:</p>
                  <ul className="list-disc list-inside">
                    {rest.menu.map((menuItem, idx) => (
                      <motion.li
                        key={menuItem._id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="mb-1"
                      >
                        {menuItem.name} - ₹{menuItem.price}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
