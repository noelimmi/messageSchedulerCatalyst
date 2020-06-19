const shortid = require("shortid");
const config = require("../config");

const createCron = async (app, cronBody) => {
  try {
    //Getting Cron Deamon
    const cron = app.cron();
    //Destructure cronBody..
    const { message, zuid, scheduledTimestamp, chatId } = cronBody;
    //Cron Details
    const cronShortId = shortid.generate();
    const cronConfig = {
      cron_function_id: config.cronFunctionId,
      cron_name: cronShortId,
      cron_type: "OneTime",
      status: true,
      cron_url_details: {
        params: {
          message,
          chatId,
          zuid,
          scheduledTimestamp,
        },
      },
      job_detail: {
        time_of_execution: parseInt(scheduledTimestamp),
      },
    };
    //Create a Cron
    const cronDetails = await cron.createCron(cronConfig);
    return cronDetails;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

module.exports = { createCron };
