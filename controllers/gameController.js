const db = require("../config/db");

const getGames = (req, res) => {

  db.query(
    "SELECT * FROM juegos",
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      const games = results.map(game => ({
        id: game.id,
        title: game.titulo,
        category: game.categoria,
        price: game.precio,
        image: game.imagen,
        description: game.descripcion,
        stock: game.stock
      }));

      res.json(games);

    }
  );

};

const getGameById = (req, res) => {

  const { id } = req.params;

  db.query(
    "SELECT * FROM juegos WHERE id = ?",
    [id],
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Juego no encontrado"
        });
      }

      const game = results[0];

      res.json({
        id: game.id,
        title: game.titulo,
        category: game.categoria,
        price: game.precio,
        image: game.imagen,
        description: game.descripcion,
        stock: game.stock
      });

    }
  );

};

const createGame = (req, res) => {

  const {
    titulo,
    descripcion,
    categoria,
    precio,
    stock,
    imagen
  } = req.body;

  if (
    !titulo ||
    !descripcion ||
    !categoria ||
    !precio
  ) {
    return res.status(400).json({
      message: "Faltan campos obligatorios"
    });
  }

  db.query(
    `INSERT INTO juegos
    (titulo, descripcion, categoria, precio, stock, imagen)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      titulo,
      descripcion,
      categoria,
      precio,
      stock || 0,
      imagen || null
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Juego agregado correctamente",
        id: result.insertId
      });

    }
  );

};

const updateGame = (req, res) => {

  const { id } = req.params;

  const {
    titulo,
    descripcion,
    categoria,
    precio,
    stock,
    imagen
  } = req.body;

  db.query(
    `UPDATE juegos
    SET
      titulo = ?,
      descripcion = ?,
      categoria = ?,
      precio = ?,
      stock = ?,
      imagen = ?
    WHERE id = ?`,
    [
      titulo,
      descripcion,
      categoria,
      precio,
      stock,
      imagen,
      id
    ],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Juego no encontrado"
        });
      }

      res.json({
        message: "Juego actualizado correctamente"
      });

    }
  );

};

const deleteGame = (req, res) => {

  const { id } = req.params;

  db.query(
    "DELETE FROM juegos WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Juego no encontrado"
        });
      }

      res.json({
        message: "Juego eliminado correctamente"
      });

    }
  );

};

module.exports = {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame
};