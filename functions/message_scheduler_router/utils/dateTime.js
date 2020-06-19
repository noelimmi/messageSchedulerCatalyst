const moment = require("moment-timezone");

//@params (datetime:string , timeZoneId:string)
const getEpochTime = (datetime, timeZoneId) =>
  moment(datetime).tz(timeZoneId).unix();

//@params (scheduledEpochTime:number)
const isGreaterThanCurrent = (scheduledEpochTime) =>
  scheduledEpochTime > moment().unix();

//@params (timeZoneId:string)
const getCurrentTimeForTimezone = (timeZoneId) =>
  moment().tz(timeZoneId).format("YYYY-MM-DD[T]HH:mm");

//@params (unixEpoch:number)
const getDbTime = (unixEpoch) =>
  moment(unixEpoch * 1000).format("YYYY-MM-DD HH:mm:ss");

module.exports = {
  getEpochTime,
  isGreaterThanCurrent,
  getCurrentTimeForTimezone,
  getDbTime,
};
