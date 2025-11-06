import express from "express";
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Serveur Render LiDAR en ligne !");
});

app.post("/lidar", (req, res) => {
  const data = req.body;
  console.log("Scan reçu :", data);
  res.json({ ok: true, message: "Scan reçu !" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en marche sur port ${port}`);
});
