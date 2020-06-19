const config = require("../config");

const findUser = async (app, userId) => {
  try {
    const searchQuery = {
      search: userId,
      search_table_columns: {},
    };
    searchQuery["search_table_columns"][`${config.oauthTableName}`] = ["zuid"];
    const result = await app.search().executeSearchQuery(searchQuery);
    return result;
  } catch (error) {
    return {};
  }
};

const isActiveUser = (searchObj) =>
  Object.keys(searchObj).length !== 0 &&
  searchObj[`${config.oauthTableName}`][0]["isActive"]
    ? true
    : false;

module.exports = {
  findUser,
  isActiveUser,
};
