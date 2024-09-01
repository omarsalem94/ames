import React from "react";
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook from React Router for navigation
import logo from "../assets/UoD-Logo-Blue.jpg";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ userRole }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (userRole === "admin") {
      localStorage.removeItem("adminToken");
    } else if (userRole === "module_leader") {
      localStorage.removeItem("moduleLeaderToken");
    }
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <div>
        <img src={logo} alt="University of Dundee Logo" className="h-10" />
      </div>
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 py-2 px-4 rounded flex items-center hover:bg-gray-200 transition duration-300"
      >
        <FaSignOutAlt className="mr-2 mt-1" />
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
