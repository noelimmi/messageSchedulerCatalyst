const express = require("express");
const {
  SCHEDULECOMMAND,
  VIEWSCHEDULEDCOMMAND,
  SCHEDULEMESSAGEACTION,
  SCHEDULEFORMHANDLER,
} = require("../extension/component");
const scheduleMessageAction = require("../extension/scheduleMessageAction");
const scheduleFormHandler = require("../extension/scheduleFormHandler");
const scheduleCommand = require("../extension/scheduleCommand");
const viewScheduledCommand = require("../extension/viewScheduledCommand");

//Init Router
const router = express.Router();

router.post("/callback", async (req, res, next) => {
  try {
    const type = req.body.name;
    switch (type) {
      case SCHEDULECOMMAND:
        scheduleCommand(req, res, next);
        break;
      case VIEWSCHEDULEDCOMMAND:
        viewScheduledCommand(req, res, next);
        break;
      case SCHEDULEMESSAGEACTION:
        scheduleMessageAction(req, res, next);
        break;
      case SCHEDULEFORMHANDLER:
        scheduleFormHandler(req, res, next);
        break;
      default:
        throw new Error("Unknown Component Found");
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
