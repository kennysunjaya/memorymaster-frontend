import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <>
      <nav id="Navbar" className="flex items-center justify-between p-4 z-10 top-0 sticky">
        {/* Site Name */}
        <div className="text-yellow-300 text-xl">
          <Link to={"/"}>Memory Master</Link>
        </div>
        {/* Navbar Buttons */}
        <div className="flex gap-4">
          <Link to={"/leaderboard"} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-2 border-black rounded-lg shadow-md transition duration-200">
            Leaderboard
          </Link>
          <Link to={"/history"} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-2 border-black rounded-lg shadow-md transition duration-200">
            History
          </Link>
          <Link to={"/profile"} className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 border-2 border-black rounded-lg shadow-md transition duration-200">
            Edit Profile
          </Link>
          <button className="bg-red-900 hover:bg-red-300 text-black font-bold py-2 px-4 border-2 border-black rounded-lg shadow-md transition duration-200" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}
