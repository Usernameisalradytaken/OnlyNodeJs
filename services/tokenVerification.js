const Token = require("../models/Token");
const database = require("./database");

const tokenVerification = async (id, email) => {
  const tokenData = await database.read("tokens", id);

  if (!tokenData)
    /// token is not present
    return false;

  const token = new Token().fromSnapshot(tokenData);
  if (token.isExpired())
    /// is token expired ??
    return false;

  if (token.email != email) return false;

  return true;
};

module.exports = tokenVerification;
