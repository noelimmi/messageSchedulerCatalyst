const commadExecutionHandler = (req, res, next) => {
  const commandName = req.body.name;
  if (commandName === "schedule") {
    let message = "";
    if (req.body.params.arguments) {
      message = req.body.params.arguments.slice(0, 1000);
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
  } else if (commandName === "viewscheduled") {
    return res.status(200).json({
      output: {
        text: "View Scheduled Message Yet To Be Implemented..",
      },
    });
  } else {
    return res.status(404).json({
      output: {
        type: "banner",
        status: "failure",
        text: "Command Not Found...",
      },
    });
  }
};
module.exports = commadExecutionHandler;
