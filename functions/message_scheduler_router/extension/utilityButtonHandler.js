const {
  getResponseTable,
  initViewScheduledMessages,
} = require("../utils/scheduledMessage");
const catalyst = require("zcatalyst-sdk-node");

const utilityButtonHandler = async (req, res, next) => {
  try {
    const key = req.body.params.arguments.key.split("|");
    const userId = req.body.params.user.id;
    const app = catalyst.initialize(req);
    const action = key[0];
    if (action === "DELETE") {
      console.log(key[1]);
    } else {
      let timezone = req.body.params.user.timezone;
      if (timezone === "NST") {
        timezone = "Antarctica/McMurdo";
      } else if (timezone === "IST") {
        timezone = "Asia/Kolkata";
      }
      const page = parseInt(key[1]);
      const limit = parseInt(key[2]);
      const data = await initViewScheduledMessages(app, userId, page, limit);
      const response = getResponseTable(data, timezone, true);
      return res.status(200).json(response);
    }
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

module.exports = utilityButtonHandler;
