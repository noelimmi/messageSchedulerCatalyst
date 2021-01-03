const catalyst = require("zcatalyst-sdk-node");
const { getCurrentTimeForTimezone } = require("../utils/dateTime");
const { findUser, isActiveUser } = require("../utils/user");
const { getScheduledForm, getChatTitle } = require("../utils/scheduleForm");
const config = require("../config");

const scheduleCommand = async (req, res, next) => {
  const userId = req.body.params.user.id;
  const app = catalyst.initialize(req);
  const user = await findUser(app, userId);
  if (isActiveUser(user)) {
    let message = "";
    let messageId = "";
    if (req.body.params.arguments) {
      message = req.body.params.arguments.slice(0, 1000);
    }
    if (req.body.params.message) {
      messageId = req.body.params.message.id;
    }
    let hint = "";
    const chatTitle = getChatTitle(req.body.params.chat);
    if (chatTitle) {
      hint = `Schedule message to ${chatTitle}`;
    }
    //Setting date time bug fix
    const datetime = {};
    const timezone = req.body.params.user.timezone;
    if (timezone === "NST") {
      datetime.date_time = getCurrentTimeForTimezone("Antarctica/McMurdo");
      datetime.time_zone_id = "Antarctica/McMurdo";
    } else if (timezone === "IST") {
      datetime.date_time = getCurrentTimeForTimezone("Asia/Kolkata");
      datetime.time_zone_id = "Asia/Kolkata";
    }
    const scheduledForm = getScheduledForm(hint, message, datetime, messageId);
    //Sending form as response.
    return res.status(200).json(scheduledForm);
  } else {
    const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCliq.Webhooks.CREATE&client_id=${config.client_id}&state=${userId}&response_type=code&redirect_uri=${config.redirect_uri}&access_type=offline&prompt=consent`;
    return res.status(200).json({
      output: {
        text:
          "It seems like you haven't yet connected *message scheduler* with *cliq* . Click *Connect* below to proceed further.",
        card: { theme: "modern-inline" },
        buttons: [
          {
            label: "Connect",
            hint: "Connect message scheduler with cliq",
            type: "+",
            action: { type: "open.url", data: { web: authUrl } },
          },
        ],
      },
    });
  }
}

module.exports = scheduleCommand;
