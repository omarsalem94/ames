import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";

const ModuleLeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  // useEffect hook to show success message when a review is completed
  useEffect(() => {
    if (location && location.state && location.state.formSubmitted) {
      toast.success(`Reviewing completed for ${location.state.documentName}`);
      navigate(location.pathname, { replace: true, state: {} }); // Clear state
    }
    const adminToken = localStorage.getItem("adminToken");
    const moduleLeaderToken = localStorage.getItem("moduleLeaderToken");
    let token = adminToken || moduleLeaderToken;

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.user.role);
    }
  }, [location, navigate]);

  // Function to handle starting a new review
  const handleNewReview = async () => {
    try {
      const response = await axios.get("/api/modules");
      if (response.data.length === 0) {
        toast.error("No academic year found");
        return;
      }
      navigate("/module-leader/new-review");
    } catch (error) {
      toast.error("Error fetching academic year data");
    }
  };

  // Function to handle accessing previous reviews
  const handlePreviousReviews = async () => {
    try {
      const response = await axios.get("/api/modules");
      if (response.data.length === 0) {
        toast.error("No academic year found");
        return;
      }
      navigate("/module-leader/previous-reviews");
    } catch (error) {
      toast.error("Error fetching academic year data");
    }
  };

  // Function to handle accessing in-progress reviews
  const handleInProgressReviews = async () => {
    try {
      const response = await axios.get("/api/modules");
      if (response.data.length === 0) {
        toast.error("No academic year found");
        return;
      }
      navigate("/module-leader/in-progress-reviews");
    } catch (error) {
      toast.error("Error fetching academic year data");
    }
  };

  return (
    <div>
      <Navbar userRole={userRole} />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Module Leader Page
          </h1>
          <div className="flex flex-col space-y-6">
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
              onClick={handleNewReview}
              aria-label="Start a New Review"
            >
              Start a New Review
            </button>
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200"
              onClick={handlePreviousReviews}
              aria-label="Access Previous Reviews"
            >
              Access Previous Reviews
            </button>
            <button
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 transition duration-200"
              onClick={handleInProgressReviews}
              aria-label="Access Saved (In Progress) Reviews"
            >
              Access Saved (In Progress) Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleLeader;
