const catalyst = require("zcatalyst-sdk-node");
const {
  getResponseTable,
  initViewScheduledMessages,
} = require("../utils/scheduledMessage");

const viewScheduledCommand = async (req, res, next) => {
  try {
    const userId = req.body.params.user.id;
    const app = catalyst.initialize(req);
    let timezone = req.body.params.user.timezone;
    if (timezone === "NST") {
      timezone = "Antarctica/McMurdo";
    } else if (timezone === "IST") {
      timezone = "Asia/Kolkata";
    }
    const data = await initViewScheduledMessages(app, userId, 1, 3);
    const response = getResponseTable(data, timezone, false);
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
