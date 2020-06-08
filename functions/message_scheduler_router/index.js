const express = require("express");
const cronRoute = require("./routes/cron");
const applyMiddleware = require("./middleware");

//Init Express App
const expressApp = express();


//Apply Middleware
applyMiddleware(expressApp);


//Routes
expressApp.use("/cron", cronRoute);


module.exports = expressApp;