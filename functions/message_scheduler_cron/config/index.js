const isDev = true;
const baseUrl = `https://messagescheduler-701800584.${isDev ? "development" : "production"}.zohocatalyst.com`;
const config = {
    baseUrl,
    client_id: "1000.35X3R7HJSD7AIQZX4PP2CNH5LR5QGY",
    client_secret: "4ecd44c1cec5e630d03298ecf07d482ab761efdbab",
    redirect_uri: `${baseUrl}/server/message_scheduler_router/oauth/callback`,
    oauthTableName: "oauthManagement",
    scheduledMessageTableName: "scheduledMessage",
    encryptKey: "8324d46a5e30b55abc8c525b79fa7cffd9f95490bb8a3798d4969202b712a051",
    encryptAlgorithm: "aes-256-cbc",
};
module.exports = config;