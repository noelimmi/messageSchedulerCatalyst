const getChatTitle = (chatObj) => {
  let title = "";
  if (chatObj.type === "dm") {
    title =
      chatObj.members.length > 0 ? chatObj.members[1]["first_name"] : null;
  } else {
    title = chatObj.title;
  }
  return title;
};

module.exports = getChatTitle;
