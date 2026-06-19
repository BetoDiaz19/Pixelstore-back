require("dotenv").config();
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,          // ¡Nuevo! Le dice a qué puerto tocar
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {                              // ¡Nuevo! Obligatorio para entrar a Aiven
    rejectUnauthorized: false
  }
});

connection.connect((error) => {
  if (error) {
    console.error("❌ Error al conectar MySQL:", error);
  } else {
    console.log("✅ Conectado a MySQL");
  }
});

module.exports = connection;
