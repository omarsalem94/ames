import React, { useState, useEffect } from "react";
import axios from "axios"; // Importing axios for making HTTP requests
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

const Admin = () => {
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the modal
  const [modulesFile, setModulesFile] = useState(null); // State to store the selected modules file
  const [programsFile, setProgramsFile] = useState(null); // State to store the selected programs file
  const [downloadUrl, setDownloadUrl] = useState(null); // State to store the URL for downloading previous academic year data
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Functions to handle file selection for modules and programs
  const handleModulesChange = (e) => setModulesFile(e.target.files[0]);
  const handleProgramsChange = (e) => setProgramsFile(e.target.files[0]);

  // Function to handle form submission for creating a new academic year
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!modulesFile || !programsFile) {
      toast.error("Please upload both files.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("modules", modulesFile);
    formData.append("programs", programsFile);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const toastId = "uploadSuccess";
      if (!toast.isActive(toastId)) {
        toast.success("New academic year created successfully", { toastId });
      }
      handleClose();
      if (response.data.filePath) {
        setDownloadUrl(response.data.filePath);
        toast.success("Previous academic year exported successfully");
      }
      navigate("/modules-programs");
    } catch (error) {
      toast.error(
        `Error uploading files: ${error.response?.data || error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedUrl = localStorage.getItem("downloadUrl");
    if (savedUrl) {
      setDownloadUrl(savedUrl);
    }
    const adminToken = localStorage.getItem("adminToken");
    const moduleLeaderToken = localStorage.getItem("moduleLeaderToken");
    let token = adminToken || moduleLeaderToken;

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.user.role);
    }
  }, []);

  // Function to view existing academic year data
  const handleViewExisting = async () => {
    try {
      const response = await axios.get("/api/modules");
      if (response.data.length === 0) {
        toast.error("No academic year found");
        return;
      }
      navigate("/modules-programs");
    } catch (error) {
      toast.error("Error fetching academic year data");
    }
  };

  // Function to view submitted reviews
  const handleViewReviews = async () => {
    try {
      const response = await axios.get("/api/modules");
      if (response.data.length === 0) {
        toast.error("No academic year found");
        return;
      }
      navigate("/admin/reviews");
    } catch (error) {
      toast.error("Error fetching academic year data");
    }
  };

  // Function to handle viewing users
  const handleViewUsers = () => {
    navigate("/users");
  };

  return (
    <div>
      <Navbar userRole={userRole} />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Admin Page
          </h1>
          <div className="flex flex-col space-y-6">
            <button
              className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleShow}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Create New Academic Year"}
            </button>
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200"
              onClick={handleViewExisting}
            >
              View Existing Academic Year
            </button>
            <button
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 transition duration-200"
              onClick={handleViewReviews}
            >
              View All Reviews
            </button>
            <button
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 transition duration-200"
              onClick={handleViewUsers}
            >
              View Users
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-200 text-center"
                download
              >
                Download Previous Academic Year
              </a>
            )}
          </div>

          {showModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-6 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-xl leading-6 font-medium text-gray-900">
                          Create New Academic Year
                        </h3>
                        <div className="mt-4">
                          <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Upload Modules Excel
                              </label>
                              <input
                                type="file"
                                onChange={handleModulesChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700">
                                Upload Programs Excel
                              </label>
                              <input
                                type="file"
                                onChange={handleProgramsChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                            <button
                              className={`bg-blue-600 text-white px-6 py-3 rounded-lg w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200 ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              type="submit"
                              disabled={isLoading}
                            >
                              {isLoading ? "Uploading..." : "Submit"}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Admin;
