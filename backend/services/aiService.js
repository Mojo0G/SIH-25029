import axios from "axios";
import { PY_API_URL } from "../config/constants.js";
import UsableDatabase from "../models/UsableDatabase.js";
import fs from "fs";
import FormData from "form-data";

export class AiService {
  static async verify(filePath, originalName) {
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath), originalName || "upload.png");
    const { data } = await axios.post(`${PY_API_URL}/ai/verify`, form, {
      headers: form.getHeaders(),
      maxBodyLength: Infinity,
    });

    const saved = await UsableDatabase.create({
      institute: "AI",
      type: "Identity Check",
      attachments: { path: filePath, name: originalName },
      content: data,
      verifiedStatus: Boolean(data?.verified),
    });
    return { id: saved._id, ...data };
  }

  static async getById(id) {
    return await UsableDatabase.findById(id).lean().exec();
  }
}


