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
  cronFunctionId: "6594000000020003",
  extensionPublicKey:
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhiyfpyzRFrWGKM0fAJJht3rvX/Dg5pmxHmJHY/LjebM2XltYt13N1+a7hfECzSg3Dx7zGzKkHXGQTTMG6bub4aoRtFGIWgZfH0456aRAa8l7MAG56EyMAF4PfkTzGYgCAeMp2dDB9lOQoZDh6wyxPh0KmsPL6HlsQXORxwM9LogB4EsOajnbyk9KVTAf6P/0AwBEfvO2Ma8kS+8pCo+CzSxIcDdsQ1a1/jFSpYs7kXdQe2BwFNm2Mv3Z40oLZgE0LYzz7mYwyjBxxnH4rzZMbqWZXwK1Kg2p87m6+a8JK271WIWvbJr1dStT3SaELAqYOb052agwCQcjF5uNOlyV3wIDAQAB",
};
module.exports = config;
