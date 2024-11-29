import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSignUp(e) {
    e.preventDefault();
    try {
      const body = { username, email, password };
      const { data } = await axios.post("http://memorymaster.site/register", body);
      navigate("/login");

      Toastify({
        text: "Successfully Registered",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#34D399", // Vibrant green for success
          color: "#FEF2BF", // Light yellow text
          border: "3px solid #000000", // Thick black border
          borderRadius: "10px", // Rounded corners
          boxShadow: "4px 4px #000000", // Retro shadow effect
          fontFamily: "'Press Start 2P', cursive", // Retro font
          fontSize: "14px", // Consistent font size
          padding: "10px 15px", // Add padding for spacing
          textAlign: "center", // Center the text
        },
      }).showToast();
    } catch (error) {
      Toastify({
        text: `${error.response.data.message}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#FF0000", // Bright red for errors
          color: "#FEF2BF", // Light yellow text
          border: "3px solid #000000", // Thick black border
          borderRadius: "10px", // Rounded corners
          boxShadow: "4px 4px #000000", // Retro shadow effect
          fontFamily: "'Press Start 2P', cursive", // Retro font
          fontSize: "14px", // Consistent font size
          padding: "10px 15px", // Add padding for spacing
          textAlign: "center", // Center the text
        },
      }).showToast();
    }
  }

  return (
    <>
      <div id="loginbody" className="h-screen flex items-center justify-center">
        <div className="w-full max-w-sm bg-[#011f3f] border-4 border-black rounded-lg p-6 text-[#fef2bf] shadow-md">
          {/* Title */}
          <h1 id="loginh1" className="text-center text-2xl mb-6">
            Sign Up
          </h1>
          {/* Sign-Up Form */}
          <form onSubmit={handleSignUp}>
            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-3 py-2 bg-[#011f3f] border-2 border-black rounded-lg text-[#fef2bf] focus:outline-none focus:ring focus:ring-blue-400"
                placeholder="Enter your username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 bg-[#011f3f] border-2 border-black rounded-lg text-[#fef2bf] focus:outline-none focus:ring focus:ring-blue-400"
                placeholder="Enter your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-3 py-2 bg-[#011f3f] border-2 border-black rounded-lg text-[#fef2bf] focus:outline-none focus:ring focus:ring-blue-400"
                placeholder="Create a password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            {/* Sign-Up Button */}
            <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
              Sign Up
            </button>
          </form>
          {/* Footer */}
          <p className="text-center text-xs mt-4">
            Already have an account?
            <Link to={"/login"} className="text-yellow-400 underline hover:text-yellow-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
