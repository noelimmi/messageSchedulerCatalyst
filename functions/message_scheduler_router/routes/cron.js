const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const shortid = require("shortid");
const config = require("../config");

//Init Router
const router = express.Router();

router.post("/createcron", async (req, res) => {
  try {
    const app = catalyst.initialize(req);

    //Destructure JSON Body..
    const { message, zuid, scheduledTimestamp, chatId } = req.body;

    //Check if all required fields exist in body...
    if (!message || !scheduledTimestamp || !chatId || !zuid) {
      return res.status(400).json({
        status: false,
        data: "Please pass all the required params..",
      });
    }

    //Cron Details
    const cronShortId = shortid.generate();

    //Cron Config
    let cronConfig = {
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

    //Getting Cron Deamon
    let cron = app.cron();
    await cron.createCron(cronConfig);

    //send cron details
    return res.status(200).json({
      status: true,
      data: "Cron initiated....",
    });
  } catch (error) {
    console.log("Error Occured..");
    console.error(error);
    const errorMsg =
      error.message ||
      "Internal server error occurred. Please try again in some time.";
    return res.status(500).send({
      status: false,
      data: errorMsg,
    });
  }
});

module.exports = router;
