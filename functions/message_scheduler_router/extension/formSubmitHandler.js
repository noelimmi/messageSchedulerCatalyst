const formSubmitHandler = (req, res, next) => {
  return res.status(200).json({
    output: {
      type: "banner",
      status: "success",
      text: "Successfully Form has been.",
    },
  });
};
module.exports = formSubmitHandler;
