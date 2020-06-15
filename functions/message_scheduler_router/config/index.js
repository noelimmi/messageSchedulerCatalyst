const isDev = true;
const baseUrl = isDev
  ? "http://localhost:3000"
  : "https://messagescheduler-716534823.development.zohocatalyst.com";
const config = {
  baseUrl,
  client_id: "1000.U51MVSGKUIV3N5J06RRSQGJYUF7G6H",
  client_secret: "00e05af97bba079f7b9bef9f3181bc000339ecf44e",
  redirect_uri: `${baseUrl}/server/message_scheduler_router/oauth/callback`,
  oauthTableName: "oauthManagement",
  cronFunctionId: "6594000000020003",
};
module.exports = config;
