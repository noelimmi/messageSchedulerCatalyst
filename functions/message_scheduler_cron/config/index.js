const isDev = false;
const baseUrl = isDev
  ? "http://localhost:3000"
  : "https://messagescheduler-716534823.development.zohocatalyst.com";
const config = {
  baseUrl,
  client_id: "1000.U51MVSGKUIV3N5J06RRSQGJYUF7G6H",
  client_secret: "00e05af97bba079f7b9bef9f3181bc000339ecf44e",
  redirect_uri: `${baseUrl}/server/message_scheduler_router/oauth/callback`,
  oauthTableName: "oauthManagement",
  scheduledMessageTableName: "scheduledMessage",
  encryptKey:
    "8324d46a5e30b55abc8c525b79fa7cffd9f95490bb8a3798d4969202b712a051",
  encryptIv: "316079c909274baa68b2e7a0e2c04d6d",
  encryptAlgorithm: "aes-256-cbc",
};
module.exports = config;
