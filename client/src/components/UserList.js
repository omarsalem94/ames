import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const moduleLeaderToken = localStorage.getItem("moduleLeaderToken");
    let token = adminToken || moduleLeaderToken;

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.user.role);
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/auth/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users");
      }
    };

    fetchUsers();
  }, []);

  const formatRole = (role) => {
    if (role === "module_leader") return "Module Leader";
    if (role === "admin") return "Admin";
    return role;
  };

  return (
    <div>
      <Navbar userRole={userRole} />
      <ToastContainer />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Registered Users
        </h1>
        {users.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No users have been registered yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-3 px-6 border-b text-left">First Name</th>
                  <th className="py-3 px-6 border-b text-left">Last Name</th>
                  <th className="py-3 px-6 border-b text-left">Email</th>
                  <th className="py-3 px-6 border-b text-left">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="py-3 px-6 border-b">{user.firstName}</td>
                    <td className="py-3 px-6 border-b">{user.lastName}</td>
                    <td className="py-3 px-6 border-b">{user.email}</td>
                    <td className="py-3 px-6 border-b">
                      {formatRole(user.role)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
