import jwt from "jsonwebtoken";

export default function authMiddleware(secret) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ error: "Authorization header missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    try {
      const payload = jwt.verify(token, secret);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  };
}
