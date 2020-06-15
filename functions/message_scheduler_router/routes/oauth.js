const express = require("express");
const config = require("config");
const axios = require("axios");

//Init Router
const router = express.Router();

router.get("/callback",async(req,res)=>{
    try {
        const code = req.query.code;
        const state = req.query.state;
        const response = (await axios.post("https://accounts.zoho.com/oauth/v2/token",null,{
            params:{
                code,
                state,
                grant_type:"authorization_code",
                scope:"ZohoCliq.Webhooks.CREATE,ZohoCliq.Users.READ",
                client_id: "1000.U51MVSGKUIV3N5J06RRSQGJYUF7G6H",
                client_secret:"00e05af97bba079f7b9bef9f3181bc000339ecf44e",
                redirect_uri:"http://localhost:3000/server/message_scheduler_router/oauth/callback"
            }
        })).data;
        console.log(response);
        res.send(response);
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