const express = require("express");
const userController = require("../controllers/user");

const multiParty = require("connect-multiparty");
const md_auth = require("../middleware/authenticated");
const md_upload_avatar = multiParty({ uploadDir: "./uploads/avatar" });

const api = express.Router();

api.post("/sign-up", userController.signUp);
api.post("/sign-in", userController.signIn);
api.get("/get-users", [md_auth.ensureAuth], userController.getUsers);
api.get(
  "/get-active-users",
  [md_auth.ensureAuth],
  userController.getActiveUsers
);
api.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  userController.uploadAvatar
);
module.exports = api;
