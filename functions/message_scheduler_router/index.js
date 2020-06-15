const express = require("express");
const cronRoute = require("./routes/cron");
const oauthRoute = require("./routes/oauth");
const applyMiddleware = require("./middleware");

//Init Express App
const expressApp = express();


//Apply Middleware
applyMiddleware(expressApp);


//Routes
expressApp.use("/cron", cronRoute);
expressApp.use("/oauth",oauthRoute);


module.exports = expressApp;