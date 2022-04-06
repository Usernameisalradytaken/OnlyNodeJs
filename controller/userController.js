const database = require("../services/database");
const User = require("../models/User");
const tokenVerification = require("../services/tokenVerification");

const userController = async (requestData) => {
  switch (requestData.method) {
    case "GET":
      return await getUser(requestData);
    case "PUT":
      return await putUser(requestData);
    case "POST":
      return await postUser(requestData);
    case "DELETE":
      return await deleteUser(requestData);
    /// TODO
    default:
      return null;
  }
};

const postUser = async (requestData) => {
  const parsedData = JSON.parse(requestData.payload);
  const userData = new User().fromObject(parsedData);
  if (!userData.isvalid())
    return {
      status: 400,
      payload: "Required field missing",
      contentType: "text/html",
    };

  const isUserExists = await database.read("users", userData.email);
  if (isUserExists)
    return {
      status: 400,
      payload: "user already exists",
      contentType: "text/html",
    };

  await database.create("users", userData.email, userData);
  return {
    status: 200,
    payload: "user has been create",
    contentType: "text/html",
  };
};

const getUser = async (requestData) => {
  const email = requestData.query.email;

  if (!email)
    return {
      status: 400,
      payload: "Mising required fields",
      contentType: "text/html",
    };
  const headers = requestData.headers;

  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const user = await database.read("users", email);
  if (!user)
    return {
      status: 400,
      payload: "user does't exists",
      contentType: "text/html",
    };

  const { hashpassword, ...userDetails } = user;

  return {
    status: 200,
    payload: JSON.stringify(userDetails),
    contentType: "text/html",
  };
};

const putUser = async (requestData) => {
  const email = requestData.query.email;
  if (!email)
    return {
      status: 400,
      payload: "Mising required fields",
      contentType: "text/html",
    };
  const headers = requestData.headers;

  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const user = await database.read("users", email);

  if (!user)
    return {
      status: 400,
      payload: "user does't exists",
      contentType: "text/html",
    };
  const newUser = new User().formSnapshot(user);
  const parsedData = JSON.parse(requestData.payload);

  newUser.updateUser(parsedData);

  await database.update("users", email, newUser);
  return {
    status: 200,
    payload: "user has been updated",
    contentType: "text/html",
  };
};

const deleteUser = async (requestData) => {
  const email = requestData.query.email;
  if (!email)
    return {
      status: 400,
      payload: "Mising required fields",
      contentType: "text/html",
    };

  const headers = requestData.headers;

  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const user = await database.read("users", email);
  if (!user)
    return {
      status: 400,
      payload: "user does't exists",
      contentType: "text/html",
    };

  await database.delete("users", email);
  return {
    status: 200,
    payload: "user has been deleted",
    contentType: "text/html",
  };
};

module.exports = userController;
