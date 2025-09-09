import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: {type: Number},
  institute: { type: String, required: true },
  type: { type: String, enum: ["Identity Check","10Th Marksheet", "12Th Marksheet", "Internship","Graduation"] },
  duration: { type: Number },
  validTill: { type: Number },
  verifiedStatus: { type: Boolean}
});

const Identitydb = mongoose.model("IdentityDatabase", schema);

export default Identitydb;