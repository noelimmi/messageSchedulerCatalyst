const getChatTitle = require("../utils/getChatTitle");
const { getCurrentTimeForTimezone } = require("../utils/dateTime");
const getScheduledForm = require("../utils/getScheduledForm");

const scheduleMessageAction = (req, res, next) => {
  let message = "";
  if (req.body.params.message && req.body.params.message.text) {
    message = req.body.params.message.text.slice(0, 1000);
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
  const scheduledForm = getScheduledForm(hint, message, datetime);
  return res.status(200).json(scheduledForm);
};

module.exports = scheduleMessageAction;
