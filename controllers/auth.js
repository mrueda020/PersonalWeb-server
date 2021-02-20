const jwt = require("../services/jwt");
const moment = require("moment");
const User = require("../models/user");

const checkExpiredToken = (token) => {
  const { exp } = jwt.decodeToken(token);
  const currentDate = moment.unix();

  return currentDate > exp ? true : false;
};

const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;
  const isTokenExpired = checkExpiredToken(refreshToken);
  if (!isTokenExpired) {
    res.status(404).send({ message: "El token ha expirado" });
  } else {
    const { id } = jwt.decodeToken(refreshToken);
    User.findOne({ _id: id }, (err, UserStored) => {
      if (err) {
        res.status(500).send({ message: "Server Error" });
      } else {
        if (!UserStored) {
          res.status(404).send({ message: "Usuario no encontrado" });
        } else {
          res.status(200).send({
            accessToken: jwt.createAccessToken(UserStored),
            refreshToken: refreshToken,
          });
        }
      }
    });
  }
};

module.exports = {
  refreshAccessToken,
};
