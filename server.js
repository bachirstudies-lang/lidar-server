import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DB_SSL === "true" });

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json({limit: '10mb'})); // augmenter si besoin

// Security: simple API key
const API_KEY = process.env.API_KEY || "change_me";

// Health
app.get("/health", (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// POST /lidar -> receive and store scan
app.post("/lidar", async (req, res) => {
  try {
    const key = req.headers["x-api-key"];
    if (!key || key !== API_KEY) return res.status(401).json({ error: "Unauthorized" });

    const { deviceId, timestamp, scanId, points, metadata } = req.body;
    if (!deviceId || !timestamp || !points) return res.status(400).json({ error: "deviceId, timestamp and points required" });

    const q = `
      INSERT INTO lidar_scans (device_id, scan_id, ts, metadata, points)
      VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at
    `;
    const values = [deviceId, scanId || null, timestamp, metadata || {}, points];
    const result = await pool.query(q, values);
    res.json({ ok: true, id: result.rows[0].id, created_at: result.rows[0].created_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal_error", detail: err.message });
  }
});

// GET /lidar/latest?deviceId=...&limit=5
app.get("/lidar/latest", async (req, res) => {
  try {
    const deviceId = req.query.deviceId;
    const limit = Math.min(parseInt(req.query.limit || "10"), 100);
    const q = deviceId
      ? `SELECT * FROM lidar_scans WHERE device_id = $1 ORDER BY ts DESC LIMIT $2`
      : `SELECT * FROM lidar_scans ORDER BY ts DESC LIMIT $1`;
    const values = deviceId ? [deviceId, limit] : [limit];
    const result = await pool.query(q, values);
    res.json({ ok: true, count: result.rows.length, rows: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
