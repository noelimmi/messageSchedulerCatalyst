const isDev = true;
const baseUrl = `https://664143a3aeb7.ngrok.io`;
const config = {
    baseUrl,
    client_id: "1000.35X3R7HJSD7AIQZX4PP2CNH5LR5QGY",
    client_secret: "4ecd44c1cec5e630d03298ecf07d482ab761efdbab",
    redirect_uri: `${baseUrl}/server/message_scheduler_router/oauth/callback`,
    oauthTableName: "oauthManagement",
    scheduledMessageTableName: "scheduledMessage",
    cronFunctionId: "6740000000509004",
    encryptKey: "8324d46a5e30b55abc8c525b79fa7cffd9f95490bb8a3798d4969202b712a051",
    encryptAlgorithm: "aes-256-cbc",
    extensionPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlWyl4ddTGKLTja0tLSzRt4O3J+Pd8mR5ao/8pnyB0QyefBBca25UzwjIinkq74voCYo6jKPhCtrXan2iqr4WWdmCTyrOHVvQKtcmhVJq9Zqy6fPd+gSOtXFA8qgJr7J1Xfm8GRTOkcGJs/vV4sFAOzPXHP96BwQKRnjny/IJcyppGCy3+N6iwm3/8mpPantXqqwJ9pKHC/pkEJX0hOUyS/SIvrOzxHmgparisjuTIgJlDeq5DUm0To2nSSqqoCvJX2RM4JwEwg/PlPvIvv9eE2ZLMewSbQMflbjErtZBLriYvJN9N45QDP1FfREo8G3M0ozm8nZwjEXVxj5TAh+cGwIDAQAB",
};
module.exports = config;