import React, { useEffect, useState } from "react";
import g3 from "../Images/g3.png";

const Menu = ({ selectedCategory, setSelectedCategory, menu }) => {
  const categories = Object.keys(menu || {}).filter(
    (key) => Array.isArray(menu[key]) && menu[key].length > 0
  );

  return (
    <div className="w-full bg-gray-100 rounded-2xl shadow-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <img src={g3} alt="" className="rounded-full h-[40px]" />
        <h1 className="text-2xl font-semibold text-black">Menu</h1>
      </div>
      <ul className="space-y-1">
        {categories.map((category) => (
          <li
            key={category}
            className={`px-4 py-3 rounded-lg font-semibold text-lg cursor-pointer transition ease-in-out duration-300 hover:scale-110 ${
              selectedCategory === category
                ? "bg-black text-white"
                : "text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
