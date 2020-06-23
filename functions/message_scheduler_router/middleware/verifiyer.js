const crypto = require("crypto");
const config = require("../config");

const verifier = (req, res, next) => {
  try {
    const signature = req.headers["x-cliq-signature"];
    const bodyString = JSON.stringify(req.body);
    const verifier = crypto.createVerify("sha256");
    verifier.update(bodyString);
    const result = verifier.verify(
      config.extensionPublicKey,
      signature,
      "base64"
    );
    console.log(result);
    next();
  } catch (error) {
    console.log(error);
    next();
  }
};

module.exports = verifier;
