import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_SECRET, DEMO_ADMIN_USERNAME, DEMO_ADMIN_PASSWORD } from "../config/constants.js";

export class AuthService {
  static async login(username, password) {
    if (!username || !password) {
      throw new Error("username and password required");
    }

    if (username !== DEMO_ADMIN_USERNAME) {
      throw new Error("invalid credentials");
    }

    const isPlainMatch = password === DEMO_ADMIN_PASSWORD;
    const isHashedMatch = await bcrypt
      .compare(password, DEMO_ADMIN_PASSWORD)
      .catch(() => false);

    if (!isPlainMatch && !isHashedMatch) {
      throw new Error("invalid credentials");
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "12h" });
    return { token, expiresIn: "12h" };
  }
}
