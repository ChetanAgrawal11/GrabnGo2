import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signupImage from "../Images/signup.png";

export default function Signup() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState(""); // Added phone state
  const [address, setAddress] = useState(""); // Added address state
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format!");
      setShowErrorPopup(true);
      triggerShake();
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must have at least 1 uppercase letter, 1 number, and 1 special character, and be at least 8 characters long."
      );
      setShowErrorPopup(true);
      triggerShake();
      return;
    }

    if (!name.trim()) {
      setErrorMessage("Name is required!");
      setShowErrorPopup(true);
      triggerShake();
      return;
    }

    if (!number.trim()) {
      // Validate phone number
      setErrorMessage("Phone Number is required!");
      setShowErrorPopup(true);
      triggerShake();
      return;
    }

    if (!address.trim()) {
      // Validate address
      setErrorMessage("Address is required!");
      setShowErrorPopup(true);
      triggerShake();
      return;
    }

    if (!role) {
      setErrorMessage("Please select a role!");
      setShowErrorPopup(true);
      triggerShake();
      return;
    }

    setErrorMessage("");
    setShowErrorPopup(false);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          role,
          number,
          address,
        }),
      });

      const data = await response.json();

      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (response.status === 201) {
        alert("Signup successful! 🚀");
        navigate("/");
      } else {
        setErrorMessage(data.error || data.message || "Signup failed");
        setShowErrorPopup(true);
        triggerShake();
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrorMessage("Something went wrong. Please try again.");
      setShowErrorPopup(true);
      triggerShake();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-3/4 max-w-4xl flex ">
        {/* Left Side - Form */}
        <div className="w-1/2 p-10">
          <h1 className="text-2xl font-bold text-gray-800">Grab N’ Go</h1>
          <h2 className="text-xl font-semibold text-gray-700 mt-2">
            Get Started Now
          </h2>

          <form onSubmit={handleSubmit} className="mt-2">
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div className="mt-2">
              <label className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-1 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  shake ? "animate-shake border-red-500" : ""
                }`}
                required
              />
            </div>

            <div className="mt-2">
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-1 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  shake ? "animate-shake border-red-500" : ""
                }`}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="mt-2">
              <label className="block text-gray-700 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter Your Phone Number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full px-4 py-1 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Address */}
            <div className="mt-2">
              <label className="block text-gray-700 font-medium">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Your Address"
                rows="2"
                className="w-full px-4 py-1 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              ></textarea>
            </div>

            {/* Role Selection */}
            <div className="mt-2">
              <label className="block text-gray-700 font-medium">
                Please select a valid role to Signup
              </label>
              <div className="flex items-center space-x-4 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    checked={role === "owner"}
                    onChange={() => setRole("owner")}
                    className="text-red-500 focus:ring-red-500"
                    required
                  />
                  <span className="text-gray-700">Owner</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={() => setRole("student")}
                    className="text-red-500 focus:ring-red-500"
                    required
                  />
                  <span className="text-gray-700">Student</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-red-500 text-white py-2 rounded-md text-lg font-semibold hover:bg-red-600 transition"
            >
              Sign Up
            </button>

            <div className="flex items-center my-2">
              <hr className="flex-grow border-gray-300" />
              <span className="px-2 text-gray-500 text-sm">
                Or Sign in with
              </span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <div className="flex justify-center">
              <div className="w-1/2">
                {" "}
                {/* Container half width */}
                <button
                  type="button"
                  className="flex items-center justify-center w-full border px-4 py-2 bg-gray-200 rounded-md transition ease-in-out hover:bg-red-400 hover:font-semibold"
                  onClick={() => navigate("/")}
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 hidden md:block">
          <img
            src={signupImage}
            alt="Signup"
            className="w-full h-full object-cover rounded-l-3xl"
          />
        </div>
      </div>

      {/* Error Popup */}
      {showErrorPopup && (
        <div className="fixed top-10 right-10 bg-red-500 text-white p-4 rounded-lg shadow-lg animate-fadeIn z-50">
          <p>{errorMessage}</p>
          <button
            onClick={() => setShowErrorPopup(false)}
            className="mt-2 bg-white text-red-500 px-2 py-1 rounded-md"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
