import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { JWT_SECRET, DEMO_ADMIN_USERNAME, DEMO_ADMIN_PASSWORD } from "../config/constants.js";

export class AuthService {
  static async login(username, password) {
    if (!username || !password) {
      throw new Error("username and password required");
    }

    if (username === DEMO_ADMIN_USERNAME) {
      const isPlainMatch = password === DEMO_ADMIN_PASSWORD;
      const isHashedMatch = await bcrypt
        .compare(password, DEMO_ADMIN_PASSWORD)
        .catch(() => false);

      if (!isPlainMatch && !isHashedMatch) {
        throw new Error("invalid credentials");
      }

      const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: "12h" });
      return { token, expiresIn: "12h", user: { username, role: 'admin' } };
    }

    const user = await User.findOne({ username, isActive: true });
    if (!user) {
      throw new Error("invalid credentials");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("invalid credentials");
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ 
      username: user.username, 
      role: user.role,
      userId: user._id 
    }, JWT_SECRET, { expiresIn: "12h" });

    return { 
      token, 
      expiresIn: "12h", 
      user: { 
        username: user.username, 
        email: user.email, 
        role: user.role,
        lastLogin: user.lastLogin
      } 
    };
  }

  static async signup(username, password) {
    if (!username || !password) {
      throw new Error("username and password required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      throw new Error("username already exists");
    }

    // Create new user
    const user = new User({
      username,
      password,
      email: `${username}@example.com`, // Generate a dummy email
      role: 'user'
    });

    await user.save();

    // Generate token for immediate login
    const token = jwt.sign({ 
      username: user.username, 
      role: user.role,
      userId: user._id 
    }, JWT_SECRET, { expiresIn: "12h" });

    return { 
      token, 
      expiresIn: "12h", 
      user: { 
        username: user.username, 
        role: user.role 
      } 
    };
  }

  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("invalid token");
    }
  }
}
