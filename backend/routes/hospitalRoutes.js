import express from "express";
import Hospital from "../models/Hospital.js";

const router = express.Router();

// Get hospitals within a given range
router.get("/", async (req, res) => {
  try {
    const { lat, lng, range = 50 } = req.query; // Default range = 50km

    if (!lat || !lng) {
      return res.status(400).json({ message: "Latitude and Longitude are required" });
    }

    const hospitals = await Hospital.find({
      location: {
        $geoWithin: {
          $centerSphere: [[parseFloat(lng), parseFloat(lat)], range / 6378.1], // Convert km to radians
        },
      },
    });

    res.status(200).json(hospitals);
  } catch (error) {
    console.error("❌ Error fetching hospitals:", error);
    res.status(500).json({ message: "Error fetching hospitals" });
  }
});

export default router;
