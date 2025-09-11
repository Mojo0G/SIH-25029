import mongoose from "mongoose";
const IdentitySchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true, required: true },
    studentName: { type: String, required: true },
    documentType: { type: String, required: true },
    documentNumber: { type: String, required: true },
    issuingAuthority: { type: String },
    validTill: { type: Number },
    verifiedStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.IdentityDatabase ||
  mongoose.model("IdentityDatabase", IdentitySchema);
