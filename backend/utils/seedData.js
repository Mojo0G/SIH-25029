import fs from "fs";
import path from "path";

export function loadJSON(fileName) {
  const filePath = path.join("./data", fileName);
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

export async function seedIfEmpty(model, filename) {
  const count = await model.countDocuments();
  if (count === 0) {
    const data = loadJSON(filename);
    if (Array.isArray(data) && data.length > 0) {
      await model.insertMany(data);
    }
  }
}
