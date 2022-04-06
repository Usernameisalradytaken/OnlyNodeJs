const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");
const database = require("../services/database");

const orderController = async (requestData) => {
  switch (requestData.method) {
    case "GET":
      return await getOrder(requestData);
    case "POST":
      return await postOrder(requestData);
    default:
      return null;
  }
};

const getOrder = async (requestData) => {
  const headers = requestData.headers;
  const email = requestData.query.email;
  const parsedData = JSON.parse(requestData.payload);
  const tokenIsValid = await tokenVerification(headers.token, email);
  if (!tokenIsValid)
    return {
      status: 400,
      payload: "Token is invalid",
      contentType: "text/html",
    };

  const tokenData = await database.read("tokens", headers.token);
  const userData = await database.read("users", tokenData.email);
  if (!userData)
    return {
      status: 400,
      payload: "Token not attached to user",
      contentType: "text/html",
    };

  const user = new User().fromSnapshot(userData);

  const orderData = await database.read("orders", parsedData.orderId);
  if (!orderData)
    return {
      status: 400,
      payload: "Wrong order ID",
      contentType: "text/html",
    };

  const order = new Order().fromSnapshot(orderData);

  if (order.email !== user.email)
    return {
      status: 400,
      payload: "Not Allowed",
      contentType: "text/html",
    };

  return {
    status: 400,
    payload: JSON.stringify(order),
    contentType: "text/html",
  };
};

const postOrder = async (requestData) => {
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
  const userData = await database.read("users", tokenData.email);
  if (!userData)
    return {
      status: 400,
      payload: "Token not attached to user",
      contentType: "text/html",
    };

  const user = new User().formSnapshot(userData);
  const cart = await database.read("carts", user.email);
  if (!cart)
    return {
      status: 400,
      payload: "no shopping cart",
      contentType: "text/html",
    };
  const newCart = new Cart().fromSnapshot(cart);
  if (newCart.items.length <= 0 || newCart.total === 0)
    return {
      status: 400,
      payload: "Cart empty",
      contentType: "text/html",
    };

  const order = new Order();
  order.amount = newCart.getTotal();
  order.email = user.email;
  order.items = newCart;

  if (!order.isValid())
    return {
      status: 400,
      payload: "Order is invalid",
      contentType: "text/html",
    };

  await database.create("orders", order.id, order);
  user.orders.push(order.id);
  await database.update("users", user.email, user);

  return {
    status: 200,
    payload: JSON.stringify(order),
    contentType: "html/text",
  };
};

module.exports = orderController;
