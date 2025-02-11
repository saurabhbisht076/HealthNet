import appointment from "../models/appointment.js";
import prescription from "../models/prescription.js";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase-config.js";

// -----------------> Upcoming Appointments <-------------------

const docAppointments = async (req, res) => {
  try {
    const { docid } = req.body;
    const appointments = await appointment.find({ docid, payment: true });
    if (appointments.length > 0) {
      const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.doa);
        const appointmentYear = appointmentDate.getFullYear();
        const appointmentMonth = appointmentDate.getMonth();
        const appointmentDay = appointmentDate.getDate();

        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        if (
          appointmentYear > currentYear ||
          (appointmentYear === currentYear &&
            (appointmentMonth > currentMonth ||
              (appointmentMonth === currentMonth &&
                appointmentDay >= currentDay)))
        ) {
          return true;
        } else {
          return false;
        }
      });

      if (filteredAppointments.length > 0) {
        return res.status(200).json(filteredAppointments);
      } else {
        return res
          .status(404)
          .json({ error: true, errorMsg: "No upcoming appointments." });
      }
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No upcoming appointments." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -------------------------> Upload Prescription to Firebase <----------------------

const uploadPrescription = async (req, res) => {
  try {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const storageRef = ref(
      storage,
      `prescriptions/${uniqueSuffix + "_" + req.file.originalname}`
    );
    const metadata = {
      contentType: req.file.mimetype,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );
    const downloadURL = await getDownloadURL(snapshot.ref);

    const pr = req.body;
    pr.prescribed = true;
    pr.file = downloadURL;
    pr.pdate = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    await prescription.create(pr);

    return res.status(201).json({
      error: false,
      msg: "Prescription Uploaded Successfully.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------------> Return Received Feedbacks <------------------------

const docFeedbacks = async (req, res) => {
  try {
    const { docid } = req.body;
    const appointments = await appointment.find(
      { docid, feedback: true },
      "-_id patname date feedback review rating"
    );
    if (appointments.length > 0) {
      return res.status(200).json(appointments);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No feedback found." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// exports

export { docAppointments, uploadPrescription, docFeedbacks };
