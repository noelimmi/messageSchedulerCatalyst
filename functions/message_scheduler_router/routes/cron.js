const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const shortid = require('shortid');

//Init Router
const router = express.Router();

router.post("/createcron", async (req, res) => {
  try {
    const app = catalyst.initialize(req);

    //Destructure JSON Body..
    const {
      message,
      webhookUrl,
      scheduledTimestamp,
      sender,
      recipientType,
      recipient
    } = req.body;

    //Check if all required fields exist in body...
    if (!message || !webhookUrl || !scheduledTimestamp || !sender || !recipientType || !recipient) {
      return res.status(400).json({
        status: false,
        data: "Please pass all the required params.."
      });
    }

    //Cron Details
    const cronShortId = shortid.generate();
    let cronBody = {
      sender,
      recipientType,
      recipient,
      message,
      cronShortId,
    };

    //Cron Config
    let cronConfig = {
      cron_name: cronShortId,
      cron_type: "OneTime",
      status: true,
      cron_url_details: {
        url: webhookUrl,
        request_method: "POST",
        headers: {
          "content-Type": "application/json"
        },
        request_body: JSON.stringify(cronBody)
      },
      job_detail: {
        time_of_execution: parseInt(scheduledTimestamp)
      }
    };

    //Getting Cron Deamon
    let cron = app.cron();
    let oneTimeCron = cron.createCron(cronConfig);
    oneTimeCron.then((response) => {
      response["cronShortId"] = cronShortId
    });

    //send cron details
    return res.status(200).json({
      status: true,
      data: "Cron initiated...."
    });

  } catch (error) {
    console.log("Error Occured..");
    console.error(error);
    const errorMsg = error.message || "Internal server error occurred. Please try again in some time.";
    return res.status(500).send({
      "status": false,
      "data": errorMsg,
    });
  }
});

module.exports = router;