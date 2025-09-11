import mongoose from "mongoose";
const UsableSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: false },
    institute: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "Identity Check",
        "10Th Marksheet",
        "12Th Marksheet",
        "Internship",
        "Graduation",
      ],
      required: true,
    },
    year: { type: Number },
    attachments: { type: mongoose.Schema.Types.Mixed },
    content: { type: mongoose.Schema.Types.Mixed },
    verifiedStatus: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.UsableDatabase ||
  mongoose.model("UsableDatabase", UsableSchema);
