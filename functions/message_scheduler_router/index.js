const express = require("express");
const oauthRoute = require("./routes/oauth");
const cliqRoute = require("./routes/cliq");
const applyMiddleware = require("./middleware");

//Init Express App
const expressApp = express();

//Apply Middleware
applyMiddleware(expressApp);

//Routes
expressApp.use("/oauth", oauthRoute);
expressApp.use("/cliq", cliqRoute);

module.exports = expressApp;
