const cors = require("cors");
const express = require("express");

module.exports = expressApp => {
  expressApp.use(cors());
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({
    extended: true
  }));
};