import auth from "../models/auth.js";

const findPatient = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await auth.findOne({ email }, "-_id -password -verified");
    if (user) {
      return res.status(200).json(user);
    } else {
      return res
        .status(404)
        .json({ error: true, errorMsg: "Patient not registered!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: true, errorMsg: "Internal Server Error!" });
  }
};

export { findPatient };
