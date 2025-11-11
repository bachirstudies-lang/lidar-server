import express from "express";
const app = express();
app.use(express.json());

// Route principale
app.get("/", (req, res) => {
  res.send("Serveur Render LiDAR en ligne !");
});

// Route POST /lidar
app.post("/lidar", (req, res) => {
  const data = req.body;
  console.log("Scan reçu :", data);
  res.json({ ok: true, message: "Scan reçu !" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Serveur en marche sur port ${port}`);

  // Boucle d'affichage des paquets
  setInterval(() => {
    console.log("paquet reçu");
    setTimeout(() => {
      console.log("paquet envoyé");
    }, 1000); // 1 seconde après
  }, 3000); // toutes les 3 secondes
});
