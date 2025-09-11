import mongoose from "mongoose";
const InternshipSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    studentName: { type: String, required: true },
    companyName: { type: String, required: true },
    internshipStart: { type: Date, required: true },
    internshipEnd: { type: Date, required: true },
    role: { type: String, required: true },
    certificateId: { type: String, required: true },
    verifiedStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.InternshipDatabase ||
  mongoose.model("InternshipDatabase", InternshipSchema);
