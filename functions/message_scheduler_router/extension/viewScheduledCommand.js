const catalyst = require("zcatalyst-sdk-node");
const {
  getResponseTable,
  initViewScheduledMessages,
} = require("../utils/scheduledMessage");

const viewScheduledCommand = async (req, res, next) => {
  try {
    const userId = req.body.params.user.id;
    console.log("View scheduled called for "+userId);
    const app = catalyst.initialize(req);
    const executionTimestamp = req.body.timestamp;
    let timezone = req.body.params.user.timezone;
    if (timezone === "NST") {
      timezone = "Antarctica/McMurdo";
    } else if (timezone === "IST") {
      timezone = "Asia/Kolkata";
    }
    const page = 1;
    const limit = 10;
    const data = await initViewScheduledMessages(app, userId, page, limit);
    const response = getResponseTable(
      data,
      timezone,
      false,
      executionTimestamp
    );
    return res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    return res.status(200).json({
      output: {
        type: "banner",
        status: "failure",
        text: "Something went wrong, please try again after some time.",
      },
    });
  }
};

module.exports = viewScheduledCommand;
