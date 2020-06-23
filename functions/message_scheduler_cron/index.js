const axios = require("axios");
const catalyst = require("zcatalyst-sdk-node");
const config = require("./config");
const crypto = require("crypto");

const postToChat = async (cronDetails, context) => {
  try {
    //Init Catalyst Instance
    const app = catalyst.initialize(context);
    //Get rowId of message
    const messageId = cronDetails.getCronParam("ROWID");
    //Get Zuid
    const zuid = cronDetails.getCronParam("zuid");
    //Get Message Details and Access Token
    const messagePromise = getMessageDetails(app, messageId, context);
    const accessTokenPromise = getAccessTokenAndRowId(app, zuid, context);
    const { message, chatId } = await messagePromise;
    const { accessToken, ROWID } = await accessTokenPromise;
    //Checks if all required details are found..
    if (!message && !chatId && !accessToken && !ROWID) {
      throw new Error(
        "Error in getting message chatId Access Token and ROWID..."
      );
    }
    const decryptedMessage = getDecryptedMessage(message, zuid);
    //Post To Chat
    await axios
      .post(
        `https://cliq.zoho.com/api/v2/chats/${chatId}/message`,
        {
          text: decryptedMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Zoho-oauthtoken ${accessToken}`,
          },
        }
      )
      .then(async () => {
        const result = await setIsCompleteStatus(app, messageId, true);
        if (result) {
          context.closeWithSuccess();
        }
      })
      .catch(async (err) => {
        const result = await setIsActiveUser(app, ROWID, false);
        if (result) {
          context.closeWithFailure();
        }
      });
    context.closeWithSuccess();
  } catch (error) {
    console.log(error);
    context.closeWithFailure();
  }
};

const setIsCompleteStatus = async (app, ROWID, isComplete) => {
  try {
    const datastore = app.datastore();
    const table = datastore.table(config.scheduledMessageTableName);
    const updatedRowData = {
      isComplete,
      ROWID,
    };
    const update = await table.updateRow(updatedRowData);
    return update;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const getMessageDetails = async (app, messageId, context) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT zuid, message, chatId FROM ${config.scheduledMessageTableName} WHERE ROWID=${messageId}`;
    const response = await zcql.executeZCQLQuery(query);
    return response.length > 0
      ? response[0][config.scheduledMessageTableName]
      : null;
  } catch (error) {
    context.closeWithFailure();
    console.log(error.message);
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

const getAccessTokenAndRowId = async (app, userId, context) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT accessToken, refreshToken, accessTokenExpires, ROWID FROM ${config.oauthTableName} WHERE zuid=${userId}`;
    const response = await zcql.executeZCQLQuery(query);
    if (!response.length) {
      throw new Error("Cannot find details about that user.");
    }
    let { accessToken, refreshToken, accessTokenExpires, ROWID } = response[0][
      config.oauthTableName
    ];
    if (checkExpire(parseInt(accessTokenExpires), Date.now())) {
      accessToken = getDecryptedMessage(accessToken, userId);
      return { accessToken, ROWID };
    } else {
      refreshToken = getDecryptedMessage(refreshToken, userId);
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
      await updateAccessToken(
        app,
        ROWID,
        access_token,
        expires_in,
        userId,
        context
      );
      return { accessToken: access_token, ROWID };
    }
  } catch (error) {
    context.closeWithFailure();
    console.log(error);
    return { accessToken: null, ROWID: null };
  }
};

const checkExpire = (expiretime, currentTime) => {
  return Math.round(expiretime / 1000) > Math.round(currentTime / 1000);
};

const updateAccessToken = async (
  app,
  ROWID,
  accessToken,
  expires_in,
  zuid,
  context
) => {
  try {
    const datastore = app.datastore();
    const table = datastore.table(config.oauthTableName);
    const accessTokenExpires = Date.now() + parseInt(expires_in) * 1000;
    const updatedRowData = {
      accessToken: getEncryptedMessage(accessToken, zuid),
      accessTokenExpires,
      ROWID,
    };
    await table.updateRow(updatedRowData);
  } catch (error) {
    context.closeWithFailure();
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
