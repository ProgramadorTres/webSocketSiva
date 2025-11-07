import jwt from "jsonwebtoken";

function validateToken(req, res, next) {
  const accesToken = req.headers["authorization"];
  if (!accesToken) res.send("acceso denegado");
  jwt.verify(accesToken, process.env.SECRET, (err, user) => {
    if (err) {
      res.send("Acceso denegado , el token expiro o es incorrecto");
    } else {
      next();
    }
  });
}

export default validateToken;
