import mongoose from "mongoose";
const SrSecondarySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    studentName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    institutionName: { type: String, required: true },
    yearOfPassing: { type: Number, required: true },
    percentage: { type: Number, required: true },
    stream: { type: String, required: true },
    verifiedStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.SrSecondaryDatabase ||
  mongoose.model("SrSecondaryDatabase", SrSecondarySchema);
