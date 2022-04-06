/// get , delete and create token
const Token = require("../models/Token");
const database = require("../services/database");
const tokenController = async (requestData) => {
  switch (requestData.method) {
    case "GET":
      return await getToken(requestData);
    case "POST":
      return await postToken(requestData);
    case "DELETE":
      return await deleteToken(requestData);
    //// TODO
    default:
      return "";
  }
};

const getToken = async (requestData) => {
  const tokenId = requestData.query.tokenId;
  if (!tokenId)
    return {
      status: 400,
      payload: "Missing required fields",
      contentType: "text/html",
    };

  const token = await database.read("tokens", tokenId);

  if (!token)
    return {
      status: 400,
      payload: "could not find the token",
      contentType: "text/html",
    };
    const newToken = new Token().fromSnapshot(token);
    console.log("===========iamherer================");
    console.log(newToken);
  return {
    status: 200,
    payload: JSON.stringify(newToken.toObject()),
    contentType: "text/html",
  };
};

const postToken = async (requestData) => {
  /// email, password, id , date
  /// why? password actually one user can create a token
  /// for other user and then volia everything is in their hand
  
  const parsedData = JSON.parse(requestData.payload);
  const token = new Token().fromObject(parsedData);
  if (!token.isValid())
  return {
      status: 400,
      payload: "Mising required fields",
      contentType: "text/html",
    };
    
    const user = await database.read("users", token.email);
    
  if (!user)
    return {
      status: 400,
      payload: "could not find the user",
      contentType: "text/html",
    };

  if (token.hashpassword == user.hashpassword)
    return {
      status: 400,
      payload: "Password doesn't match",
      contentType: "text/html",
    };

  await database.create("tokens", token.id, token);
  return { status: 200, payload: JSON.stringify(token.toObject()), contentType: "text/html" };
};

const deleteToken = async (requestData) => {
  const tokenId = requestData.query.tokenId;
  if (!tokenId)
    return {
      status: 400,
      payload: "Missing required fields",
      contentType: "text/html",
    };

  const token = await database.read("tokens", tokenId);

  if (!token)
    return {
      status: 400,
      payload: "could not find the token",
      contentType: "text/html",
    };

  await database.delete("tokens", token.id);
  return { status: 200, payload: "Token has been deleted", contentType: "text/html" };
};

module.exports = tokenController;
