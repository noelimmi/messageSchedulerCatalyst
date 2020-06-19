const config = require("../config");

// const findUser = async (app, userId) => {
//   try {
//     const searchQuery = {
//       search: userId,
//       search_table_columns: {},
//     };
//     searchQuery["search_table_columns"][`${config.oauthTableName}`] = ["zuid"];
//     const result = await app.search().executeSearchQuery(searchQuery);
//     return result;
//   } catch (error) {
//     return {};
//   }
// };

// const isActiveUser = (searchObj) => {
//   console.log(searchObj);
//   return Object.keys(searchObj).length !== 0 &&
//     searchObj[`${config.oauthTableName}`][0]["isActive"]
//     ? true
//     : false;
// };
const findUser = async (app, userId) => {
  try {
    const zcql = app.zcql();
    const query = `SELECT isActive FROM ${config.oauthTableName} WHERE zuid=${userId}`;
    return await zcql.executeZCQLQuery(query);
  } catch (error) {
    return [];
  }
};

const isActiveUser = (searchArr) => {
  //console.log(searchArr);
  return searchArr.length !== 0 &&
    searchArr[0][config.oauthTableName]["isActive"]
    ? true
    : false;
};

module.exports = {
  findUser,
  isActiveUser,
};
