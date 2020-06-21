const config = require("../config");
const { getDecryptedMessage } = require("./messageCron");
const { getTimeInUserTimeZone } = require("./dateTime");

const getResponseTable = (data, timezoneId, isNavigation) => {
  if (!data.result && !Array.isArray(data.result)) {
    throw new Error("data.result(Array) is not received.");
  }
  let response;
  if (data.result.length > 0) {
    const rowsList = [];
    for (let msg of data.result) {
      let rowObj = {};
      rowObj["Scheduled Time"] = getTimeInUserTimeZone(
        msg["scheduledMessage"]["scheduledTimestamp"],
        timezoneId
      );
      rowObj["Message"] = getDecryptedMessage(
        msg["scheduledMessage"]["message"]
      );
      rowObj["Recipient"] = msg["scheduledMessage"]["chatName"] || "";
      rowObj["Status"] = msg["scheduledMessage"]["isComplete"]
        ? "Sent"
        : `Scheduled [-🗑️](invoke.function|msgSchUtility||DELETE|${msg["scheduledMessage"]["cronId"]}|${msg["scheduledMessage"]["ROWID"]})`;
      rowsList.push(rowObj);
    }
    response = {
      output: {
        text: "### Your scheduled messages",
        card: { theme: "modern-inline" },
        slides: [
          {
            type: "table",
            title: "",
            data: {
              headers: ["Scheduled Time", "Message", "Recipient", "Status"],
              rows: rowsList,
            },
          },
        ],
      },
    };
    if (data.next) {
      response.output.slides[0]["buttons"] = [
        {
          label: "Next",
          hint: "View more messages",
          type: "+",
          action: {
            type: "invoke.function",
            data: {
              name: "msgSchUtility",
            },
          },
          key: `MORE|${data.next.page}|${data.next.limit}`,
        },
      ];
    }
    if (isNavigation) {
      response.output["navigation"] = true;
    }
  } else {
    response = {
      output: {
        text: "*Your have no scheduled messages..*",
        card: { theme: "modern-inline" },
      },
    };
  }
  return response;
};

const initViewScheduledMessages = async (app, userId, page, limit) => {
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const data = {};
    const totalCount = await getTotalMessageCount(app, userId);
    endIndex < totalCount
      ? (data.next = {
          page: page + 1,
          limit,
        })
      : (data.next = null);

    startIndex > 0
      ? (data.previous = {
          page: page - 1,
          limit,
        })
      : (data.previous = null);

    data.result = await findUserPaginatedMessage(
      app,
      userId,
      startIndex,
      limit
    );
    return data;
  } catch (error) {
    console.error(error.message);
    return { next: null, previous: null, result: [] };
  }
};

const getTotalMessageCount = async (app, userId) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT COUNT(zuid) FROM ${config.scheduledMessageTableName} WHERE zuid=${userId}`;
    const queryResponse = await zcql.executeZCQLQuery(query);
    const count =
      queryResponse.length > 0
        ? queryResponse[0][config.scheduledMessageTableName]["zuid"]
        : 0;
    return parseInt(count);
  } catch (e) {
    return null;
  }
};

const findUserPaginatedMessage = async (app, userId, startIndex, limit) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT * FROM ${config.scheduledMessageTableName} WHERE zuid=${userId} ORDER BY scheduledTimestamp DESC LIMIT ${startIndex},${limit}`;
    return await zcql.executeZCQLQuery(query);
  } catch (error) {
    console.log(error.message);
    return [];
  }
};

module.exports = {
  initViewScheduledMessages,
  getResponseTable,
};
