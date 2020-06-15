module.exports = (cronDetails, context) => {
  console.log(cronDetails.getCronParam("message"));
  console.log(cronDetails.getCronParam("chatId"));
  console.log(cronDetails.getCronParam("zuid"));
  console.log(cronDetails.getCronParam("scheduledTimestamp"));
  context.closeWithSuccess();
};
