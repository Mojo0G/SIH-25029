import mongoose from "mongoose";
const JrSecondarySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    schoolName: { type: String, required: true },
    yearOfPassing: { type: Number, required: true },
    percentage: { type: Number, required: true },
    verifiedStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.JrSecondaryDatabase ||
  mongoose.model("JrSecondaryDatabase", JrSecondarySchema);
