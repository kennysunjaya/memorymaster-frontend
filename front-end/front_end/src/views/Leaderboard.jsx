import { useDispatch, useSelector } from "react-redux";
import { fetchAsync } from "../app/user-slice";
import gifLoading from "../assets/loading.svg";
import { useEffect } from "react";
import Toastify from "toastify-js";

export default function Leaderboard() {
  const { users, loading, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAsync());
  }, []);

  useEffect(() => {
    if (error) {
      Toastify({
        text: error,
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
  }, [error]);

  if (loading) {
    return (
      <>
        <section className="flex justify-center items-center h-screen">
          <img src={gifLoading} />
        </section>
      </>
    );
  }

  return (
    <>
      {!error && users.length > 0 && (
        <>
          <div className="flex justify-center items-center  mt-20">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-center text-yellow-300 font-bold text-2xl mb-4">Leaderboard</h2>
              <table className="table-auto w-full text-white overflow-scroll">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="px-4 py-2 text-left">Rank</th>
                    <th className="px-4 py-2 text-left">Username</th>
                    <th className="px-4 py-2 text-left">Highscore</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, index) => {
                    return (
                      <tr className="hover:bg-gray-600" key={u.id}>
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">{u.username}</td>
                        <td className="border px-4 py-2">{u.highscore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
