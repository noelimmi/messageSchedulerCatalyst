const { isGreaterThanCurrent, getEpochTime } = require("../utils/dateTime");

const scheduleFormHandler = (req, res, next) => {
  let { time_zone_id, date_time } = req.body.params.form.values.scheduledTime;

  if (time_zone_id === "NST") {
    time_zone_id = "Antarctica/McMurdo";
  } else if (time_zone_id === "IST") {
    time_zone_id = "Asia/Kolkata";
  }
  const scheduledEpochTime = getEpochTime(date_time, time_zone_id);
  if (isGreaterThanCurrent(scheduledEpochTime)) {
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
