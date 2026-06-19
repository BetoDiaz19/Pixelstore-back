const express = require("express");

const router = express.Router();

const {
  createVenta,
  getVentasByUser
} = require("../controllers/ventaController");

router.post("/", createVenta);
router.get(
  "/:usuarioId",
  getVentasByUser
);

module.exports = router;