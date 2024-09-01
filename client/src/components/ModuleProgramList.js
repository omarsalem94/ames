import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar"; // Importing Bar chart component from react-chartjs-2
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Importing Chart.js components for charting
import { FaSortUp, FaSortDown } from "react-icons/fa"; // Importing sort icons

// Registering chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ModuleProgramList = () => {
  const [modules, setModules] = useState([]); // State to store modules data
  const [programs, setPrograms] = useState([]); // State to store programs data
  const [downloadUrl, setDownloadUrl] = useState(null); // State to store download URL for current academic year
  const [moduleSortedColumn, setModuleSortedColumn] = useState(""); // State to track sorted column for modules
  const [moduleSortDirection, setModuleSortDirection] = useState("asc"); // State to track sort direction for modules
  const [programSortedColumn, setProgramSortedColumn] = useState(""); // State to track sorted column for programs
  const [programSortDirection, setProgramSortDirection] = useState("asc"); // State to track sort direction for programs
  const [emailDetails, setEmailDetails] = useState({
    status: "",
    subject: "",
    message: "",
  });
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [userRole, setUserRole] = useState("");

  // Fetch modules and programs data when component renders
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axios.get("/api/modules");
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };

    const fetchPrograms = async () => {
      try {
        const response = await axios.get("/api/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchModules();
    fetchPrograms();

    const adminToken = localStorage.getItem("adminToken");
    const moduleLeaderToken = localStorage.getItem("moduleLeaderToken");
    let token = adminToken || moduleLeaderToken;

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.user.role);
    }
  }, []);

  // Handle exporting current year data
  const handleExportCurrentYear = async () => {
    try {
      const response = await axios.get("/api/export/current");
      setDownloadUrl(response.data.filePath);
      toast.success("Current academic year exported successfully");
    } catch (error) {
      toast.error("Error exporting current academic year");
    }
  };

  // Get counts of items by status
  const getStatusCounts = (items) => {
    const counts = { notStarted: 0, inProgress: 0, completed: 0 };
    items.forEach((item) => {
      if (item.status === "Not Started") counts.notStarted++;
      else if (item.status === "In Progress") counts.inProgress++;
      else if (item.status === "Completed") counts.completed++;
    });
    return counts;
  };

  // Calculate status counts for modules and programs
  const moduleStatusCounts = getStatusCounts(modules);
  const programStatusCounts = getStatusCounts(programs);

  // Data and options for bar chart
  const data = {
    labels: ["Not Started", "In Progress", "Completed"],
    datasets: [
      {
        label: "Modules",
        data: [
          moduleStatusCounts.notStarted,
          moduleStatusCounts.inProgress,
          moduleStatusCounts.completed,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        barThickness: 50,
      },
      {
        label: "Programs",
        data: [
          programStatusCounts.notStarted,
          programStatusCounts.inProgress,
          programStatusCounts.completed,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        barThickness: 50,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Module and Program Status Overview",
      },
    },
    maintainAspectRatio: false,
  };

  // Function to sort data
  const sortData = (data, column, direction) => {
    const sortedData = [...data];
    if (direction === "asc") {
      sortedData.sort((a, b) => (a[column] > b[column] ? 1 : -1));
    } else {
      sortedData.sort((a, b) => (a[column] < b[column] ? 1 : -1));
    }
    return sortedData;
  };

  // Handle sorting modules
  const handleModuleSort = (column) => {
    const direction =
      moduleSortedColumn === column && moduleSortDirection === "asc"
        ? "desc"
        : "asc";
    setModuleSortedColumn(column);
    setModuleSortDirection(direction);
  };

  // Handle sorting programs
  const handleProgramSort = (column) => {
    const direction =
      programSortedColumn === column && programSortDirection === "asc"
        ? "desc"
        : "asc";
    setProgramSortedColumn(column);
    setProgramSortDirection(direction);
  };

  // Sorted modules and programs
  const sortedModules = sortData(
    modules,
    moduleSortedColumn,
    moduleSortDirection
  );
  const sortedPrograms = sortData(
    programs,
    programSortedColumn,
    programSortDirection
  );

  // Render sort icon
  const renderSortIcon = (sortedColumn, column, sortDirection) => {
    if (sortedColumn !== column) return null;
    return sortDirection === "asc" ? (
      <FaSortUp className="inline" />
    ) : (
      <FaSortDown className="inline" />
    );
  };

  // Handle sending email reminders
  const handleSendEmail = async () => {
    const emailsToSend = [...modules, ...programs]
      .filter((item) => item.status === emailDetails.status)
      .map((item) => item.email)
      .filter((email) => email);

    if (emailsToSend.length === 0) {
      toast.error("No email addresses found for the selected status");
      return;
    }

    for (const email of emailsToSend) {
      try {
        await axios.post("/api/send-reminder", {
          email,
          subject: emailDetails.subject,
          text: emailDetails.message,
        });
      } catch (error) {
        console.error(
          `Error sending email to ${email}:`,
          error.response ? error.response.data : error.message
        );
        toast.error(
          `Error sending email to ${email}: ${
            error.response ? error.response.data : error.message
          }`
        );
      }
    }
    toast.success("Emails sent successfully");
    setShowModal(false);
  };

  // Handle showing and hiding the modal
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <Navbar userRole={userRole} />
      <ToastContainer />
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Modules and Programs
        </h1>
        <div className="mb-8">
          <div className="relative" style={{ height: "400px" }}>
            <Bar data={data} options={options} />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">Modules</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleModuleSort("moduleCode")}
                  >
                    Module Code{" "}
                    {renderSortIcon(
                      moduleSortedColumn,
                      "moduleCode",
                      moduleSortDirection
                    )}
                  </th>
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleModuleSort("fullName")}
                  >
                    Module Full Name{" "}
                    {renderSortIcon(
                      moduleSortedColumn,
                      "fullName",
                      moduleSortDirection
                    )}
                  </th>
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleModuleSort("facultyCode")}
                  >
                    School{" "}
                    {renderSortIcon(
                      moduleSortedColumn,
                      "facultyCode",
                      moduleSortDirection
                    )}
                  </th>
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleModuleSort("status")}
                  >
                    Status{" "}
                    {renderSortIcon(
                      moduleSortedColumn,
                      "status",
                      moduleSortDirection
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedModules.map((module) => (
                  <tr key={module._id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">{module.moduleCode}</td>
                    <td className="py-3 px-4 border-b">{module.fullName}</td>
                    <td className="py-3 px-4 border-b">{module.facultyCode}</td>
                    <td className="py-3 px-4 border-b">{module.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-gray-700">
            Programs
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleProgramSort("routeCode")}
                  >
                    Route Code{" "}
                    {renderSortIcon(
                      programSortedColumn,
                      "routeCode",
                      programSortDirection
                    )}
                  </th>
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleProgramSort("fullName")}
                  >
                    Program Full Name{" "}
                    {renderSortIcon(
                      programSortedColumn,
                      "fullName",
                      programSortDirection
                    )}
                  </th>
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleProgramSort("facultyCode")}
                  >
                    School{" "}
                    {renderSortIcon(
                      programSortedColumn,
                      "facultyCode",
                      programSortDirection
                    )}
                  </th>
                  <th
                    className="py-3 px-4 border-b text-left cursor-pointer"
                    onClick={() => handleProgramSort("status")}
                  >
                    Status{" "}
                    {renderSortIcon(
                      programSortedColumn,
                      "status",
                      programSortDirection
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPrograms.map((program) => (
                  <tr key={program._id} className="hover:bg-gray-100">
                    <td className="py-3 px-4 border-b">{program.routeCode}</td>
                    <td className="py-3 px-4 border-b">{program.fullName}</td>
                    <td className="py-3 px-4 border-b">
                      {program.facultyCode}
                    </td>
                    <td className="py-3 px-4 border-b">{program.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
              onClick={handleExportCurrentYear}
            >
              Export Current Year
            </button>
            {downloadUrl && (
              <a
                href={downloadUrl}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 transition duration-200 ml-4"
                download
              >
                Download Current Academic Year
              </a>
            )}
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50 transition duration-200 ml-4"
              onClick={handleShowModal}
            >
              Send Reminders
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Send Email Reminders
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={handleCloseModal}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  value={emailDetails.status}
                  onChange={(e) =>
                    setEmailDetails({ ...emailDetails, status: e.target.value })
                  }
                >
                  <option value="" className="text-md">
                    Select Status
                  </option>
                  <option value="Not Started" className="text-md">
                    Not Started
                  </option>
                  <option value="In Progress" className="text-md">
                    In Progress
                  </option>
                  <option value="Completed" className="text-md">
                    Completed
                  </option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  value={emailDetails.subject}
                  onChange={(e) =>
                    setEmailDetails({
                      ...emailDetails,
                      subject: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                  value={emailDetails.message}
                  onChange={(e) =>
                    setEmailDetails({
                      ...emailDetails,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
                  onClick={handleSendEmail}
                >
                  Send Reminders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleProgramList;
