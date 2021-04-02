const jwt = require("jwt-simple");
const moment = require("moment");

const SECRET_KEY = "3koemLc3ImVcf4mfzVaTsDde";

const ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "La peticion no tiene cabecera de auth" });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    let payload = jwt.decode(token, SECRET_KEY);
    if (payload.exp <= moment.unix()) {
      return res.status(404).send({ message: "El token ha expirado" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).send({ message: err });
  }
};

module.exports = {
  ensureAuth,
};
