import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { seedIfEmpty } from "./utils/seedData.js";

import Graduationdb from "./models/collections/Graduation.js";
import Identitydb from "./models/collections/Identity.js";
import Internshipdb from "./models/collections/Internship.js";
import JrSecondarydb from "./models/collections/JrSecondary.js";
import SrSecondarydb from "./models/collections/SrSecondary.js";

const PORT = process.env.PORT || 3000;

async function init() {
  try {
    await connectDatabase();
    // await initRedis(); // Redis disabled
    await seedIfEmpty(Graduationdb, "Graduation.json");
    await seedIfEmpty(Identitydb, "Identity.json");
    await seedIfEmpty(Internshipdb, "Internship.json");
    await seedIfEmpty(JrSecondarydb, "JrSecondary.json");
    await seedIfEmpty(SrSecondarydb, "SrSecondary.json");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Initialization failed:", err.message);
    process.exit(1);
  }
}


init();
