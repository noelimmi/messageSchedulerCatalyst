const axios = require("axios");
const catalyst = require("zcatalyst-sdk-node");
const config = require("./config");

const postToChat = async (cronDetails, context) => {
  try {
    //Init Catalyst Instance
    const app = catalyst.initialize(context);
    //Get Params
    const message = cronDetails.getCronParam("message");
    const chatId = cronDetails.getCronParam("chatId");
    const zuid = cronDetails.getCronParam("zuid");
    const scheduledTimestamp = cronDetails.getCronParam("scheduledTimestamp");
    //Get Access Token
    const accessToken = await getAccessToken(app, zuid);
    if (!accessToken) {
      throw new Error("Error in getting Access Token...");
    }
    //Post TO Chat
    const chatRes = await axios.post(
      `https://cliq.zoho.com/api/v2/chats/${chatId}/message`,
      {
        text: message,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    if (chatRes.status !== 200) {
      throw new Error("Post to Chat unsuccessfull");
    }
    context.closeWithSuccess();
  } catch (error) {
    context.closeWithFailure();
    console.log(error);
  }
};

const getAccessToken = async (app, userId) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT * FROM ${config.oauthTableName} WHERE zuid=${userId}`;
    const response = await zcql.executeZCQLQuery(query);
    if (!response.length) {
      throw new Error("Cannot find details about that user.");
    }
    const {
      accessToken,
      refreshToken,
      accessTokenExpires,
      ROWID,
    } = response[0][config.oauthTableName];
    console.log(refreshToken);
    if (checkExpire(parseInt(accessTokenExpires), Date.now())) {
      return accessToken;
    } else {
      const tokenResponse = await axios.post(
        "https://accounts.zoho.com/oauth/v2/token",
        null,
        {
          params: {
            refresh_token: refreshToken,
            grant_type: "refresh_token",
            scope: "ZohoCliq.Webhooks.CREATE",
            client_id: config.client_id,
            client_secret: config.client_secret,
            redirect_uri: config.redirect_uri,
          },
        }
      );
      const { access_token, expires_in } = tokenResponse.data;
      await updateAccessToken(app, ROWID, access_token, expires_in);
      return access_token;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const checkExpire = (expiretime, currentTime) => {
  return Math.round(expiretime / 1000) > Math.round(currentTime / 1000);
};

const updateAccessToken = async (app, ROWID, accessToken, expires_in) => {
  try {
    const datastore = app.datastore();
    const table = datastore.table(config.oauthTableName);
    const accessTokenExpires = Date.now() + parseInt(expires_in) * 1000;
    const updatedRowData = {
      accessToken,
      accessTokenExpires,
      ROWID,
    };
    const updateDbResp = await table.updateRow(updatedRowData);
    console.log(updateDbResp);
  } catch (error) {
    console.log(error);
  }
};

module.exports = postToChat;
