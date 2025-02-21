import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema({
    name: String,
    lat: Number,
    lng: Number
});

const Hospital = mongoose.model("Hospital", HospitalSchema);

export default Hospital;