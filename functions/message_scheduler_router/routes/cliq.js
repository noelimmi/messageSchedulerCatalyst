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
const catalyst = require("zcatalyst-sdk-node");
const config = require("../config");

//Init Router
const router = express.Router();

router.get("/:id", async (req, res) => {
  const app = catalyst.initialize(req);
  const message = await getMessageDetails(app, req.params.id);
  res.send(message);
});

const getMessageDetails = async (app, messageId) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT * FROM ${config.scheduledMessageTableName} WHERE ROWID=${messageId}`;
    const response = await zcql.executeZCQLQuery(query);
    return response.length > 0
      ? response[0][config.scheduledMessageTableName]
      : null;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};

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
