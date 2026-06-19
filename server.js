require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
const ventaRoutes =
require("./routes/ventaRoutes");
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/ventas", ventaRoutes);

app.get("/", (req, res) => {
  res.json({
    mensaje: "PixelStore Backend funcionando 🚀"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});