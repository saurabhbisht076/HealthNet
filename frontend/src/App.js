import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./AuthContext";
import HomePage from "./components/HomePage/HomePage";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Page404 from "./components/Page404/Page404";
import ViewLocation from './components/Dashboard/Patient/ViewLocation/ViewLocation';
import PatientDash from "./components/Dashboard/Patient/Patient"; // Fixed typo in "Patient"
import {
  BookAppointment,
  Feedbacks,
  MakePayment,
  MyAppointments,
  Prescriptions,
} from "./components/Dashboard/Patient/PatientTabs";

import DoctorDash from "./components/Dashboard/Doctor/Doctor";
import {
  DocAppointments,
  DocFeedbacks,
  UploadPrescription,
} from "./components/Dashboard/Doctor/DoctorTabs";

import StaffDash from "./components/Dashboard/Staff/Staff";
import {
  AvailableDoctors,
  BookAppointmentStaff,
  CancelAppointment,
  MakePaymentStaff,
} from "./components/Dashboard/Staff/StaffTabs";

import AdminDash from "./components/Dashboard/Admin/Admin";
import {
  DocList,
  ViewFeedbacks,
  GenerateStats,
  StaffList,
  VerifyUser,
  AddNew,
} from "./components/Dashboard/Admin/AdminTabs";

function App() {
  const { userType } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/view-location" element={<ViewLocation />} />
        
        {/* Authentication Routes */}
        <Route
          path="/signin"
          element={
            userType ? <Navigate to={`/dashboard/${userType}`} /> : <SignIn />
          }
        />
        <Route
          path="/signup"
          element={
            userType ? <Navigate to={`/dashboard/${userType}`} /> : <SignUp />
          }
        />

        {/* Patient Dashboard Routes */}
        {userType === "Patient" && (
          <Fragment>
            <Route path="/dashboard/patient" element={<PatientDash />} />
            <Route
              path="/dashboard/patient/view-location"
              element={<ViewLocation />}
            />
            <Route
              path="/dashboard/patient/book-appointment"
              element={<BookAppointment />}
            />
            <Route
              path="/dashboard/patient/make-payment"
              element={<MakePayment />}
            />
            <Route
              path="/dashboard/patient/my-appointments"
              element={<MyAppointments />}
            />
            <Route
              path="/dashboard/patient/prescriptions"
              element={<Prescriptions />}
            />
            <Route
              path="/dashboard/patient/feedbacks"
              element={<Feedbacks />}
            />
          </Fragment>
        )}

        {/* Doctor Dashboard Routes */}
        {userType === "Doctor" && (
          <Fragment>
            <Route path="/dashboard/doctor" element={<DoctorDash />} />
            <Route
              path="/dashboard/doctor/feedbacks"
              element={<DocFeedbacks />}
            />
            <Route
              path="/dashboard/doctor/appointments"
              element={<DocAppointments />}
            />
            <Route
              path="/dashboard/doctor/upload-prescription"
              element={<UploadPrescription />}
            />
          </Fragment>
        )}

        {/* Staff Dashboard Routes */}
        {userType === "Staff" && (
          <Fragment>
            <Route path="/dashboard/staff" element={<StaffDash />} />
            <Route
              path="/dashboard/staff/available-doctors"
              element={<AvailableDoctors />}
            />
            <Route
              path="/dashboard/staff/book-appointment"
              element={<BookAppointmentStaff />}
            />
            <Route
              path="/dashboard/staff/cancel-appointment"
              element={<CancelAppointment />}
            />
            <Route
              path="/dashboard/staff/make-payment"
              element={<MakePaymentStaff />}
            />
          </Fragment>
        )}

        {/* Admin Dashboard Routes */}
        {userType === "Admin" && (
          <Fragment>
            <Route path="/dashboard/admin" element={<AdminDash />} />
            <Route
              path="/dashboard/admin/doc-list"
              element={<DocList />}
            />
            <Route
              path="/dashboard/admin/staff-list"
              element={<StaffList />}
            />
            <Route
              path="/dashboard/admin/generate-stats"
              element={<GenerateStats />}
            />
            <Route
              path="/dashboard/admin/feedbacks"
              element={<ViewFeedbacks />}
            />
            <Route
              path="/dashboard/admin/verify-user"
              element={<VerifyUser />}
            />
            <Route
              path="/dashboard/admin/verify-user/addnew"
              element={<AddNew />}
            />
          </Fragment>
        )}

        {/* Fallback Routes */}
        <Route path="/*" element={<Page404 />} />
      </Routes>
    </Router>
  );
}

export default App;