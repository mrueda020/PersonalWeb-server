const express = require("express");
const userController = require("../controllers/user");

const api = express.Router();

api.post("/sign-up", userController.signUp);
api.post("/sign-in", userController.signIn);

module.exports = api;
