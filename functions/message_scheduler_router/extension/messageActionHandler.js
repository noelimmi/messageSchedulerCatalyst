const messageActionHandler = (req, res, next) => {
  let message = "";
  if (req.body.params.message && req.body.params.message.text) {
    message = req.body.params.message.text.slice(0, 1000);
  }
  return res.status(200).json({
    output: {
      type: "form",
      title: "Schedule Message",
      name: "schMsg",
      button_label: "Schedule",
      inputs: [
        {
          type: "textarea",
          name: "message",
          label: "Message",
          placeholder: "Enter message to be scheduled.",
          min_length: "0",
          max_length: "1000",
          mandatory: true,
          value: message,
        },
        {
          type: "datetime",
          name: "scheduledTime",
          label: "Schedule Date & Time",
          placeholder: "Schedule date and time for message to be sent",
          mandatory: true,
          hint: "Please enter time ahead of current time",
        },
      ],
      action: {
        type: "invoke.function",
        name: "msgSchFormHandler",
      },
    },
  });
};
module.exports = messageActionHandler;
