import React, { useState, useEffect } from "react";
import foodImage from "../Images/g4.png";

const Menu2 = ({ selectedCategory, menu, onAdd, onRemove }) => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (menu && selectedCategory && Array.isArray(menu[selectedCategory])) {
      const defaultQuantities = menu[selectedCategory].reduce(
        (acc, item) => ({ ...acc, [item.name]: 0 }),
        {}
      );
      setQuantities(defaultQuantities);
    }
  }, [selectedCategory, menu]);

  const handleAdd = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item.name]: (prev[item.name] || 0) + 1,
    }));
    onAdd(item); // Notify parent to update cart
  };

  const handleRemove = (item) => {
    if ((quantities[item.name] || 0) > 0) {
      setQuantities((prev) => ({
        ...prev,
        [item.name]: prev[item.name] - 1,
      }));
      onRemove(item.name); // Notify parent to remove item
    }
  };

  if (!menu || !selectedCategory || !menu[selectedCategory]) return null;

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg">
      {menu[selectedCategory].map((item, index) => (
        <div
          key={item._id || `${item.name}-${index}`} // Ensure a unique key
          className="w-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 
                     rounded-lg p-4 flex justify-between items-center 
                     animate-fadeIn transform hover:scale-105"
        >
          <div>
            <p className="font-bold text-black text-2xl">{item.name}</p>
            <p className="text-gray-500 text-sm">{item.description}</p>
            <p className="text-green-600 font-semibold">₹{item.price}</p>
            <div className="flex items-center mt-2">
              <button
                className="bg-red-500 text-white rounded-full w-7 h-7 flex justify-center items-center mr-2"
                onClick={() => handleRemove(item)}
              >
                -
              </button>
              <span className="mx-2 font-semibold">
                {quantities[item.name] || 0}
              </span>
              <button
                className="bg-green-500 text-white rounded-full w-7 h-7 flex justify-center items-center"
                onClick={() => handleAdd(item)}
              >
                +
              </button>
            </div>
          </div>
          <img
            src={foodImage}
            alt={item.name}
            className="w-20 h-20 rounded-full object-cover 
                       transition-transform duration-300 hover:rotate-6"
          />
        </div>
      ))}
    </div>
  );
};

export default Menu2;
