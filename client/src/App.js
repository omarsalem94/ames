// Importing necessary libraries and components
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Admin from "./components/Admin";
import ModuleLeader from "./components/ModuleLeader";
import NewReview from "./components/NewReview";
import SubmittedReviews from "./components/SubmittedReviews";
import InProgressReviews from "./components/InProgressReviews";
import ReviewForm from "./components/ReviewForm";
import ProtectedRoute from "./components/ProtectedRoute";
import ModuleProgramList from "./components/ModuleProgramList";
import AdminReviews from "./components/AdminReviews";
import UserList from "./components/UserList"; // Import the UserList component
import { ToastContainer } from "react-toastify"; // Library for displaying notifications
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the login page */}
        <Route path="/" element={<Login />} />

        {/* Route for the admin page, protected by ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Route for listing modules and programs */}
        <Route
          path="/modules-programs"
          element={
            <ProtectedRoute role="admin">
              <ModuleProgramList />
            </ProtectedRoute>
          }
        />

        {/* Route for admin to view reviews */}
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute role="admin">
              <AdminReviews />
            </ProtectedRoute>
          }
        />

        {/* Route for the module leader page */}
        <Route
          path="/module-leader"
          element={
            <ProtectedRoute role="module_leader">
              <ModuleLeader />
            </ProtectedRoute>
          }
        />

        {/* Route for creating new reviews */}
        <Route
          path="/module-leader/new-review"
          element={
            <ProtectedRoute role="module_leader">
              <NewReview />
            </ProtectedRoute>
          }
        />

        {/* Route for viewing submitted reviews */}
        <Route
          path="/module-leader/previous-reviews"
          element={
            <ProtectedRoute role="module_leader">
              <SubmittedReviews />
            </ProtectedRoute>
          }
        />

        {/* Route for viewing in-progress reviews */}
        <Route
          path="/module-leader/in-progress-reviews"
          element={
            <ProtectedRoute role="module_leader">
              <InProgressReviews />
            </ProtectedRoute>
          }
        />

        {/* Dynamic route for the review form */}
        <Route
          path="/module-leader/review/:type/:id"
          element={
            <ProtectedRoute role="module_leader">
              <ReviewForm />
            </ProtectedRoute>
          }
        />

        {/* Route for viewing the user list, protected by admin role */}
        <Route
          path="/users"
          element={
            <ProtectedRoute role="admin">
              <UserList />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ToastContainer component to display notifications */}
      <ToastContainer />
    </Router>
  );
}

export default App;
