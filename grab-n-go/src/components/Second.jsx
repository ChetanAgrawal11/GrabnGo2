import { useNavigate } from "react-router-dom";
import g9 from "../Images/g9.png";
import g10 from "../Images/g10.png";

export default function Second() {
  const navigate = useNavigate(); // React Router navigation hook

  const categories = [
    { title: "Lunch Box Service", img: g9, path: "/alltiffin" }, // 👈 Updated path
    { title: "College Canteens", img: g10, path: "/canteens" },
    { title: "Best Mess", img: g9, path: "/all-restaurants" },
  ];

  return (
    <div className="mt-8 flex justify-center gap-12 flex-wrap">
      {categories.map((item, index) => (
        <div
          key={index}
          className="relative w-[300px] rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition"
          onClick={() => item.path !== "#" && navigate(item.path)} // Navigate on click
        >
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-md">
            <h3 className="text-xl font-bold text-white">{item.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
