import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewForm = () => {
  // Extracting parameters and location information
  const { type, id } = useParams(); // Extracting type and id from URL parameters
  const location = useLocation(); // Accessing location information
  const navigate = useNavigate();
  const {
    register, // register function to register input fields
    handleSubmit, // handleSubmit function to handle form submission
    setValue, // setValue function to set values of input fields
    formState: { errors }, // Destructuring errors from formState
  } = useForm();
  const [documentName, setDocumentName] = useState(""); // State to store document name
  const [isReadOnly, setIsReadOnly] = useState(false); // State to control read-only mode
  const [userRole, setUserRole] = useState("");

  // Fetching data and setting read-only mode on component render
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/${type === "module" ? "modules" : "programs"}/${id}`
        );
        const data = response.data;
        setDocumentName(data.fullName);

        Object.keys(data).forEach((key) => {
          if (key === "date" && data[key]) {
            const formattedDate = new Date(data[key])
              .toISOString()
              .split("T")[0];
            setValue(key, formattedDate);
          } else {
            setValue(key, data[key]);
          }
        });
      } catch (error) {
        toast.error("Error fetching review data");
      }
    };

    fetchData();

    // Setting read-only mode based on query parameters
    const queryParams = new URLSearchParams(location.search);
    setIsReadOnly(queryParams.get("readonly") === "true");

    const adminToken = localStorage.getItem("adminToken");
    const moduleLeaderToken = localStorage.getItem("moduleLeaderToken");
    let token = adminToken || moduleLeaderToken;

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.user.role);
    }
  }, [type, id, setValue, location.search]);

  // Function to save progress
  const onSaveProgress = async (data) => {
    try {
      await axios.put(
        `/api/${type === "module" ? "modules" : "programs"}/${id}`,
        { ...data, status: "In Progress" }
      );
      toast.success("Progress saved");
    } catch (error) {
      toast.error("Error saving progress");
    }
  };

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      await axios.put(
        `/api/${type === "module" ? "modules" : "programs"}/${id}`,
        { ...data, status: "Completed" }
      );
      navigate("/module-leader", {
        state: { formSubmitted: true, documentName },
      });
    } catch (error) {
      toast.error("Error updating review");
    }
  };

  return (
    <div>
      <Navbar userRole={userRole} />
      <ToastContainer />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            Reviewing {documentName}
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Academic Year
              </label>
              <input
                type="text"
                {...register("academicYear", {
                  required: "Academic Year is required",
                })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                readOnly={isReadOnly}
              />
              {errors.academicYear && (
                <p className="text-red-600 text-sm">
                  {errors.academicYear.message}
                </p>
              )}
            </div>
            {type === "module" && (
              <>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Module Leader
                  </label>
                  <input
                    type="text"
                    {...register("moduleLeader", {
                      required: "Module Leader is required",
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                    readOnly={isReadOnly}
                  />
                  {errors.moduleLeader && (
                    <p className="text-red-600 text-sm">
                      {errors.moduleLeader.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Student Numbers
                  </label>
                  <input
                    type="number"
                    {...register("studentNumbers", {
                      required: "Student Numbers are required",
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                    readOnly={isReadOnly}
                  />
                  {errors.studentNumbers && (
                    <p className="text-red-600 text-sm">
                      {errors.studentNumbers.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Evaluation Operation
                  </label>
                  <textarea
                    {...register("evaluationOperation")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Evaluation Approach
                  </label>
                  <textarea
                    {...register("evaluationApproach")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Inclusive Curriculum
                  </label>
                  <textarea
                    {...register("inclusiveCurriculum")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Effect of Past Changes
                  </label>
                  <textarea
                    {...register("effectPastChanges")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Proposed Future Changes
                  </label>
                  <textarea
                    {...register("proposedFutureChanges")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Quality and Improvement Plans
                  </label>
                  <textarea
                    {...register("qualityAndImprovementPlans")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
              </>
            )}
            {type === "program" && (
              <>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Program Leader
                  </label>
                  <input
                    type="text"
                    {...register("programLeader", {
                      required: "Program Leader is required",
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                    readOnly={isReadOnly}
                  />
                  {errors.programLeader && (
                    <p className="text-red-600 text-sm">
                      {errors.programLeader.message}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Program Team
                  </label>
                  <input
                    type="text"
                    {...register("programTeam")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                    readOnly={isReadOnly}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Changes from Last Year
                  </label>
                  <textarea
                    {...register("changesFromLastYear")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Student Feedback
                  </label>
                  <textarea
                    {...register("studentFeedback")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Evaluation
                  </label>
                  <textarea
                    {...register("evaluation")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    Future Planning
                  </label>
                  <textarea
                    {...register("futurePlanning")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                    readOnly={isReadOnly}
                  ></textarea>
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Other Comments
              </label>
              <textarea
                {...register("otherComments")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-24 px-4 py-2"
                readOnly={isReadOnly}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                {...register("author")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                readOnly={isReadOnly}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                {...register("email")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                readOnly={isReadOnly}
              />
            </div>
            <div className="mb-4">
              <label className="block text-lg font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                {...register("date")}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 h-12 px-4 py-2"
                readOnly={isReadOnly}
              />
            </div>
            {!isReadOnly && (
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handleSubmit(onSaveProgress)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg w-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 transition duration-200"
                >
                  Save Progress
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition duration-200"
                >
                  Submit Review
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
