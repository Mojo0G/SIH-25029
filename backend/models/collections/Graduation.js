import mongoose from "mongoose";
const GraduationSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    institutionName: { type: String, required: true },
    course: { type: String, required: true },
    cgpa: { type: Number, required: true },
    verifiedStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.GraduationDatabase ||
  mongoose.model("GraduationDatabase", GraduationSchema);
