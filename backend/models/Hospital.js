import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
});

// Create a geospatial index
HospitalSchema.index({ location: "2dsphere" });

const Hospital = mongoose.model("Hospital", HospitalSchema);

export default Hospital;
