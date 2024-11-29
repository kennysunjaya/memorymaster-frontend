import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const body = { email, password };

      const { data } = await axios.post("http://localhost:3000/login", body);

      localStorage.setItem("access_token", data.access_token);

      Toastify({
        text: "Login Successful",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#34D399",
          color: "#FEF2BF",
          border: "3px solid #000000",
          borderRadius: "10px",
          boxShadow: "4px 4px #000000",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "14px",
          padding: "10px 15px",
          textAlign: "center",
        },
      }).showToast();

      navigate("/");
    } catch (error) {
      Toastify({
        text: `${error.response.data.message}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#FF0000",
          color: "#FEF2BF",
          border: "3px solid #000000",
          borderRadius: "10px",
          boxShadow: "4px 4px #000000",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "14px",
          padding: "10px 15px",
          textAlign: "center",
        },
      }).showToast();
    }
  }

  async function googleLogin(credentialResponse) {
    try {
      console.log(credentialResponse);
      const { credential } = credentialResponse;

      const { data } = await axios.post(
        "http://localhost:3000/google-login",
        {},
        {
          headers: {
            token: credential,
          },
        }
      );

      localStorage.setItem("access_token", data.access_token);

      Toastify({
        text: "Login Successful",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#34D399",
          color: "#FEF2BF",
          border: "3px solid #000000",
          borderRadius: "10px",
          boxShadow: "4px 4px #000000",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "14px",
          padding: "10px 15px",
          textAlign: "center",
        },
      }).showToast();

      navigate("/");
    } catch (error) {
      console.log(error);
      Toastify({
        text: `${error.response.data.message}`,
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "#FF0000",
          color: "#FEF2BF",
          border: "3px solid #000000",
          borderRadius: "10px",
          boxShadow: "4px 4px #000000",
          fontFamily: "'Press Start 2P', cursive",
          fontSize: "14px",
          padding: "10px 15px",
          textAlign: "center",
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
            Login
          </h1>
          {/* Login Form */}
          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input type="text" id="email" name="email" className="w-full px-3 py-2 bg-[#011f3f] border-2 border-black rounded-lg text-[#fef2bf] focus:outline-none focus:ring focus:ring-blue-400" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm mb-2">
                Password
              </label>
              <input type="password" id="password" name="password" className="w-full px-3 py-2 bg-[#011f3f] border-2 border-black rounded-lg text-[#fef2bf] focus:outline-none focus:ring focus:ring-blue-400" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {/* Login Button */}
            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-200">
              Login
            </button>
          </form>
          {/* Footer */}
          <p className="text-center text-xs mt-4">
            Don't have an account?
            <Link to={"/register"} className="text-yellow-400 underline hover:text-yellow-300">
              Sign Up
            </Link>
          </p>
          {/* Divider */}
          <div className="divider px-10 my-4">OR</div>
          {/* Google Login */}
          <div className="flex justify-center items-center">
            <GoogleLogin
              onSuccess={googleLogin}
              onError={() => {
                Toastify({
                  text: "Google Sign-In Failed",
                  duration: 3000,
                  close: true,
                  gravity: "bottom",
                  position: "right",
                  style: {
                    background: "#FF0000",
                    color: "#FEF2BF",
                    border: "3px solid #000000",
                    borderRadius: "10px",
                    boxShadow: "4px 4px #000000",
                    fontFamily: "'Press Start 2P', cursive",
                    fontSize: "14px",
                    padding: "10px 15px",
                    textAlign: "center",
                  },
                }).showToast();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
