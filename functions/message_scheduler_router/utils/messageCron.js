const shortid = require("shortid");
const config = require("../config");
const crypto = require("crypto");
const { getDbTime } = require("./dateTime");

const createCron = async (app, cronBody, messageId) => {
  try {
    //scheduledTimestamp
    const { scheduledTimestamp, zuid } = cronBody;
    const { ROWID } = await addToMessageDb(app, cronBody);
    if (ROWID) {
      //Getting Cron Deamon
      const cron = app.cron();
      //Cron Details
      const cronShortId = shortid.generate();
      const cronConfig = {
        cron_function_id: config.cronFunctionId,
        cron_name: cronShortId,
        cron_type: "OneTime",
        status: true,
        cron_url_details: {
          params: {
            ROWID,
            zuid,
            messageId
          },
        },
        job_detail: {
          time_of_execution: parseInt(scheduledTimestamp) * 1000,
        },
      };
      //Create a Cron
      const cronDetails = await cron.createCron(cronConfig);
      console.log("New Cron has been added -> Cron Name:"+cronDetails["cron_name"]+" in scheduledTime "+scheduledTimestamp+" for zuid "+zuid);
      await updateCronId(app, ROWID, cronDetails.id);
    } else {
      throw new Error("Error adding message to Db.");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const updateCronId = async (app, ROWID, cronId) => {
  try {
    const datastore = app.datastore();
    const table = datastore.table(config.scheduledMessageTableName);
    const updatedRowData = {
      ROWID,
      cronId,
    };
    await table.updateRow(updatedRowData);
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const addToMessageDb = async (app, rowData) => {
  try {
    rowData["scheduledTimestamp"] = getDbTime(rowData["scheduledTimestamp"]);
    rowData["message"] = getEncryptedMessage(
      rowData["message"],
      rowData["zuid"]
    );
    rowData["isComplete"] = false;
    const datastore = app.datastore();
    const table = datastore.table(config.scheduledMessageTableName);
    const newRow = await table.insertRow(rowData);
    console.log("New Row has been added -> ROWID:"+newRow["ROWID"]);
    return newRow;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getEncryptedMessage = (text, zuid) => {
  const encryptIv = crypto.createHash("md5").update(zuid).digest("hex");
  let cipher = crypto.createCipheriv(
    config.encryptAlgorithm,
    Buffer.from(config.encryptKey, "hex"),
    Buffer.from(encryptIv, "hex")
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

const getDecryptedMessage = (text, zuid) => {
  const encryptIv = crypto.createHash("md5").update(zuid).digest("hex");
  let decipher = crypto.createDecipheriv(
    config.encryptAlgorithm,
    Buffer.from(config.encryptKey, "hex"),
    Buffer.from(encryptIv, "hex")
  );
  let decrypted = decipher.update(Buffer.from(text, "hex"));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = { createCron, getDecryptedMessage, getEncryptedMessage };
