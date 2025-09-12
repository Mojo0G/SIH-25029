export const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_prod";
export const DEMO_ADMIN_USERNAME = process.env.ADMIN_USER || "admin";
export const DEMO_ADMIN_PASSWORD = process.env.ADMIN_PASS || "password";
export const PORT = process.env.PORT || 3000;
export const PY_API_URL = process.env.PY_API_URL || "http://127.0.0.1:8000";
export const CERTIFICATES_DIR = process.env.CERTIFICATES_DIR || `${process.cwd()}/certificates`;
