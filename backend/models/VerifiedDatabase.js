import mongoose from "mongoose";

const schema = new mongoose.Schema({
  id: { type: String, required: true },
  fetchedFrom: { type: String },
  verified: { type: Boolean, default: false },
  refid: { type: String },
  attachments: { type: mongoose.Schema.Types.Mixed },
  content: { type: mongoose.Schema.Types.Mixed },
});

const VerifiedDb = mongoose.model("VerifiedDatabase", schema);

export default VerifiedDb;
