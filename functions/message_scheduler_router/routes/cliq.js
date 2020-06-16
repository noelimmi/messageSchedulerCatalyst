const express = require("express");
//Init Router
const router = express.Router();

router.post("/callback", async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.body);
    return res.status(200).json({ text: "Hello World" });
  } catch (error) {
    return res.status(500).json({ text: "Internal Server Error" });
  }
});

module.exports = router;
