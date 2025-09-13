import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Serve static files for tampered analysis images
app.use('/api/tampered-images', express.static(path.join(process.cwd(), '..', 'AI', 'ela _outputs')));
app.use('/api/tampered-images', express.static(path.join(process.cwd(), '..', 'AI')));
// Serve images from root directory (for UUID-based images)
app.use('/api/tampered-images', express.static(path.join(process.cwd(), '..')));

app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
});

// Use all routes
app.use("/api", routes);

export { app };
