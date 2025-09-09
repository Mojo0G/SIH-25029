import mongoose from "mongoose";

const schema = new mongoose.Schema({
  institute: { type: String, required: true },
  type: { type: String, enum: ["Identity Check","10Th Marksheet", "12Th Marksheet", "Internship","Graduation"] },
  year: { type: Number },
  attachments: { type: mongoose.Schema.Types.Mixed },
  content: { type: mongoose.Schema.Types.Mixed }
});

const UsableDb = mongoose.model("UsableDatabase", schema);

export default UsableDb;