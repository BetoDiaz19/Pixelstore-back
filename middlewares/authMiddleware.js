const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const authHeader =
    req.header("Authorization");

  if (!authHeader) {

    return res.status(401).json({
      message: "Acceso denegado"
    });

  }

  const token =
    authHeader.replace(
      "Bearer ",
      ""
    );

  try {

    const verified =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.user = verified;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Token inválido"
    });

  }

};

module.exports = authMiddleware;