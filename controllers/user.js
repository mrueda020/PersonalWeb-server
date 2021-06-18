const bcrypt = require("bcrypt-nodejs");
const User = require("../models/user");
const jwt = require("../services/jwt");

const fs = require("fs");
const path = require("path");

const signUp = (req, res) => {
  const user = new User();
  const { name, lastname, email, password, repeatPassword } = req.body;
  user.name = name;
  user.lastname = lastname;
  user.email = email;
  user.role = "admin";
  user.active = false;

  if (!password || !repeatPassword) {
    res.status(404).send({ message: "No hay contraseña" });
  } else {
    if (password !== repeatPassword) {
      res.status(404).send({ message: "Las contraseñas no coinciden" });
    } else {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) {
          res.status(500).send({ message: "Error al encriptar la contraseña" });
        } else {
          user.password = hash;
          user.save((err, userStored) => {
            if (err) {
              res.status(500).send({ message: "Error en el servidor" });
            } else {
              if (!userStored) {
                res.status(404).send({ message: "Error al crear el usuario" });
              } else {
                res.status(200).send({ user: userStored });
              }
            }
          });
        }
      });
    }
  }
};

const signIn = (req, res) => {
  const pararms = req.body;
  const password = pararms.password;
  const email = pararms.email;
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error del servidor" });
    } else {
      if (!userStored) {
        res.status(400).send({ message: "Usuario no encontrado" });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error del servidor" });
          } else if (!check) {
            res.status(404).send({ message: "Contraseña incorrecta" });
          } else {
            if (!userStored.active) {
              res.status(200).send({ code: 200, message: "Usuario inactivo" });
            } else {
              res.status(200).send({
                accessToken: jwt.createAccessToken(userStored),
                refreshToken: jwt.createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
};

const getUsers = (req, res) => {
  console.log(req);
  User.find().then((users) => {
    if (!users) {
      res.status(404).send({ message: "No hay usuarios" });
    } else {
      res.status(200).send({ users });
    }
  });
};

const getActiveUsers = (req, res) => {
  const query = req.query;
  User.find({ active: query.active }).then((users) => {
    if (!users) {
      res.status(404).send({ message: "No hay usuarios" });
    } else {
      res.status(200).send({ users });
    }
  });
};

const uploadAvatar = async (req, res) => {
  const params = req.params;

  try {
    const user = await User.findById({ _id: params.id });
    if (req.files) {
      let filePath = String(req.files.avatar.path);
      let fileSplit = filePath.split("\\");
      let fileName = fileSplit[2];
      let extension = fileName.split(".");
      let fileExtension = extension[1];
      if (fileExtension !== "png" && fileExtension !== "jpg") {
        console.log(fileExtension);
        res.status(500).send({
          message: "Img no valida solo se permite archivos jpg y png",
        });
      }
      user.avatar = fileName;
      User.findByIdAndUpdate({ _id: params.id }, user, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        if (!result) {
          res.status(404).send({ message: "Usuario no encontrado" });
        }
        res.status(200).send({ message: result });
      });
    }
  } catch (err) {
    res.status(500).send({ message: "Error" });
  }
};

const getAvatar = (req, res) => {
  console.log(req.params);
  const avatarName = req.params.avatarName;
  const filePath = "./uploads/avatar/" + avatarName;

  fs.stat(filePath, (error, stats) => {
    if (error) {
      res.status(500).send({ message: "No existe el avatar" });
    }
    res.sendFile(path.resolve(filePath));
  });
};

const updateUser = async (req, res) => {
  let userData = req.body;
  const pararms = req.params;

  if (userData.password) {
    await bcrypt.hash(userData.password, null, null, (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Error en el servidor" });
      } else {
        userData.password = hash;
      }
    });
  }
  User.findByIdAndUpdate({ _id: pararms.id }, userData, (err, userUpdate) => {
    if (err) {
      res.status(500).send({ message: "Error en el servidor" });
    } else {
      if (!userUpdate) {
        res.status(404).send({ message: "No existe el usuario" });
      } else {
        res.status(200).send({ message: "Usuario actualizado" });
      }
    }
  });
};

module.exports = {
  signUp,
  signIn,
  getUsers,
  getActiveUsers,
  uploadAvatar,
  getAvatar,
  updateUser,
};
