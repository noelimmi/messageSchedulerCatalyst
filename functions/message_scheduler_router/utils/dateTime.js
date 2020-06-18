const moment = require("moment-timezone");

//@params (datetime:string , timeZoneId:string)
const getEpochTime = (datetime, timeZoneId) =>
  moment(datetime).tz(timeZoneId).unix();

//@params (scheduledEpochTime:number)
const isGreaterThanCurrent = (scheduledEpochTime) =>
  scheduledEpochTime > Math.round(Date.now() / 1000);

//@params (timeZoneId:string)
const getCurrentTimeForTimezone = (timeZoneId) =>
  moment().tz(timeZoneId).format("YYYY-MM-DD[T]HH:mm");

module.exports = {
  getEpochTime,
  isGreaterThanCurrent,
  getCurrentTimeForTimezone,
};
