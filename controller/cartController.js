// create , read , delete, update

const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");
const database = require("../services/database");
const tokenVerification = require("../services/tokenVerification");

//
const cartController = async (requestData) => {
  switch (requestData.method) {
    case "GET":
      return await getCart(requestData);
    case "POST":
      return await postCart(requestData);
    case "PUT":
      return await putCart(requestData);
    case "DELETE":
      return await deleteCart(requestData);
    /// TODO:
    default:
      return null;
  }
};

// get all items in cart
const getCart = async (requestData) => {
  const headers = requestData.headers;
  const email = requestData.query.email;

  const tokenIsValid = await tokenVerification(headers.token, email);
  console.log(tokenIsValid);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const tokenData = await database.read("tokens", headers.token);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };
  const cart = await database.read("carts", tokenData.email);
  if (!cart)
    return {
      status: 400,
      payload: "Cart doesn't exists",
      contentType: "text/html",
    };

  return {
    status: 400,
    payload: JSON.stringify(cart),
    contentType: "text/html",
  };
};
// create a new cart
const postCart = async (requestData) => {
  const headers = requestData.headers;
  const email = requestData.query.email;
  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const tokenData = await database.read("tokens", headers.token);

  const cart = await database.read("carts", tokenData.email);
  if (cart)
    return {
      status: 400,
      payload: "Cart already exists",
      contentType: "text/html",
    };
  const newCart = new Cart();
  await database.create("carts", tokenData.email, newCart);
  return {
    status: 400,
    payload: JSON.stringify(newCart.toObject()),
    contentType: "text/html",
  };
};
// to add items in cart
const putCart = async (requestData) => {
  const headers = requestData.headers;
  const email = requestData.query.email;
  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const tokenData = await database.read("tokens", headers.token);
  //{
  //	"id": 4,
  //	"quantity": 2
  //}
  const parsedData = JSON.parse(requestData.payload);

  if (!parsedData || parsedData.id < 0 || parsedData.quantity < 0)
    return {
      status: 400,
      payload: "Missing required fields",
      contentType: "text/html",
    };

  const cartData = await database.read("carts", tokenData.email);
  if (!cartData)
    return {
      status: 400,
      payload: "There is no Cart",
      contentType: "text/html",
    };

  const newCart = new Cart().fromSnapshot(cartData);
  const menuData = await database.read("menus", "main");
  if (!menuData)
    return {
      status: 400,
      payload: "There is no menu",
      contentType: "html/text",
    };
  const menuItemToAdd = menuData.find((item) => item.id == parsedData.id);
  if (!menuItemToAdd)
    return {
      status: 400,
      payload: "no item found with provided id",
      contentType: "text/html",
    };
  //// menuItem
  const menuItem = new MenuItem(menuItemToAdd);
  menuItem.quantity = parsedData.quantity;
  newCart.updateCart(menuItem);

  await database.update("carts", tokenData.email, newCart);
  return {
    status: 400,
    payload: JSON.stringify(newCart),
    contentType: "text/html",
  };
};

// delete cart
const deleteCart = async (requestData) => {
  const headers = requestData.headers;
  const email = requestData.query.email;

  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const tokenData = await database.read("tokens", headers.token);
  const cart = await database.read("carts", tokenData.email);
  if (!cart)
    return {
      status: 400,
      payload: "There is no cart",
      contentType: "text/html",
    };

  await database.delete("carts", tokenData.email);
  return {
    status: 400,
    payload: "cart is deleted",
    contentType: "text/html",
  };
};

module.exports = cartController;
