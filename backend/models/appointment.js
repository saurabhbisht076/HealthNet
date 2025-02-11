import mongoose from "mongoose";
import { nanoid } from "nanoid";

const appointmentSchema = new mongoose.Schema({
  aptid: {
    type: String,
    default: () => nanoid(),
  },
  patid: {
    type: String,
    required: true,
  },
  docid: {
    type: String,
    required: true,
  },
  patname: String,
  docname: String,
  speciality: String,
  doa: String,
  date: String,
  time: String,
  payment: {
    type: Boolean,
    default: false,
  },
  fee: Number,
  cancel: {
    type: Boolean,
    default: false,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  feedback: {
    type: Boolean,
    default: false,
  },
  review: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("Appointment", appointmentSchema);
