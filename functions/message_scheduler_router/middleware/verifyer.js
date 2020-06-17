const crypto = require("crypto");
const config = require("../config");

const verifier = () => {
  return (req, res, next) => {
    const signature = req.headers["x-cliq-signature"];
    const verifier = crypto.createVerify("sha256");
    verifier.update(JSON.stringify(req.body));
    const result = verifier.verify(
      config.extensionPublicKey,
      signature,
      "base64"
    );
    console.log(result);
    next();
  };
};

module.exports = verifier;
