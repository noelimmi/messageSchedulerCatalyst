const moment = require("moment-timezone");

//@params (datetime:string , timeZoneId:string)
const getEpochTime = (datetime, timeZoneId) =>
  moment.tz(datetime, timeZoneId).unix();

//@params (scheduledEpochTime:number)
const isGreaterThanCurrent = (scheduledEpochTime) =>
  scheduledEpochTime > moment().unix();

//@params (timeZoneId:string)
const getCurrentTimeForTimezone = (timeZoneId) =>
  moment().utc().tz(timeZoneId).format("YYYY-MM-DD[T]HH:mm");

const getTimeInUserTimeZone = (datetime, timeZoneId) =>
  moment
    .utc(datetime, "YYYY-MM-DD HH:mm:ss")
    .tz(timeZoneId)
    .format("YYYY-MM-DD HH:mm:ss");

//@params (unixEpoch:number)
const getDbTime = (unixEpoch) =>
  moment.unix(unixEpoch).utc().format("YYYY-MM-DD HH:mm:ss");

const isLessThanScheduled = (scheduledTime, executionTimestamp) =>
  Math.round(executionTimestamp / 1000) <
  moment.utc(scheduledTime, "YYYY-MM-DD HH:mm:ss").unix();

module.exports = {
  getTimeInUserTimeZone,
  getEpochTime,
  isGreaterThanCurrent,
  getCurrentTimeForTimezone,
  getDbTime,
  isLessThanScheduled,
};
