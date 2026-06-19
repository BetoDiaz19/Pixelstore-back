const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    db.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
      async (err, results) => {

        if (err) {
          return res.status(500).json(err);
        }

        if (results.length > 0) {
          return res.status(400).json({
            message: "El correo ya está registrado"
          });
        }

        const hashedPassword =
          await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO usuarios
          (nombre,email,password)
          VALUES (?,?,?)`,
          [nombre, email, hashedPassword],
          (err, result) => {

            if (err) {
              return res.status(500).json(err);
            }

            res.status(201).json({
              message: "Usuario registrado correctamente"
            });

          }
        );

      }
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const login = (req, res) => {

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    async (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(400).json({
          message: "Usuario no encontrado"
        });
      }

      const user = results[0];

      const validPassword =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!validPassword) {
        return res.status(400).json({
          message: "Contraseña incorrecta"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          rol: user.rol
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h"
        }
      );

      res.json({
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        }
      });

    }
  );

};

const getProfile = (req, res) => {

  db.query(
    "SELECT id, nombre, email, rol FROM usuarios WHERE id = ?",
    [req.user.id],
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Usuario no encontrado"
        });
      }

      res.json(results[0]);

    }
  );

};

module.exports = {
  register,
  login,
  getProfile
};