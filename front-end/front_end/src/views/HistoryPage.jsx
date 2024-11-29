import { useEffect, useState } from "react";
import axios from "axios";
import Toastify from "toastify-js";

export default function HistoryPage() {
  const [games, setGames] = useState([]);

  async function fetchUser() {
    try {
      const { data } = await axios.get("http://localhost:3000/user", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      setGames(data.user.Games);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id) {
    try {
      const { data } = await axios.delete(`http://localhost:3000/game/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });

      fetchUser();

      Toastify({
        text: "Deleted successfully",
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
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center mt-12">
      {/* Table Container */}
      <div className="w-3/4 max-w-4xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-yellow-300 text-center text-2xl font-bold py-4">User History</h2>
        {/* Scrollable Table */}
        <div className="overflow-y-scroll h-96">
          <table className="table-auto w-full text-left border-collapse">
            {/* Table Header */}
            <thead className="bg-gray-700 text-yellow-300 sticky top-0">
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-600">Score</th>
                <th className="px-6 py-3 border-b-2 border-gray-600">Action</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="text-gray-300">
              {games.map((el) => {
                return (
                  <>
                    <tr className="hover:bg-gray-700 transition" key={el.id}>
                      <td className="px-6 py-4 border-b border-gray-600">{el.score}</td>
                      <td className="px-6 py-4 border-b border-gray-600">
                        <button
                          className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 rounded"
                          onClick={() => {
                            handleDelete(el.id);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
              {/* Example Row */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
