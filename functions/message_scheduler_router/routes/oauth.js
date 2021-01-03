const express = require("express");
const config = require("../config");
const catalyst = require("zcatalyst-sdk-node");
const axios = require("axios");
const { getEncryptedMessage } = require("../utils/messageCron");

//Init Router
const router = express.Router();

router.get("/callback", async (req, res) => {
  try {

    //Get Code and State(User ID);
    const code = req.query.code;
    const state = req.query.state;
    const dc = req.query["location"];
    const iamBaseUrl = req.query["accounts-server"];

    //Request Access and Refresh Token
    const tokenResponse = await axios.post(
      `${iamBaseUrl}/oauth/v2/token`,
      null,
      {
        params: {
          code,
          state,
          grant_type: "authorization_code",
          scope: "ZohoCliq.Webhooks.CREATE",
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: config.redirect_uri,
        },
      }
    );

    //Checks if token response is not 200 then throw error
    if (tokenResponse.status !== 200) {
      throw new Error(
        `Token Request failed with status ${tokenResponse.status}.`
      );
    }

    // destructure access_token,refresh_token
    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    const expireTimestamp = Date.now() + parseInt(expires_in) * 1000;

    //Init catalyst instance and formation of rowData to be inserted
    const app = catalyst.initialize(req);
    const rowData = {
      zuid: state,
      accessToken: getEncryptedMessage(access_token, state),
      refreshToken: getEncryptedMessage(refresh_token, state),
      accessTokenExpires: expireTimestamp,
    };

    //Adding Table Row and then redirecting
    addUpdateUser(app, rowData)
      .then((row) => {
        res.redirect(`${config.baseUrl}/app/success.html?dc=${dc}`);
      })
      .catch((err) => {
        console.error(err);
        res.redirect(`${config.baseUrl}/app/failure.html?dc=${dc}`);
      });
  } catch (error) {
    console.log("Error Occured..");
    console.error(error);
    //Failure Redirect
    return res.redirect(`${config.baseUrl}/app/failure.html`);
  }
});

//add or update user credentials
const addUpdateUser = async (app, rowData) => {
  rowData["isActive"] = true;
  const zcql = app.zcql();
  const datastore = app.datastore();
  const table = datastore.table(config.oauthTableName);
  const query = `SELECT ROWID FROM ${config.oauthTableName} WHERE zuid=${rowData.zuid}`;
  const response = await zcql.executeZCQLQuery(query);
  if (!response.length) {
    return await table.insertRow(rowData);
  } else {
    const { ROWID } = response[0][config.oauthTableName];
    rowData["ROWID"] = ROWID;
    return await table.updateRow(rowData);
  }
};

module.exports = router;
