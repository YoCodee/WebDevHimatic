import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContect";
function Navbar() {
  const user = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <div className="flex justify-between items-center w-full px-2 py-3 rounded-md text-white  bg-cyan-500 ">
      <div className="Judul ">
        <h1 className="text-xl ">
          Welcome Back ,{" "}
          <span className="font-bold">{user?.user?.username??"Guest"}</span>{" "}
        </h1>
      </div>
      <button
        className="bg-red-500 px-4 py-2 rounded-md"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar;
