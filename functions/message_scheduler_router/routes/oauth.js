const express = require("express");
const config = require("../config");
const catalyst = require("zcatalyst-sdk-node");
const axios = require("axios");

//Init Router
const router = express.Router();

router.get("/checkUser/:userId", async (req, res) => {
  try {
    const app = catalyst.initialize(req);
    const dbResponse = await checkUser(app, req.params.userId);
    let isExist = false;
    if (dbResponse.length > 0) {
      isExist = true;
    }
    return res.status(200).send({ status: true, isExist });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, isExist: false });
  }
});

router.get("/callback", async (req, res) => {
  try {
    //Get Code and State(User ID);
    const code = req.query.code;
    const state = req.query.state;

    //Request Access and Refresh Token
    const tokenResponse = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      null,
      {
        params: {
          code,
          state,
          grant_type: "authorization_code",
          scope: "ZohoCliq.Webhooks.CREATE,ZohoCliq.Users.READ",
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: config.redirect_uri,
        },
      }
    );

    //Checks if token response is not 200 then throw error
    if (tokenResponse.status !== 200)
      throw new Error(
        `Token Request failed with status ${tokenResponse.status}.`
      );

    // destructure access_token,refresh_token
    const { access_token, refresh_token } = tokenResponse.data;

    const userDetailsResponse = await axios.get(
      `https://cliq.zoho.com/api/v2/users/${state}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    //Checks if user details response is not 200 then throw error
    if (userDetailsResponse.status !== 200) {
      throw new Error(
        `Get User Request failed with status ${userDetailsResponse.status}.`
      );
    }

    //Get User Id;
    const zuid = userDetailsResponse.data.data.id;

    //Init catalyst instance and formation of rowData to be inserted
    const app = catalyst.initialize(req);
    const rowData = {
      zuid,
      accessToken: access_token,
      refreshToken: refresh_token,
    };

    //Adding Table Row in deattached manner
    addToOauthDb(app, rowData).catch((e) => console.log(e));

    //Success Redirect
    return res.redirect(`${config.baseUrl}/app/success.html`);
  } catch (error) {
    console.log("Error Occured..");
    console.error(error);
    //Failure Redirect
    return res.redirect(`${config.baseUrl}/app/failure.html`);
  }
});

const addToOauthDb = async (app, rowData) => {
  const datastore = app.datastore();
  const table = datastore.table(config.oauthTableName);
  await table.insertRow(rowData);
};

const checkUser = async (app, userId) => {
  const zcql = app.zcql();
  const query = `SELECT zuid FROM ${config.oauthTableName} WHERE zuid=${userId}`;
  const response = await zcql.executeZCQLQuery(query);
  return response;
};

module.exports = router;
