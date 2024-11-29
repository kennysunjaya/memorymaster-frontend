import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Toastify from "toastify-js";

export default function ProfilePage() {
  const [username, setUserName] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const form = new FormData();

      form.append("file", imgFile);
      form.append("username", username);
      console.log(imgFile, username);

      const { data } = await axios.put("https://memorymaster.site/users", form, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      navigate("/");
      Toastify({
        text: "Edit profile successful",
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
    } catch (error) {
      console.log(error);
      Toastify({
        text: "Update Failed",
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

  async function fetchUser() {
    try {
      const { data } = await axios.get("https://memorymaster.site/user", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center mt-20">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-96">
        {/* Profile Image */}
        <div className="flex justify-center mb-6 relative">
          <img className="h-24 w-24 rounded-full border-4 border-yellow-400 cursor-pointer" src={user.imgUrl} alt="Profile Picture" onClick={() => document.getElementById("fileInput").click()} />
          <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={(e) => setImgFile(e.target.files[0])} />
        </div>
        {/* Edit Form */}
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-yellow-300 font-bold mb-2">
              Username
            </label>
            <input id="username" type="text" value={username} onChange={(e) => setUserName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-yellow-300 focus:outline-none" />
          </div>
          {/* Save Button */}
          <div className="flex justify-center mt-6">
            <button type="submit" className="bg-yellow-400 text-black font-bold py-2 px-4 rounded-lg shadow-md hover:bg-yellow-300 transition duration-200">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
