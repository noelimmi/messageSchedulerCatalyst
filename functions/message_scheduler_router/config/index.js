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
  cronFunctionId: "6594000000020003",
  encryptKey:
    "8324d46a5e30b55abc8c525b79fa7cffd9f95490bb8a3798d4969202b712a051",
  encryptAlgorithm: "aes-256-cbc",
  extensionPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnoslSNRJ03qXa7AFW+G3qXAfA9vF4OaJcnETCLBAeGy54CSKhhv7zLMcNK3o7Gs71hRXFTvUcC2oCPTx+xZ0sZPKy5j91PwnJWKRMzmtqgXavD67O8IXKRnlX0WFYCw1UQRvcZlQzbWJAFO8I1LfHoNr0LvU9Sf3vevPvIcmSB9GEFxGXIxcl1tw+/vTBfkczk8BmLbyNXBkNtx1esK+wF1PVASj61thnC0vWtnx2AunsoH9GBGWqv76D90RW8yTOFmcL9r8reyliv5W01B3qPegLkKrJb7TnHNU+bz4E3FVZdBLH9dZE4oI4BDHThHwHAX1bNKmtXmXOXkZy0xVXQIDAQAB",
};
module.exports = config;
