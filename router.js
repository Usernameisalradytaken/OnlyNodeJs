const pingController = require("./controller/pingController");
const tokenController = require("./controller/tokenController");
const userController = require("./controller/userController");
const menuController = require("./controller/menuController");
const cartController = require("./controller/cartController");
const templateController = require("./controller/templateController");
const assetsController = require("./controller/assetsController");
const orderController = require("./controller/orderController");
const router = {};
// routes the request to their specific controller
router.routes = {
  "/api/ping": pingController,
  "/api/token": tokenController,
  "/api/user": userController,
  '/api/order' : orderController,
  "/api/cart": cartController,
  "/api/menu": menuController,
  /// assets route
  "/assets/*": assetsController,
  /// front end routes
  "/" : templateController,
  "/good/morning" : templateController,
};

router.notFound = async (request) => {
  const responseContainer = {
    status: 400,
    payload: "<h1>This is a 404 request</h1>",
    contentType: "text/html",
  };
  return responseContainer;
};

module.exports = router;
