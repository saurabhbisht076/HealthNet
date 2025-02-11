import auth from "../models/auth.js";
import appointment from "../models/appointment.js";

// -----------> Find user based on uid <--------------------------

const finduser = async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await auth.findOne({ uid }, "-password -verified");
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ error: true, errorMsg: "User Not Found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Return Unverified Users <--------------------------

const unverified = async (req, res) => {
  try {
    const users = await auth.find(
      { verified: false },
      "-speciality -password -verified"
    );
    if (users.length > 0) {
      return res.status(200).json(users);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No Unverified User found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Verify Users <--------------------------

const verify = async (req, res) => {
  try {
    const { uid, workDays, time, department, speciality, fee } = req.body;
    const verifiedUser = await auth.findOneAndUpdate(
      { uid },
      { verified: true, workDays, time, department, speciality, fee }
    );
    if (verifiedUser) {
      return res
        .status(200)
        .json({ error: false, msg: "Verified and Updated." });
    } else {
      return res
        .status(400)
        .json({ error: true, errorMsg: "Failed to verify the user." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Reject Verification <--------------------------

const reject = async (req, res) => {
  try {
    const { uid } = req.body;
    const deletedUser = await auth.deleteOne({ uid });
    if (deletedUser.acknowledged) {
      return res.status(200).json({ error: false, msg: "User Rejected!" });
    } else {
      return res
        .status(400)
        .json({ error: true, errorMsg: "Something went wrong" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Return List of Doctors <--------------------------

const docList = async (req, res) => {
  try {
    const doctors = await auth.find(
      { userType: "Doctor", verified: true },
      "-password -verified"
    );
    if (doctors.length > 0) {
      return res.status(200).json(doctors);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "No doctor User found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Return List of Staffs <--------------------------

const staffList = async (req, res) => {
  try {
    const staffs = await auth.find(
      { userType: "Staff", verified: true },
      "-password -verified"
    );
    if (staffs.length > 0) {
      return res.status(200).json(staffs);
    } else {
      return res.status(404).json({ error: true, errorMsg: "No staff found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Return Feedback List <--------------------------

const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await appointment.find(
      { feedback: true },
      "-_id patname docname date feedback review rating"
    );
    if (feedbacks.length > 0) {
      return res.status(200).json(feedbacks);
    } else {
      return res.status(404).json({ error: true, errorMsg: "No staff found!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

// -----------> Generate Stats <--------------------------

const generateStats = async (req, res) => {
  try {
    const users = await auth.find({ verified: true });
    const appointments = await appointment.find({ completed: true });
    const aggregatedResults = await appointment.aggregate([
      {
        $match: { feedback: true },
      },
      {
        $group: {
          _id: "$docname",
          avgRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { avgRating: -1 },
      },
    ]);

    const highestAvgRating = aggregatedResults[0]
      ? aggregatedResults[0].avgRating
      : 0;

    const mostRatedDoctors = aggregatedResults.filter(
      (doctor) => doctor.avgRating === highestAvgRating
    );

    const mostRatedDoctorNames = mostRatedDoctors
      .map((doctor) => doctor._id)
      .join(", ");

    if (users.length > 0) {
      const patients = users.filter((user) => user.userType === "Patient");
      const doctors = users.filter((user) => user.userType === "Doctor");
      const staffs = users.filter((user) => user.userType === "Staff");
      const nop = patients.length;
      const nod = doctors.length;
      const nos = staffs.length;
      const totalapt = appointments.length;

      const totalRevenue = appointments.reduce(
        (accumulator, currentAppointment) => {
          return accumulator + currentAppointment.fee;
        },
        0
      );

      const responseArray = [
        { subheading: "Most Rated Doctor(s)", heading: mostRatedDoctorNames },
        { subheading: "Verified Staffs", heading: nos },
        { subheading: "Verified Doctors", heading: nod },
        { subheading: "Registered Patients", heading: nop },
        { subheading: "Appointments Fulfilled", heading: totalapt },
        { subheading: "Total Appointment Fees", heading: `₹ ${totalRevenue}` },
      ];

      return res.status(200).json(responseArray);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "Error Generating Stats" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export {
  finduser,
  unverified,
  verify,
  reject,
  docList,
  staffList,
  getFeedbacks,
  generateStats,
};
