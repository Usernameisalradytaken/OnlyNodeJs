const validator = require("../services/validator");
/// this menuitem will be used in cart
class MenuItem {
  constructor({id, name, price, image, quantity}) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
  }
  toObject() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      image: this.image,
      quantity: this.quantity,
    };
  }
}

module.exports = MenuItem