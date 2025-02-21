import express from "express";
import Hospital from "../models/Hospital.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hospitals" });
  }
});

export default router;