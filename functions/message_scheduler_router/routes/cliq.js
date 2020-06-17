const express = require("express");
const { MESSAGEACTION, FUNCTION, COMMAND } = require("../extension/type");
const messageActionHandler = require("../extension/messageActionHandler");
const formSubmitHandler = require("../extension/formSubmitHandler");
const commadExecutionHandler = require("../extension/commadExecutionHandler");

//Init Router
const router = express.Router();

router.post("/callback", async (req, res, next) => {
  try {
    const type = req.body.type;
    switch (type) {
      case MESSAGEACTION:
        messageActionHandler(req, res, next);
        break;
      case COMMAND:
        commadExecutionHandler(req, res, next);
        break;
      case FUNCTION:
        formSubmitHandler(req, res, next);
        break;
      default:
        throw new Error("Type not specified in body");
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      output: {
        type: "banner",
        status: "failure",
        text: "Something went wrong. Please try again after some time.",
      },
    });
  }
});

module.exports = router;
