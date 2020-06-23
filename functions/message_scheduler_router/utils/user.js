const config = require("../config");

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
