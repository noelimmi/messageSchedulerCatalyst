const getScheduledForm = (hint = "", message = "", datetime = {}) => ({
  output: {
    type: "form",
    title: "Schedule Message",
    name: "schMsg",
    hint: hint,
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
        value: datetime,
      },
    ],
    action: {
      type: "invoke.function",
      name: "msgSchFormHandler",
    },
  },
});

module.exports = getScheduledForm;
