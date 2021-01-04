const crypto = require("crypto");
const config = require("../config");

const verifier = (req, res, next) => {
  try {
    const publicKey = `-----BEGIN PUBLIC KEY-----\n${config.extensionPublicKey}\n-----END PUBLIC KEY-----`;
    const signature = req.headers["x-cliq-signature"];
    if (!signature) {
      throw new Error(
        "Request should be made from cliq with a valid signature."
      );
    }
    const bodyString = JSON.stringify(req.body);
    const verifier = crypto.createVerify("sha256");
    verifier.update(bodyString);
    const result = verifier.verify(publicKey, signature, "base64");
    if (!result) {
      throw new Error(
        "Request should be made from cliq with a valid signature."
      );
    }
    return next();
  } catch (error) {
    console.error(error);
    return res
      .status(400)
      .json({ error: "Request Not Allowed Validation Failed." });
  }
};

module.exports = verifier;
