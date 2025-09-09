import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { app } from "./app.js";

import Graduationdb from "./models/collections/Graduation.js";
import Identitydb from "./models/collections/Identity.js";
import Internshipdb from "./models/collections/Internship.js";
import JrSecondarydb from "./models/collections/JrSecondary.js";
import SrSecondarydb from "./models/collections/SrSecondary.js";
import UsableDb from "./models/UsableDatabase.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

function loadJSON(fileName) {
  const filePath = path.join("./Data", fileName);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

const graduation = loadJSON("Graduation.json");
const identity = loadJSON("Identity.json");
const internship = loadJSON("Internship.json");
const jrsecondary = loadJSON("JrSecondary.json");
const srsecondary = loadJSON("SrSecondary.json");

mongoose
  .connect(process.env.MONGO_DB)
  .then(async () => {
    console.log("MongoDB is connected");
    Graduationdb.insertMany(graduation);
    if ((await Identitydb.countDocuments()) === 0) {
      await Identitydb.insertMany(identity);
      await Internshipdb.insertMany(internship);
      await JrSecondarydb.insertMany(jrsecondary);
      await SrSecondarydb.insertMany(srsecondary);
    }
  })
  .catch((err) => {
    console.error("❌ Connection Failed:", err.message);
    process.exit(1);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
