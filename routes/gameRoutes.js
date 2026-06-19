const authMiddleware =
require("../middlewares/authMiddleware");

const roleMiddleware =
require("../middlewares/roleMiddleware");
const express = require("express");

const router = express.Router();

const {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
} = require("../controllers/gameController");

router.get("/", getGames);
router.get("/:id", getGameById);
router.post(
  "/",
  authMiddleware,
  roleMiddleware,
  createGame
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware,
  updateGame
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware,
  deleteGame
);

module.exports = router;