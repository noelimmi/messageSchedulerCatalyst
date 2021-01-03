const catalyst = require("zcatalyst-sdk-node");
const { findUser, isActiveUser } = require("../utils/user");
const { getScheduledForm, getChatTitle } = require("../utils/scheduleForm");
const { getCurrentTimeForTimezone } = require("../utils/dateTime");
const { CommonUtil } = require("../utils/commonUtil");

const scheduleMessageAction = async (req, res, next) => {
  const userId = req.body.params.user.id;
  const app = catalyst.initialize(req);
  //Finding user and checking if user is active
  const user = await findUser(app, userId);
  if (isActiveUser(user)) {
    let message = "";
    let messageId = "";
    if (req.body.params.message) {
      messageId = req.body.params.message.id;
    }
    let hint = "";
    const chatTitle = getChatTitle(req.body.params.chat);
    if (chatTitle) {
      hint = `Schedule message to ${chatTitle}`;
    }
    const datetime = {};
    const timezone = req.body.params.user.timezone;
    if (timezone === "NST") {
      datetime.date_time = getCurrentTimeForTimezone("Antarctica/McMurdo");
      datetime.time_zone_id = "Antarctica/McMurdo";
    } else if (timezone === "IST") {
      datetime.date_time = getCurrentTimeForTimezone("Asia/Kolkata");
      datetime.time_zone_id = "Asia/Kolkata";
    }
    const scheduledForm = getScheduledForm(hint, message, datetime,messageId);
    return res.status(200).json(scheduledForm);
  } else {
    let dc = "US";
    if (req.body.params.environment) {
      dc = req.body.params.environment.data_center;
    }
    return res.status(200).json(CommonUtil.getConnectionResponse(dc,userId));
  }
};

module.exports = scheduleMessageAction;
