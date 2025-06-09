import React, { useState } from "react";
import canteenImage from "../../Images/canteen.png"; // Use the correct path

const Page = () => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 150); // Scale back quickly
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div
        className=" relative bg-cover bg-center h-[600px] w-[1200px] mt-12 rounded-lg"
        style={{
          backgroundImage: `url(${canteenImage})`,
        }}
      >
        {/* Background dim layer */}
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-0 "></div>

        {/* Foreground card */}
        <div
          onClick={handleClick}
          className={`relative z-10 flex rounded-3xl overflow-hidden  mt-24 max-w-6xl w-[1000px] h-[400px] m-12 transition-transform duration-200 ${
            clicked ? "scale-95" : "hover:scale-105"
          }`}
          // style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
        >
          {/* Left content */}
          <div className="flex-1 px-10 py-12 flex flex-col justify-center relative">
            <p className="text-gray-700 mb-2 text-base font-medium">
              Mouth watering dishes served here!!
            </p>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              Nashikar Canteen
            </h1>
            <div className="bg-black text-white text-lg font-semibold px-6 py-3 rounded-full w-max mb-8 shadow-md">
              Minimum Order: 12 GBP
            </div>

            {/* Open status */}
            <div className="absolute bottom-5 left-5 bg-red-500 text-white font-bold px-6 py-3 rounded-xl shadow-xl">
              Open until 3:00
            </div>
          </div>

          {/* Right image area */}
          <div className="w-1/2 relative flex items-center justify-center">
            <img src={canteenImage} alt="Canteen" className="w-full h-full " />

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
  );
};

export default Page;