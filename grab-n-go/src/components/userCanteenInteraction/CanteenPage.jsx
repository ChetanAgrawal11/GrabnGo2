import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import g2 from "../../Images/g2.png";

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

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch canteen details (no auth needed)
        const canteenRes = await axios.get(`http://localhost:5000/api/canteens/${canteenId}`);
        setCanteen(canteenRes.data);

        // 2. Fetch menu (auth required)
        const menuRes = await axios.get(`http://localhost:5000/api/canteen-menus/${canteenId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMenu(menuRes.data);
      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [canteenId, token]);

  if (loading) return <div className="p-8 text-xl font-bold">Loading...</div>;
  if (error) return <div className="p-8 text-red-600 font-bold">{error}</div>;

  // Add this function to handle adding items to cart
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

  // Optional: decrease quantity
  const handleRemoveFromCart = (itemName) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item.name === itemName ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  
  
    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 150); // Scale back quickly
    };
  

  return (
    <div className="gap-5 bg-white">
      <Navbar />


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
                    {canteen.canteenName}
                  </h1>
                  <div className="bg-black text-white text-lg font-semibold px-6 py-3 rounded-full w-max mb-8 shadow-md">
                    Contact no: {canteen.ownerPhone}
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

      

      {/* Canteen Info */}
      {/* <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800">{canteen.canteenName}</h1>
        <p className="text-gray-600 mt-2">{canteen.canteenAddress}</p>
        <p className="text-gray-600">College: {canteen.collegeName}</p>
        <p className="text-gray-600">Owner: {canteen.ownerName}</p>
        <p className="text-gray-600">Contact: {canteen.ownerPhone}</p>
        <p className="text-gray-600">Email: {canteen.ownerEmail}</p>
      </div> */}


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

              <div className="menu3 bg-gray-100 text-white p-4 basis-[20%] rounded-lg">
                <Menu3 basketItems={cartItems} />
              </div>
            </div>
          </div>

          <div>
            <Footer />
          </div>
        </div>
      </div>


   
  );
};

export default CanteenPage;
