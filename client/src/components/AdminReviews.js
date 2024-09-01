import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminReviews = () => {
  const [modules, setModules] = useState([]);
  const [programs, setPrograms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("/api/modules");
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Error fetching modules");
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await axios.get("/api/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
        toast.error("Error fetching programs");
      }
    };

    fetchModules();
    fetchPrograms();
  }, []);

  // Handle viewing module details
  const handleViewModule = (id) => {
    navigate(`/module-leader/review/module/${id}?readonly=true`);
  };

  // Handle viewing program details
  const handleViewProgram = (id) => {
    navigate(`/module-leader/review/program/${id}?readonly=true`);
  };

  // Handle exporting review to Word document
  const handleExportToWord = async (type, id) => {
    try {
      const response = await axios.get(`/api/export/${type}/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}_${id}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export successful");
    } catch (error) {
      toast.error("Error exporting to Word");
    }
  };

  const formatRole = (role) => {
    if (role === "module_leader") return "Module Leader";
    if (role === "admin") return "Admin";
    return role;
  };

  return (
    <div>
      <Navbar />
      <ToastContainer />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          All Reviews
        </h1>
        {modules.length === 0 && programs.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No modules or programs have been reviewed yet.</p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                Modules
              </h2>
              {modules.length === 0 ? (
                <p className="text-gray-500">
                  No modules have been reviewed yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="py-3 px-6 border-b text-left">
                          Module Code
                        </th>
                        <th className="py-3 px-6 border-b text-left">
                          Module Full Name
                        </th>
                        <th className="py-3 px-6 border-b text-left">School</th>
                        <th className="py-3 px-6 border-b text-left">Status</th>
                        <th className="py-3 px-6 border-b text-left">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {modules.map((module) => (
                        <tr key={module._id} className="hover:bg-gray-100">
                          <td className="py-3 px-6 border-b">
                            {module.moduleCode}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {module.fullName}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {module.facultyCode}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {module.status}
                          </td>
                          <td className="py-3 px-6 border-b flex space-x-2">
                            <button
                              onClick={() => handleViewModule(module._id)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
                            >
                              View
                            </button>
                            {module.status === "Completed" && (
                              <button
                                onClick={() =>
                                  handleExportToWord("module", module._id)
                                }
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200"
                              >
                                Export to Word
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="mt-10">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">
                Programs
              </h2>
              {programs.length === 0 ? (
                <p className="text-gray-500">
                  No programs have been reviewed yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow-md rounded-lg">
                    <thead>
                      <tr className="bg-blue-600 text-white">
                        <th className="py-3 px-6 border-b text-left">
                          Route Code
                        </th>
                        <th className="py-3 px-6 border-b text-left">
                          Program Full Name
                        </th>
                        <th className="py-3 px-6 border-b text-left">School</th>
                        <th className="py-3 px-6 border-b text-left">Status</th>
                        <th className="py-3 px-6 border-b text-left">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program._id} className="hover:bg-gray-100">
                          <td className="py-3 px-6 border-b">
                            {program.routeCode}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {program.fullName}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {program.facultyCode}
                          </td>
                          <td className="py-3 px-6 border-b">
                            {program.status}
                          </td>
                          <td className="py-3 px-6 border-b flex space-x-2">
                            <button
                              onClick={() => handleViewProgram(program._id)}
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
                            >
                              View
                            </button>
                            {program.status === "Completed" && (
                              <button
                                onClick={() =>
                                  handleExportToWord("program", program._id)
                                }
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 transition duration-200"
                              >
                                Export to Word
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
