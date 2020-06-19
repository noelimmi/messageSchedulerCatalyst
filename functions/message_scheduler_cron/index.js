const axios = require("axios");
const catalyst = require("zcatalyst-sdk-node");
const config = require("./config");

const postToChat = async (cronDetails, context) => {
  try {
    const app = catalyst.initialize(context);
    //Init Catalyst Instance
    //Get Params
    const message = cronDetails.getCronParam("message");
    const chatId = cronDetails.getCronParam("chatId");
    const zuid = cronDetails.getCronParam("zuid");
    const scheduledTimestamp = cronDetails.getCronParam("scheduledTimestamp");
    //Get Access Token
    const { accessToken, ROWID } = await getAccessTokenAndRowId(app, zuid);
    if (!accessToken) {
      throw new Error("Error in getting Access Token...");
    }
    //Post TO Chat
    axios
      .post(
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
      )
      .then(() => context.closeWithSuccess())
      .catch(async (err) => {
        const result = await setIsActiveUser(app, ROWID, false);
        if (result) {
          context.closeWithFailure();
        }
      });
  } catch (error) {
    console.log(error);
    context.closeWithFailure();
  }
};

const getAccessTokenAndRowId = async (app, userId) => {
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
    if (checkExpire(parseInt(accessTokenExpires), Date.now())) {
      return { accessToken, ROWID };
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
      return { accessToken: access_token, ROWID };
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
    await table.updateRow(updatedRowData);
  } catch (error) {
    console.error(error);
  }
};

const setIsActiveUser = async (app, ROWID, isActive) => {
  try {
    const datastore = app.datastore();
    const table = datastore.table(config.oauthTableName);
    const updatedRowData = {
      isActive,
      ROWID,
    };
    const update = await table.updateRow(updatedRowData);
    return update;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = postToChat;
