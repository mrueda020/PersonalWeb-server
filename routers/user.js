const express = require("express");
const userController = require("../controllers/user");
const md_auth = require("../middleware/authenticated");
const api = express.Router();

api.post("/sign-up", userController.signUp);
api.post("/sign-in", userController.signIn);
api.get("/get-users", [md_auth.ensureAuth], userController.getUsers);
api.get(
  "/get-active-users",
  [md_auth.ensureAuth],
  userController.getActiveUsers
);
module.exports = api;
