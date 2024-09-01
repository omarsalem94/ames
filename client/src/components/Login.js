import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importing jwtDecode for decoding JWT tokens
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [firstName, setFirstName] = useState(""); // State to store first name
  const [lastName, setLastName] = useState(""); // State to store last name
  const [email, setEmail] = useState(""); // State to store email
  const [password, setPassword] = useState(""); // State to store password
  const [rememberMe, setRememberMe] = useState(false); // State to store remember me checkbox status
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and registration
  const [role, setRole] = useState("module_leader"); // default role

  const navigate = useNavigate();
  const location = useLocation(); // useLocation hook for accessing location state

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegistering && (!firstName || !lastName || !email || !password)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!isRegistering && (!email || !password)) {
      toast.error("Please enter an email and password");
      return;
    }

    const endpoint = isRegistering ? "register" : "login";
    try {
      const requestData = isRegistering
        ? {
            firstName,
            lastName,
            email: `${email}@dundee.ac.uk`,
            password,
            role,
          }
        : { email: `${email}@dundee.ac.uk`, password };
      const res = await axios.post(
        `http://localhost:5000/api/auth/${endpoint}`,
        requestData
      );

      if (!isRegistering) {
        const token = res.data.token;
        const decoded = jwtDecode(token);
        const userRole = decoded.user.role; // Ensure you access the correct part of the payload

        if (userRole === "admin") {
          localStorage.setItem("adminToken", token); // Store the token in local storage
          navigate("/admin", { state: { loginSuccess: true } });
        } else if (userRole === "module_leader") {
          localStorage.setItem("moduleLeaderToken", token);
          navigate("/module-leader", { state: { loginSuccess: true } });
        }
        toast.success("Login successful");
      } else {
        toast.success("Registration successful! Now you can log in.");
        setIsRegistering(false);
      }
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err);
      toast.error(err.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Welcome to Annual Module Enhancement System
      </h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <ToastContainer />
        {location.state?.logoutSuccess && toast.success("Logout successful")}
        <h2 className="text-2xl mb-6 text-center text-gray-700">
          {isRegistering ? "Register" : "Login"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <div className="flex">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username"
                  />
                  <span className="ml-2 self-center">@dundee.ac.uk</span>
                </div>
              </div>
            </>
          )}
          {!isRegistering && (
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username"
                />
                <span className="ml-2 self-center">@dundee.ac.uk</span>
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isRegistering && (
            <div className="mb-4">
              <label className="block text-gray-700">Role</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="module_leader">Module Leader</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {!isRegistering && (
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="text-gray-700">Remember me</label>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            {isRegistering ? "Register" : "Sign in"}
          </button>
        </form>
        <button
          className="mt-4 text-blue-600 hover:text-blue-800 focus:outline-none"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering
            ? "Already have an account? Sign in"
            : "Need an account? Register"}
        </button>
      </div>
    </div>
  );
};

export default Login;
