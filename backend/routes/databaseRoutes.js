import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Helper function to read JSON data files
const readJsonData = (filename) => {
  try {
    const filePath = path.join(process.cwd(), "data", filename);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
};

// Route to get all graduation records
router.get("/graduation", (req, res) => {
  try {
    const data = readJsonData("Graduation.json");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch graduation data" });
  }
});

// Route to get all internship records
router.get("/internship", (req, res) => {
  try {
    const data = readJsonData("Internship.json");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch internship data" });
  }
});

// Route to get all identity records
router.get("/identity", (req, res) => {
  try {
    const data = readJsonData("Identity.json");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch identity data" });
  }
});

// Route to get all junior secondary records
router.get("/jrsecondary", (req, res) => {
  try {
    const data = readJsonData("JrSecondary.json");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch junior secondary data" });
  }
});

// Route to get all senior secondary records
router.get("/srsecondary", (req, res) => {
  try {
    const data = readJsonData("SrSecondary.json");
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch senior secondary data" });
  }
});

// Route to search across all databases
router.get("/search", (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ error: "Name parameter is required" });
    }

    const searchName = name.toLowerCase();
    const results = [];

    // Search in all databases
    const databases = [
      { name: "graduation", data: readJsonData("Graduation.json") },
      { name: "internship", data: readJsonData("Internship.json") },
      { name: "identity", data: readJsonData("Identity.json") },
      { name: "jrsecondary", data: readJsonData("JrSecondary.json") },
      { name: "srsecondary", data: readJsonData("SrSecondary.json") }
    ];

    databases.forEach(db => {
      const matches = db.data.filter(item => 
        item.studentName?.toLowerCase().includes(searchName) ||
        item.name?.toLowerCase().includes(searchName)
      );
      
      if (matches.length > 0) {
        results.push({
          database: db.name,
          matches: matches
        });
      }
    });

    res.json({
      searchTerm: name,
      totalMatches: results.reduce((sum, result) => sum + result.matches.length, 0),
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to search databases" });
  }
});

export default router;
