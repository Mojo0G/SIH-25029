import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { app } from "./app.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// import { createClient } from "redis"; // 🔴 Redis disabled

import Graduationdb from "./models/collections/Graduation.js";
import Identitydb from "./models/collections/Identity.js";
import Internshipdb from "./models/collections/Internship.js";
import JrSecondarydb from "./models/collections/JrSecondary.js";
import SrSecondarydb from "./models/collections/SrSecondary.js";

import authMiddleware from "./middleware/auth.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_DB;
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_prod";
// const REDIS_URL = process.env.REDIS_URL || null; // Redis disabled
const DEMO_ADMIN_USERNAME = process.env.ADMIN_USER || "admin";
const DEMO_ADMIN_PASSWORD = process.env.ADMIN_PASS || "password";

function loadJSON(fileName) {
  const filePath = path.join("./Data", fileName);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

/*
// Redis init
let redisClient = null;
async function initRedis() {
  if (!REDIS_URL) {
    console.log("REDIS_URL not set — Redis caching disabled.");
    return;
  }
  redisClient = createClient({ url: REDIS_URL });
  redisClient.on("error", (err) => console.error("Redis Client Error", err));
  await redisClient.connect();
  console.log("Redis connected");
}

// Redis utils
async function getCache(key) {
  if (!redisClient) return null;
  try {
    const val = await redisClient.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}
async function setCache(key, data, ttlSeconds = 60) {
  if (!redisClient) return;
  try {
    await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
  } catch {}
}
async function delCache(key) {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch {}
}
----------------------------------------------------- */

async function seedIfEmpty(model, filename) {
  const count = await model.countDocuments();
  if (count === 0) {
    const data = loadJSON(filename);
    if (Array.isArray(data) && data.length > 0) {
      await model.insertMany(data);
    }
  }
}

async function init() {
  if (!MONGODB_URI) {
    console.error("❌ MONGO_DB not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB is connected");
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

app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  if (username !== DEMO_ADMIN_USERNAME)
    return res.status(401).json({ error: "invalid credentials" });

  const isPlainMatch = password === DEMO_ADMIN_PASSWORD;
  const isHashedMatch = await bcrypt
    .compare(password, DEMO_ADMIN_PASSWORD)
    .catch(() => false);

  if (!isPlainMatch && !isHashedMatch)
    return res.status(401).json({ error: "invalid credentials" });

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
  res.json({ token, expiresIn: "12h" });
});

app.get("/graduation", async (req, res) => {
  try {
    // const cacheKey = "graduation:all";
    // const cached = await getCache(cacheKey);
    // if (cached) return res.json(cached);
    const data = await Graduationdb.find().lean().exec();
    // await setCache(cacheKey, data, 60);
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch graduation data" });
  }
});

app.get("/graduation/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // const cacheKey = `graduation:${id}`;
    // const cached = await getCache(cacheKey);
    // if (cached) return res.json(cached);
    const doc = await Graduationdb.findOne({ id: Number(id) })
      .lean()
      .exec();
    if (!doc) return res.status(404).json({ error: "Not found" });
    // await setCache(cacheKey, doc, 300);
    res.json(doc);
  } catch {
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

app.post("/graduation", authMiddleware(JWT_SECRET), async (req, res) => {
  try {
    const created = await Graduationdb.create(req.body);
    // await delCache("graduation:all");
    res.status(201).json(created);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to create record", details: err.message });
  }
});

app.put("/graduation/:id", authMiddleware(JWT_SECRET), async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Graduationdb.findOneAndUpdate(
      { id: Number(id) },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    // await delCache("graduation:all");
    // await delCache(`graduation:${id}`);
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
});

app.delete("/graduation/:id", authMiddleware(JWT_SECRET), async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await Graduationdb.findOneAndDelete({ id: Number(id) });
    if (!removed) return res.status(404).json({ error: "Not found" });
    // await delCache("graduation:all");
    // await delCache(`graduation:${id}`);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

app.get("/internships", async (req, res) => {
  try {
    const data = await Internshipdb.find().lean().exec();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch internships" });
  }
});

app.get("/identity", async (req, res) => {
  try {
    const data = await Identitydb.find().lean().exec();
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch identities" });
  }
});

init();
