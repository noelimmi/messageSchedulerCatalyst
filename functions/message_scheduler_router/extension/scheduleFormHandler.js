const catalyst = require("zcatalyst-sdk-node");
const { isGreaterThanCurrent, getEpochTime } = require("../utils/dateTime");
const { createCron } = require("../utils/messageCron");

const scheduleFormHandler = (req, res, next) => {
  //Get Catalyst Instance
  const app = catalyst.initialize(req);

  const zuid = req.body.params.user.id;
  const chatId = req.body.params.chat.id;

  const { scheduledTime, message } = req.body.params.form.values;

  let { time_zone_id, date_time } = scheduledTime;

  if (time_zone_id === "NST") {
    time_zone_id = "Antarctica/McMurdo";
  } else if (time_zone_id === "IST") {
    time_zone_id = "Asia/Kolkata";
  }
  const scheduledEpochTime = getEpochTime(date_time, time_zone_id);
  if (isGreaterThanCurrent(scheduledEpochTime)) {
    const cronBody = {
      zuid,
      chatId,
      message,
      scheduledTimestamp: scheduledEpochTime,
    };
    //Creating cron in a deattached manner
    setTimeout(() => createCron(app, cronBody), 0);

    return res.status(200).json({
      output: {
        type: "banner",
        status: "success",
        text: "Message has been scheduled successfully.",
      },
    });
  } else {
    return res.status(200).json({
      output: {
        type: "form_error",
        text: "Scheduled time should be ahead of current time.",
        inputs: { name: "scheduledTime" },
      },
    });
  }
};

module.exports = scheduleFormHandler;
