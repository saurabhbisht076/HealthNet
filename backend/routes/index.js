import express from "express";
const router = express.Router();

import middleware from "../middlewares/index.js";
import multerUpload from "../middlewares/multerUpload.js";
import {
  signup,
  signin,
  generateRefreshToken,
  logout,
} from "../controllers/authController.js";
import {
  finduser,
  unverified,
  verify,
  reject,
  docList,
  staffList,
  getFeedbacks,
  generateStats,
} from "../controllers/admin.js";
import {
  bookAppointment,
  duePayment,
  makePayment,
  myAppointments,
  cancelAppointment,
  prescriptions,
  writeFeedback,
  deleteFeedback,
} from "../controllers/patient.js";
import {
  docAppointments,
  docFeedbacks,
  uploadPrescription,
} from "../controllers/doctor.js";
import { findPatient } from "../controllers/staff.js";

// -------------------> Authentication <--------------------------

router.post("/auth/signup", signup);

router.post("/auth/signin", signin);

router.post("/auth/refresh", generateRefreshToken);

router.delete("/auth/logout", logout);

// -------------------> Admin <--------------------------

router.post("/users/finduser", middleware, (req, res) => {
  finduser(req, res);
});

router.get("/users/unverified", middleware, (req, res) => {
  unverified(req, res);
});

router.post("/users/unverified/verify", middleware, (req, res) => {
  verify(req, res);
});

router.delete("/users/unverified/reject", middleware, (req, res) => {
  reject(req, res);
});

router.get("/users/doctors", middleware, (req, res) => {
  docList(req, res);
});

router.get("/users/staffs", middleware, (req, res) => {
  staffList(req, res);
});

router.get("/users/feedbacks", middleware, (req, res) => {
  getFeedbacks(req, res);
});

router.get("/generate/stats", middleware, (req, res) => {
  generateStats(req, res);
});

// -------------------> Patient <--------------------------

router.post("/appointment/book", middleware, (req, res) => {
  bookAppointment(req, res);
});

router.post("/appointment/duepayment", middleware, (req, res) => {
  duePayment(req, res);
});

router.post("/appointment/duepayment/makepayment", middleware, (req, res) => {
  makePayment(req, res);
});

router.post("/patient/appointments", middleware, (req, res) => {
  myAppointments(req, res);
});

router.post("/appointment/cancel", middleware, (req, res) => {
  cancelAppointment(req, res);
});

router.post("/patient/prescriptions", middleware, (req, res) => {
  prescriptions(req, res);
});

router.post("/patient/appointments/feedbacks/write", middleware, (req, res) => {
  writeFeedback(req, res);
});

router.post(
  "/patient/appointments/feedbacks/delete",
  middleware,
  (req, res) => {
    deleteFeedback(req, res);
  }
);

// -------------------> Doctor <--------------------------

router.post("/doctor/appointments", middleware, (req, res) => {
  docAppointments(req, res);
});

router.post(
  "/doctor/prescription/upload",
  [middleware, multerUpload],
  (req, res) => {
    uploadPrescription(req, res);
  }
);

router.post("/doctor/appointments/feedbacks", middleware, (req, res) => {
  docFeedbacks(req, res);
});

// ----------------------------> Staff <------------------------

router.post("/staff/find/patient", middleware, (req, res) => {
  findPatient(req, res);
});

export default router;
