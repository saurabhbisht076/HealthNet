import appointment from "../models/appointment.js";
import prescription from "../models/prescription.js";

// -----------------------> Book Appointment <---------------------------

const bookAppointment = async (req, res) => {
  try {
    const newAppointment = req.body;
    await appointment.create(newAppointment);
    return res.status(201).json({
      error: false,
      msg: "Payment is Due. Confirm your appointment after successful payment.",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -------------------> Return Unpaid Appointments <---------------------------

const duePayment = async (req, res) => {
  try {
    const patid = req.body.uid;
    const unpaid = await appointment.find({
      patid,
      cancel: false,
      payment: false,
    });
    if (unpaid.length > 0) {
      return res.status(200).json(unpaid);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No payment found due!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> Make Payment: Update Payment to true <-------------------------

const makePayment = async (req, res) => {
  const { aptid } = req.body;
  try {
    const updated = await appointment.findOneAndUpdate(
      { aptid },
      { payment: true }
    );
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Payment Successful. Appointment confirmed.",
      });
    } else {
      res.status(400).json({
        error: true,
        errorMsg: "Payment was not successful. Try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> Rturn Appointment List for individual patient <---------------------

const myAppointments = async (req, res) => {
  try {
    const { patid } = req.body;
    const appointments = await appointment.find({ patid });
    if (appointments.length > 0) {
      for (const appt of appointments) {
        const prev = new Date(appt.doa);
        const curr = new Date();
        if (prev < curr) {
          if (appt.payment) {
            appt.completed = true;
          } else {
            appt.cancel = true;
          }
          await appt.save();
        }
      }
      return res.status(200).json(appointments);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No appointment found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// --------------------> Cancel Appointment <---------------------------

const cancelAppointment = async (req, res) => {
  const { aptid } = req.body;
  try {
    const updated = await appointment.findOneAndUpdate(
      { aptid },
      { cancel: true }
    );
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Appointment Cancelled.",
      });
    } else {
      res.status(400).json({
        error: true,
        errorMsg: "Unable to Cancel Appointment. Try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ----------------------> Return Prescription List <--------------------------

const prescriptions = async (req, res) => {
  try {
    const prescriptions = await prescription.find({
      patid: req.body.patid,
      prescribed: true,
    });
    if (prescriptions.length > 0) {
      return res.status(200).json(prescriptions);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No prescription found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> Write Feedback <----------------------------

const writeFeedback = async (req, res) => {
  const { aptid } = req.body;
  const newFeedback = {
    feedback: true,
    review: req.body.review,
    rating: req.body.rating && parseInt(req.body.rating),
  };
  try {
    const updated = await appointment.findOneAndUpdate({ aptid }, newFeedback, {
      new: true,
    });
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Feedback updated!",
      });
    } else {
      res.status(400).json({
        error: true,
        errorMsg: "Problem submitting feedback. Try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// ---------------------> Delete Feedback <---------------------------

const deleteFeedback = async (req, res) => {
  const { aptid } = req.body;
  const newFeedback = {
    feedback: false,
    review: "",
    rating: 0,
  };
  try {
    const updated = await appointment.findOneAndUpdate({ aptid }, newFeedback, {
      new: true,
    });
    if (updated) {
      return res.status(200).json({
        error: false,
        msg: "Feedback Deleted!",
      });
    } else {
      res.status(400).json({
        error: true,
        errorMsg: "Problem deleting feedback. Try again!",
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// exports

export {
  bookAppointment,
  duePayment,
  makePayment,
  myAppointments,
  cancelAppointment,
  prescriptions,
  writeFeedback,
  deleteFeedback,
};
