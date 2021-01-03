const config = require("../config");

CommonUtil = {
    getDomainFromDC : (dc) => { 
        const EUDC   = "zoho.eu";
        const USDC   = "zoho.com";
        const INDC   = "zoho.in";
        const AUDC   = "zoho.com.au";
        switch(dc){
            case "EU" : return EUDC;
            case "IN" : return INDC;
            case "AU" : return AUDC;
            default   : return USDC;
        }
    },
    getConnectionResponse: (dc,userId) => {
        const currDC = CommonUtil.getDomainFromDC(dc);
        console.log(currDC);
        const authUrl = `https://accounts.${currDC}/oauth/v2/auth?scope=ZohoCliq.Webhooks.CREATE&client_id=${config.client_id}&state=${userId}&response_type=code&redirect_uri=${config.redirect_uri}&access_type=offline&prompt=consent`;
        return {
          output: {
            text:
              "It seems like you haven't yet connected *message scheduler* with *cliq* . Click *Connect* below to proceed further.",
            card: { theme: "modern-inline" },
            buttons: [
              {
                label: "Connect",
                hint: "Connect message scheduler with cliq",
                type: "+",
                action: { type: "open.url", data: { web: authUrl } },
              },
            ],
          },
        };
    }
};

module.exports = {
    CommonUtil
};