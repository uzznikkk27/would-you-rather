import express from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import compression from "compression";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));
app.use(compression());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

// Read questions fresh each time so you can update the JSON without restarting
app.get("/questions", (req, res) => {
  const questionsPath = path.join(__dirname, "questions.json");
  fs.readFile(questionsPath, "utf-8", (err, data) => {
    if (err) {
      console.error("Failed to read questions:", err);
      return res.status(500).json({ error: "Failed to load questions" });
    }
    try {
      const parsed = JSON.parse(data);
      return res.json(parsed);
    } catch (e) {
      console.error("Invalid questions.json:", e);
      return res.status(500).json({ error: "Invalid questions format" });
    }
  });
});

// Fallback to index.html for unknown routes (single-page app behavior)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Would You Rather server running on http://localhost:${PORT}`);
});
