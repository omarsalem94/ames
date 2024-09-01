import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewReview = () => {
  const [modules, setModules] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  // Fetch not started reviews when component renders
  useEffect(() => {
    const fetchNotStartedReviews = async () => {
      try {
        const response = await axios.get("/api/reviews/not-started");
        setModules(response.data.modules);
        setPrograms(response.data.programs);
      } catch (error) {
        console.error("Error fetching not started reviews:", error);
        toast.error("Error fetching reviews");
      }
    };

    fetchNotStartedReviews();

    const adminToken = localStorage.getItem("adminToken");
    const moduleLeaderToken = localStorage.getItem("moduleLeaderToken");
    let token = adminToken || moduleLeaderToken;

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.user.role);
    }
  }, []);

  // Handle starting a new review
  const handleStartReview = () => {
    if (selectedType && selectedId) {
      navigate(`/module-leader/review/${selectedType}/${selectedId}`);
    } else {
      toast.error("Please select a review type and item");
    }
  };

  return (
    <div>
      <Navbar userRole={userRole} />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            Start a New Review
          </h1>
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-700">
              Select Review Type
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="module">Module</option>
                <option value="program">Program</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M7 10l5 5 5-5H7z" />
                </svg>
              </div>
            </div>
          </div>
          {selectedType === "module" && (
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Select Module
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">Select Module</option>
                  {modules.map((module) => (
                    <option key={module._id} value={module._id}>
                      {`${module.moduleCode} - ${module.fullName}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          {selectedType === "program" && (
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-700">
                Select Program
              </label>
              <div className="relative">
                <select
                  className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                >
                  <option value="">Select Program</option>
                  {programs.map((program) => (
                    <option key={program._id} value={program._id}>
                      {`${program.routeCode} - ${program.fullName}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 10l5 5 5-5H7z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
            onClick={handleStartReview}
          >
            Start Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewReview;
